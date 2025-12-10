import { LucideIcon } from 'lucide-react';

export interface StatProps {
    label: string;
    value: string;
    icon: LucideIcon;
}

export interface FeatureCardProps {
    title: string;
    description: string;
    tag: string;
    icon: LucideIcon;
    actionText: string;
}

export interface BlogPostProps {
    category: string;
    title: string;
    excerpt: string;
    author: string;
    readTime: string;
    date: string;
    image?: string;
}

export interface CourseCardProps {
    title: string;
    category: string;
    instructor: string;
    duration: string;
    price: string;
    tag?: string;
    image?: string;
    id?: string;
}
