import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500">{leftIcon}</span>
            </div>
          )}
          <input
            className={cn(
              'block w-full rounded-md border-slate-300 shadow-sm transition-colors',
              'focus:border-primary focus:ring-primary sm:text-sm',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger focus:border-danger focus:ring-danger',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {rightIcon && !error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-500">{rightIcon}</span>
            </div>
          )}
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-danger" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-danger" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'