import Link from "next/link"
import { ArrowRight, Crown, GraduationCap, Video } from "lucide-react"
import type { BootcampClassroom } from "@/lib/bootcamp-classrooms"

// Shows the real Celoris classroom a free bootcamp is taught in. Free-seat students
// learn in the same live room as paid Pro members; Pro members get extra perks.

interface Props {
    classroom: BootcampClassroom
    /** e.g. "Wed 28 Oct, 12:00 PM IST" */
    firstClassLabel: string
    compact?: boolean
}

export function BootcampClassroomCard({ classroom, firstClassLabel, compact }: Props) {
    const classroomUrl = classroom.id ? `/classrooms?room=${classroom.id}` : "/classrooms"

    return (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3.5">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    <Video className="h-3.5 w-3.5" />
                    <span>Live 3D Virtual Aula</span>
                </div>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-emerald-300">
                    Direct Entry
                </span>
            </div>
            <div className="flex items-center gap-3">
                {classroom.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={classroom.image}
                        alt={classroom.name}
                        width={64}
                        height={64}
                        loading="lazy"
                        className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover"
                    />
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white" title={classroom.name}>
                        {classroom.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-neutral-400">
                        Trainer: <strong className="text-white">{classroom.trainer}</strong> · Class 1: <strong className="text-emerald-300">{firstClassLabel}</strong>
                    </p>
                </div>
            </div>
            {!compact && (
                <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-neutral-400">
                    <Crown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                    <span>
                        Free-seat students learn in this same live classroom with our paid Pro members. Pro members get extra perks, like
                        speaking on the mic; free students ask their questions in the class chat.
                    </span>
                </p>
            )}
            <Link
                href={classroomUrl}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.01] active:scale-98 cursor-pointer"
            >
                <GraduationCap className="h-4 w-4" />
                <span>Enter Live Classroom</span>
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </Link>
        </div>
    )
}
