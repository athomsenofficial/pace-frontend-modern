import { type ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

export interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full divide-y divide-slate-200', className)}>
        {children}
      </table>
    </div>
  )
}

export interface TableHeaderProps {
  children: ReactNode
  className?: string
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('bg-slate-50', className)}>
      {children}
    </thead>
  )
}

export interface TableBodyProps {
  children: ReactNode
  className?: string
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-slate-200 bg-white', className)}>
      {children}
    </tbody>
  )
}

export interface TableRowProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr
      className={cn(
        onClick && 'cursor-pointer hover:bg-slate-50',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export interface TableHeadProps {
  children: ReactNode
  className?: string
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500',
        className
      )}
    >
      {children}
    </th>
  )
}

export interface TableCellProps {
  children: ReactNode
  className?: string
  colSpan?: number
}

export function TableCell({ children, className, colSpan }: TableCellProps) {
  return (
    <td
      className={cn('whitespace-nowrap px-6 py-4 text-sm text-slate-900', className)}
      colSpan={colSpan}
    >
      {children}
    </td>
  )
}
