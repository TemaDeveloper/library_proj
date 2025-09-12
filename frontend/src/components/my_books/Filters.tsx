import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import RangeFilter from './RangeFilter'
import { ListFilterPlus } from 'lucide-react'
import { LocaleDict } from '@/lib/locales'

interface SelectedFilter {
  key: string
  label: string
  value: number
}

interface FiltersProps {
  translations: LocaleDict
}

export default function Filters({ translations }: FiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([])

  const handleFilterChange = (key: string, label: string, value: number) => {
    setSelectedFilters(prev => {
      const existing = prev.find(f => f.key === key)
      if (existing) {
        return prev.map(f => f.key === key ? { key, label, value } : f)
      } else {
        return [...prev, { key, label, value }]
      }
    })
  }

  const getButtonLabel = () => {
    if (selectedFilters.length === 0) return translations.page.home.filters.filters
    if (selectedFilters.length === 1) {
      const { label, value } = selectedFilters[0]
      return `${label}: ${value}`
    }
    return `${selectedFilters.length} ${translations.page.home.filters.selected} `
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="flex items-center justify-between min-w-[180px] text-primary">
            <span>{getButtonLabel()}</span>
            <ListFilterPlus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' sideOffset={10}>
          <DropdownMenuItem className="flex flex-col gap-4 py-3">
            <RangeFilter
              searchParamKey="publication_year"
              label={translations.page.home.filters.publicationYear}
              defaultValue={new Date().getFullYear()}
              max={new Date().getFullYear()}
              step={10}
              fromLabel={1950}
              onFilterChange={handleFilterChange}
            />
            <RangeFilter
              searchParamKey="rating"
              label={translations.page.home.filters.rating}
              defaultValue={0}
              max={5}
              step={0.5}
              fromLabel={0}
              onFilterChange={handleFilterChange}
            />
            <RangeFilter
              searchParamKey="pages"
              label={translations.page.home.filters.pages}
              defaultValue={1000}
              max={1000}
              step={100}
              fromLabel={1}
              onFilterChange={handleFilterChange}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
