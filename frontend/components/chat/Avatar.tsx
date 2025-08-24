'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  type: 'user' | 'agent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  customImage?: string // Base64 image data
}

export function Avatar({ type, size = 'md', className, customImage }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  }

  const backgroundClasses = {
    user: 'bg-gradient-to-br from-zen-purple/20 to-zen-cyan/20',
    agent: 'bg-gradient-to-br from-zen-cyan/20 to-zen-purple/20'
  }

  // Prefer branded agent avatar from public/avatar.png with graceful fallback
  const [imageSrc, setImageSrc] = useState<string>(
    customImage
      ? customImage
      : type === 'agent'
        ? '/avatar.png'
        : '/icon-white.svg'
  )

  // If custom image is provided, use it
  if (customImage) {
    return (
      <div className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0 border border-border/30 overflow-hidden',
        sizeClasses[size],
        className
      )}>
        <Image
          src={customImage}
          alt="Custom avatar"
          width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
          height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    )
  }

  // Default avatar (agent uses /avatar.png, fallback to zen-master or icon)
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center flex-shrink-0 border border-border/30',
      sizeClasses[size],
      backgroundClasses[type],
      className
    )}>
      <Image
        src={imageSrc}
        alt={`${type} avatar`}
        width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
        className="rounded-full object-cover"
        onError={() => {
          // Fallbacks: zen-master.png, then generic icon
          setImageSrc(prev => (prev !== '/zen-master.png' ? '/zen-master.png' : '/icon-black.svg'))
        }}
      />
    </div>
  )
} 