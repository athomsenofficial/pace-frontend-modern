import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'
import { ChevronDown, AlertCircle } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              'block w-full rounded-md border-slate-300 shadow-sm transition-colors',
              '[appearance:none] [-webkit-appearance:none] [-moz-appearance:none]',
              'bg-[length:0] [background-image:none]',
              'focus:border-primary focus:ring-primary',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              'pr-10',
              sizes[size],
              error && 'border-danger focus:border-danger focus:ring-danger',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {error ? (
              <AlertCircle className="h-5 w-5 text-danger" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </div>
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

Select.displayName = 'Select'