'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '../ui/slider'
import { useState, useEffect } from 'react'

interface RangeFilterProps {
  searchParamKey: string
  label: string
  defaultValue: number
  max: number
  step: number
  fromLabel: number
  onFilterChange?: (key: string, label: string, value: number) => void
}

export default function RangeFilter({
  searchParamKey,
  label,
  defaultValue,
  max,
  step,
  fromLabel,
  onFilterChange
}: RangeFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const paramValue = searchParams.get(searchParamKey)
  const initialValue = paramValue ? Number(paramValue) : defaultValue

  const [currentValue, setCurrentValue] = useState(initialValue)
  const [hasChanged, setHasChanged] = useState(!!paramValue)

  useEffect(() => {
    setCurrentValue(initialValue)
    setHasChanged(!!paramValue)
  }, [paramValue, initialValue])

  const handleChange = (value: number[]) => {
    const [newValue] = value
    setCurrentValue(newValue)
    setHasChanged(true)

    const params = new URLSearchParams(searchParams.toString())
    params.set(searchParamKey, newValue.toString())
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)

    if (onFilterChange) {
      onFilterChange(searchParamKey, label, newValue)
    }
  }

  const toLabel = hasChanged ? currentValue : max

  return (
    <div className="space-y-2">
      <p className="font-medium text-sm">{label}</p>

      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{fromLabel}</span>
        <span>{toLabel}</span>
      </div>

      <Slider
        defaultValue={[initialValue]}
        min={fromLabel}
        max={max}
        step={step}
        className="w-[200px]"
        onValueChange={handleChange}
      />
    </div>
  )
}
