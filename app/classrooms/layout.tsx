import type { Metadata } from 'next'
import SocialLayout from '../social/layout'

// /classrooms is the Classrooms page (it used to live at /social, which now
// redirects here — see next.config.js). Same members-only layout as before.
export const metadata: Metadata = {
  title: 'Live Classrooms',
  description: 'Join live trainer-led classes in small batches — 3D classrooms and whiteboard rooms on Celoris.',
  alternates: { canonical: '/classrooms' },
}

export default function ClassroomsLayout({ children }: { children: React.ReactNode }) {
  return <SocialLayout>{children}</SocialLayout>
}
