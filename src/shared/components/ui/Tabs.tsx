import { type ReactNode } from 'react'
import { Tab } from '@headlessui/react'
import { cn } from '@/shared/utils/cn'

export interface TabsProps {
  children: ReactNode
  className?: string
  defaultIndex?: number
  onChange?: (index: number) => void
}

export function Tabs({ children, className, defaultIndex = 0, onChange }: TabsProps) {
  return (
    <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </Tab.Group>
  )
}

export interface TabListProps {
  children: ReactNode
  className?: string
}

export function TabList({ children, className }: TabListProps) {
  return (
    <Tab.List
      className={cn(
        'flex space-x-1 rounded-xl bg-primary/10 p-1',
        className
      )}
    >
      {children}
    </Tab.List>
  )
}

export interface TabButtonProps {
  children: ReactNode
  className?: string
}

export function TabButton({ children, className }: TabButtonProps) {
  return (
    <Tab
      className={({ selected }) =>
        cn(
          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
          'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
          selected
            ? 'bg-white text-primary shadow'
            : 'text-slate-600 hover:bg-white/[0.12] hover:text-primary',
          className
        )
      }
    >
      {children}
    </Tab>
  )
}

export interface TabPanelsProps {
  children: ReactNode
  className?: string
}

export function TabPanels({ children, className }: TabPanelsProps) {
  return (
    <Tab.Panels className={cn('mt-2', className)}>
      {children}
    </Tab.Panels>
  )
}

export interface TabPanelProps {
  children: ReactNode
  className?: string
}

export function TabPanel({ children, className }: TabPanelProps) {
  return (
    <Tab.Panel
      className={cn(
        'rounded-xl bg-white p-3',
        'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
        className
      )}
    >
      {children}
    </Tab.Panel>
  )
}
