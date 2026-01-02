import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { categories } from '@/data/lessons';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUnit: string | null;
  onUnitChange: (unit: string | null) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  units?: string[];
}

const categoryEmojis = {
  lesson: '📚',
  practice: '💪',
  project: '🎨',
  game: '🎮',
};

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedUnit,
  onUnitChange,
  selectedCategory,
  onCategoryChange,
  units = [],
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(true);

  const hasActiveFilters = selectedUnit || selectedCategory || searchQuery;

  const clearAllFilters = () => {
    onSearchChange('');
    onUnitChange(null);
    onCategoryChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 pl-12 pr-4 text-base rounded-xl border-2 border-muted focus:border-primary"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="rounded-full"
        >
          All Types
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category === selectedCategory ? null : category)}
            className="rounded-full capitalize"
          >
            {categoryEmojis[category]} {category}
          </Button>
        ))}
      </div>

      {/* Unit filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedUnit === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onUnitChange(null)}
          className="rounded-full"
        >
          All Units
        </Button>
        {units.map((unit) => (
          <Button
            key={unit}
            variant={selectedUnit === unit ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUnitChange(unit === selectedUnit ? null : unit)}
            className="rounded-full text-xs"
          >
            {unit.replace('Unit ', 'U').split(':')[0]}
          </Button>
        ))}
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="mr-1 h-4 w-4" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
