import Link from "next/link"
import { ArrowRight, Crown, Video } from "lucide-react"
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
    return (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3.5">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                <Video className="h-3.5 w-3.5" />
                <span>Your live classroom</span>
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
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white" title={classroom.name}>
                        {classroom.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-neutral-400">
                        Trainer: {classroom.trainer} · {classroom.maxStudents}-seat live room · Class 1: {firstClassLabel}
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
                href="/classrooms"
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 underline-offset-2 hover:underline"
            >
                See the classroom <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
    )
}
