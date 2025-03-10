import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj)
}

export function formatDateTime(date: Date | string) {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(dateObj)
}

export function truncateText(text: string, maxLength: number) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return `${text.slice(0, maxLength)}...`
}

export function generateAvatarUrl(name: string) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  // Generate random pastel color based on name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const h = Math.abs(hash) % 360
  const s = 70
  const l = 80
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${encodeURIComponent(`hsl(${h}, ${s}%, ${l}%)`)}&color=fff`
}

export function getInitials(name: string) {
  if (!name) return 'NA'
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
} 