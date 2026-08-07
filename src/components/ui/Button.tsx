import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variantClasses = {
  primary: 'bg-da-green hover:bg-da-green-hover text-white font-semibold',
  secondary: 'border border-da-border text-da-text hover:border-da-green bg-transparent',
  ghost: 'text-da-subtle hover:text-da-text bg-transparent',
  danger: 'border border-red-700 text-red-400 hover:bg-red-900/20 bg-transparent',
}

const sizeClasses = {
  sm: 'px-3 py-1 text-xs rounded',
  md: 'px-4 py-2 text-sm rounded',
  lg: 'px-6 py-2.5 text-base rounded',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <span className="animate-spin border-2 border-current border-t-transparent w-3 h-3 rounded-full inline-block mr-2" />
      )}
      {children}
    </button>
  )
}
