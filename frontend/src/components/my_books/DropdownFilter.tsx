'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { Locale } from "@/i18n.config"

interface DropdownFilterProps {
  label: string
  searchParamKey: string
  defaultValue: string
  list: { value: string; label_en: string; label_ja: string; icon: React.ReactNode }[]
  locale: Locale

}

export default function DropdownFilter({
  label,
  searchParamKey,
  defaultValue,
  list,
  locale
}: DropdownFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentValue = searchParams.get(searchParamKey) || defaultValue

  const selectedItem = useMemo(() => {
    return list.find((item) => item.value === currentValue)
  }, [list, currentValue])

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(searchParamKey, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild
        className={`
        ${currentValue !== defaultValue ? 'border border-primary/60' : ''}
        `}
      >
        <Button variant="secondary" className="flex items-center justify-between min-w-[160px]">
          <span>{selectedItem ? selectedItem[`label_${locale}` as keyof typeof selectedItem] : label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5" align="center" side="bottom" sideOffset={4}>
        {list.map((category) => (
          <DropdownMenuItem
            key={category.value}
            onSelect={() => handleSelect(category.value)}
            className={`
                cursor-pointer flex items-center justify-between
                ${currentValue === category.value ? 'bg-secondary text-primary' : 'text-muted-foreground'}
                `}
          >
            <p className="font-medium text-primary">{category[`label_${locale}` as keyof typeof category]}</p>
            <div>{category.icon}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
