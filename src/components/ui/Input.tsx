import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-da-muted uppercase tracking-wider">{label}</label>}
      <input
        {...rest}
        className={`bg-da-elevated border border-da-border text-da-text rounded px-3 py-2 text-sm outline-none focus:border-da-green placeholder-da-muted transition-colors ${className}`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
