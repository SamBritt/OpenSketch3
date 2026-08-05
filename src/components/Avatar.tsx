interface AvatarProps {
  userName: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-20 h-20 text-xl',
}

export default function Avatar({ userName, avatarUrl, size = 'md' }: AvatarProps) {
  const sizeClass = sizeClasses[size]

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={userName}
        className={`rounded-full object-cover ${sizeClass}`}
      />
    )
  }

  return (
    <div className={`rounded-full bg-da-green-dim flex items-center justify-center text-da-green font-semibold ${sizeClass}`}>
      {userName.slice(0, 2).toUpperCase()}
    </div>
  )
}
