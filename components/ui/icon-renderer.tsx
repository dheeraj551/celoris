import React from 'react'
import * as Icons from 'lucide-react'
import { Building } from 'lucide-react'

interface IconRendererProps {
    name: string | null | undefined
    className?: string
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className }) => {
    if (!name) return <Building className={className} />

    // Capitalize first letter just in case
    const iconName = name.charAt(0).toUpperCase() + name.slice(1)

    const Icon = (Icons as any)[iconName] || Building

    return <Icon className={className} />
}
