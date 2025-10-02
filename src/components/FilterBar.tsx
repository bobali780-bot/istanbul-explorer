'use client'

import { useState } from 'react'
import { ChevronDown, Check, Sparkles } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterBarProps {
  filters: {
    neighborhoods: FilterOption[]
    priceRanges: FilterOption[]
    vibes: FilterOption[]
    durations: FilterOption[]
    amenities: FilterOption[]
  }
  selectedFilters: Record<string, string[]>
  onFilterChange: (filterType: string, values: string[]) => void
  showHandpickedOnly: boolean
  onHandpickedToggle: (enabled: boolean) => void
}

export function FilterBar({
  filters,
  selectedFilters,
  onFilterChange,
  showHandpickedOnly,
  onHandpickedToggle,
}: FilterBarProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const toggleFilter = (filterType: string) => {
    setOpenFilter(openFilter === filterType ? null : filterType)
  }

  const handleOptionClick = (filterType: string, value: string) => {
    const currentSelection = selectedFilters[filterType] || []
    const newSelection = currentSelection.includes(value)
      ? currentSelection.filter((item) => item !== value)
      : [...currentSelection, value]
    onFilterChange(filterType, newSelection)
  }

  const isSelected = (filterType: string, value: string) =>
    (selectedFilters[filterType] || []).includes(value)

  const renderFilterDropdown = (filterType: string, options: FilterOption[]) => (
    <div className="relative">
      <button
        onClick={() => toggleFilter(filterType)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                  ${(selectedFilters[filterType]?.length || 0) > 0
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
      >
        {filterType.charAt(0).toUpperCase() + filterType.slice(1).replace(/([A-Z])/g, ' $1')}
        {(selectedFilters[filterType]?.length || 0) > 0 && (
          <span className="ml-1 rounded-full bg-white/30 px-2 text-xs">
            {selectedFilters[filterType]?.length}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${openFilter === filterType ? 'rotate-180' : ''}`}
        />
      </button>
      {openFilter === filterType && (
        <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-md">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(filterType, option.value)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-slate-800 hover:bg-slate-100"
            >
              <span>
                {option.label} {option.count && `(${option.count})`}
              </span>
              {isSelected(filterType, option.value) && <Check className="h-4 w-4 text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="sticky top-0 z-30 w-full bg-white/90 py-4 backdrop-blur-lg shadow-md border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-5">
        {renderFilterDropdown('neighborhoods', filters.neighborhoods || [])}
        {renderFilterDropdown('priceRanges', filters.priceRanges || [])}
        {renderFilterDropdown('vibes', filters.vibes || [])}
        {renderFilterDropdown('durations', filters.durations || [])}
        {renderFilterDropdown('amenities', filters.amenities || [])}

        {showHandpickedOnly && (
          <button
            onClick={() => onHandpickedToggle(!selectedFilters.handpicked?.includes('only'))}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                      ${selectedFilters.handpicked?.includes('only')
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
          >
            <Sparkles className="h-4 w-4" />
            Handpicked Only
          </button>
        )}

        {(Object.values(selectedFilters).some(arr => arr.length > 0) || selectedFilters.handpicked?.includes('only')) && (
          <button
            onClick={() => {
              onFilterChange('neighborhoods', [])
              onFilterChange('priceRanges', [])
              onFilterChange('vibes', [])
              onFilterChange('durations', [])
              onFilterChange('amenities', [])
              onHandpickedToggle(false)
            }}
            className="rounded-full bg-red-500/80 px-4 py-2 text-sm font-medium text-white shadow-md backdrop-blur-md hover:bg-red-600"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}