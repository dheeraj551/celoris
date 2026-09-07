"use client"

import React, { useEffect, useRef } from 'react'
import { computeSeatLayout } from './seatLayout'

export interface StageSeat {
    id: string
    name: string
    avatarUrl?: string | null
    isHost: boolean
    handRaised: boolean
    canSpeak: boolean
    micOn: boolean
    /** 0 (silent) to 1 (loud) — drives the speaking ring pulse. */
    speakingLevel: number
}

interface RoomStageProps {
    seats: StageSeat[]
    className?: string
}

// Decorative PixiJS layer behind the real Agora <video> tiles: seat rings,
// avatar portraits, the host's stage glow, hand-raise badges and a
// speaking pulse. This never handles clicks or media itself — it's purely
// the "give the room character" layer described in the Cafe design
// philosophy. Real interaction (Allow/mute buttons, video) stays normal
// React/DOM, positioned with the same computeSeatLayout() math so the two
// layers never drift apart.
export default function RoomStage({ seats, className }: RoomStageProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const appRef = useRef<any>(null)
    const seatLayerRef = useRef<any>(null)
    const seatNodesRef = useRef<Map<string, any>>(new Map())
    const textureCacheRef = useRef<Map<string, any>>(new Map())
    const seatsRef = useRef<StageSeat[]>(seats)
    const destroyedRef = useRef(false)

    useEffect(() => {
        seatsRef.current = seats
    }, [seats])

    useEffect(() => {
        let cancelled = false
        destroyedRef.current = false

        async function setup() {
            const PIXI = await import('pixi.js')
            if (cancelled || !containerRef.current) return

            const app = new PIXI.Application()
            await app.init({
                backgroundAlpha: 0,
                antialias: true,
                resizeTo: containerRef.current,
                resolution: Math.min(window.devicePixelRatio || 1, 2),
                autoDensity: true,
            })

            if (cancelled || destroyedRef.current) {
                app.destroy(true, { children: true })
                return
            }

            containerRef.current.appendChild(app.canvas)
            app.canvas.style.width = '100%'
            app.canvas.style.height = '100%'
            app.canvas.style.pointerEvents = 'none' // decorative only

            const seatLayer = new PIXI.Container()
            app.stage.addChild(seatLayer)

            appRef.current = app
            seatLayerRef.current = seatLayer

            app.ticker.add(() => rebuildOrUpdate(PIXI))
        }

        setup()

        return () => {
            cancelled = true
            destroyedRef.current = true
            seatNodesRef.current.clear()
            textureCacheRef.current.clear()
            if (appRef.current) {
                appRef.current.destroy(true, { children: true })
                appRef.current = null
                seatLayerRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getFallbackColor(id: string) {
        const palette = [0x10b981, 0x14b8a6, 0x0ea5e9, 0x84cc16, 0xf59e0b]
        let hash = 0
        for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
        return palette[hash % palette.length]
    }

    function buildSeatNode(PIXI: any, seat: StageSeat) {
        const node = new PIXI.Container()
        node.label = seat.id

        const ring = new PIXI.Graphics()
        node.addChild(ring)
        node.__ring = ring

        const portrait = new PIXI.Container()
        node.addChild(portrait)
        node.__portrait = portrait

        const fallback = new PIXI.Graphics()
        portrait.addChild(fallback)
        node.__fallback = fallback

        const initials = new PIXI.Text({
            text: (seat.name || '?').trim().charAt(0).toUpperCase(),
            style: { fill: 0x0a0a0a, fontWeight: '800', fontFamily: 'sans-serif' },
        })
        initials.anchor.set(0.5)
        portrait.addChild(initials)
        node.__initials = initials

        const handBadge = new PIXI.Graphics()
        node.addChild(handBadge)
        node.__handBadge = handBadge

        const micBadge = new PIXI.Graphics()
        node.addChild(micBadge)
        node.__micBadge = micBadge

        return node
    }

    async function loadAvatarSprite(PIXI: any, seat: StageSeat, node: any, size: number) {
        if (!seat.avatarUrl) return
        let texture = textureCacheRef.current.get(seat.avatarUrl)
        if (!texture) {
            try {
                texture = await PIXI.Assets.load(seat.avatarUrl)
                textureCacheRef.current.set(seat.avatarUrl, texture)
            } catch {
                return // fall back to initials silently — a bad avatar URL shouldn't break the room
            }
        }
        if (destroyedRef.current || node.destroyed) return

        const portrait = node.__portrait
        if (portrait.__spriteFor === seat.avatarUrl) {
            positionSprite(portrait, size)
            return
        }

        portrait.removeChildren().forEach((c: any) => { if (c !== node.__fallback) c.destroy() })
        portrait.addChild(node.__fallback)

        const sprite = new PIXI.Sprite(texture)
        sprite.anchor.set(0.5)
        const mask = new PIXI.Graphics().circle(0, 0, size / 2).fill(0xffffff)
        portrait.addChild(mask)
        portrait.addChild(sprite)
        sprite.mask = mask
        portrait.__spriteFor = seat.avatarUrl
        node.__fallback.visible = false
        positionSprite(portrait, size)
    }

    function positionSprite(portrait: any, size: number) {
        const sprite = portrait.children.find((c: any) => c.mask !== undefined)
        if (!sprite || !sprite.texture?.width) return
        const scale = size / Math.min(sprite.texture.width, sprite.texture.height)
        sprite.scale.set(scale)
    }

    function rebuildOrUpdate(PIXI: any) {
        const layer = seatLayerRef.current
        if (!layer || destroyedRef.current) return
        const app = appRef.current
        const width = app?.renderer?.width || 0
        const height = app?.renderer?.height || 0
        if (!width || !height) return

        const currentSeats = seatsRef.current
        const students = currentSeats.filter(s => !s.isHost)
        const host = currentSeats.find(s => s.isHost)
        const layout = computeSeatLayout(width, height, students.length)

        const seen = new Set<string>()
        const now = performance.now() / 1000

        const place = (seat: StageSeat | undefined, rect: { x: number; y: number; size: number }) => {
            if (!seat) return
            seen.add(seat.id)
            let node = seatNodesRef.current.get(seat.id)
            if (!node) {
                node = buildSeatNode(PIXI, seat)
                seatNodesRef.current.set(seat.id, node)
                layer.addChild(node)
                loadAvatarSprite(PIXI, seat, node, rect.size)
            } else if (node.__lastAvatar !== seat.avatarUrl) {
                loadAvatarSprite(PIXI, seat, node, rect.size)
            }
            node.__lastAvatar = seat.avatarUrl

            node.x = rect.x
            node.y = rect.y

            // Base ring: host gets a warm amber "on stage" ring, everyone
            // else a subtle emerald outline. A pulse (driven by Agora's
            // real audio volume level) rides on top when they're speaking.
            const pulse = seat.speakingLevel > 0.02
                ? 1 + Math.sin(now * 10) * 0.03 * Math.min(seat.speakingLevel * 4, 1)
                : 1
            node.__ring.clear()
            const ringColor = seat.isHost ? 0xf59e0b : (seat.canSpeak ? 0x34d399 : 0x27272a)
            const ringWidth = seat.speakingLevel > 0.02 ? 4 : 2
            node.__ring
                .circle(0, 0, (rect.size / 2 + 6) * pulse)
                .stroke({ width: ringWidth, color: ringColor, alpha: seat.speakingLevel > 0.02 ? 0.95 : 0.6 })

            node.__fallback.clear()
            if (!seat.avatarUrl || !node.__portrait.__spriteFor) {
                node.__fallback
                    .circle(0, 0, rect.size / 2)
                    .fill(getFallbackColor(seat.id))
                node.__fallback.visible = true
            }
            node.__initials.style.fontSize = Math.max(rect.size * 0.36, 10)
            node.__initials.text = (seat.name || '?').trim().charAt(0).toUpperCase() || '?'

            node.__handBadge.clear()
            if (seat.handRaised && !seat.canSpeak) {
                const bx = rect.size * 0.32
                const by = -rect.size * 0.32
                node.__handBadge
                    .circle(bx, by, Math.max(rect.size * 0.16, 9))
                    .fill(0xfbbf24)
                    .stroke({ width: 2, color: 0x0a0a0a })
            }

            node.__micBadge.clear()
            if (seat.canSpeak && !seat.micOn) {
                const bx = -rect.size * 0.32
                const by = rect.size * 0.32
                node.__micBadge
                    .circle(bx, by, Math.max(rect.size * 0.14, 8))
                    .fill(0xef4444)
                    .stroke({ width: 2, color: 0x0a0a0a })
            }
        }

        place(host, layout.host)
        students.forEach((s, i) => place(s, layout.students[i]))

        // Remove nodes for anyone who left.
        for (const [id, node] of seatNodesRef.current.entries()) {
            if (!seen.has(id)) {
                layer.removeChild(node)
                node.destroy({ children: true })
                seatNodesRef.current.delete(id)
            }
        }
    }

    return <div ref={containerRef} className={className} style={{ position: 'absolute', inset: 0 }} />
}
