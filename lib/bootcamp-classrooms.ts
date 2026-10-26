// The live classroom each free bootcamp is taught in (server only: uses the service-role client).
// Only public display fields are read here, never the classroom passcodes.

import { createServiceRoleClient } from "@/lib/supabase-client"
import { BOOTCAMPS, type BootcampSlug } from "@/lib/bootcamps"

export interface BootcampClassroom {
    id: string
    name: string
    trainer: string
    maxStudents: number
    image: string | null
}

export async function getBootcampClassrooms(): Promise<Partial<Record<BootcampSlug, BootcampClassroom>>> {
    const out: Partial<Record<BootcampSlug, BootcampClassroom>> = {}
    const ids = BOOTCAMPS.map((b) => b.classroomId).filter(Boolean) as string[]
    if (!ids.length) return out
    try {
        const admin: any = createServiceRoleClient()
        const { data } = await admin
            .from("cafe_classrooms")
            .select("id,name,trainer_name,max_students,course_image_url,is_active")
            .in("id", ids)
        for (const b of BOOTCAMPS) {
            const row = (data || []).find((r: any) => r.id === b.classroomId && r.is_active)
            if (!row) continue
            out[b.slug] = {
                id: row.id,
                name: row.name,
                trainer: row.trainer_name || b.trainer,
                maxStudents: row.max_students || 15,
                image: row.course_image_url || null,
            }
        }
    } catch (e) {
        console.error("[bootcamp-classrooms]", e)
    }
    return out
}
