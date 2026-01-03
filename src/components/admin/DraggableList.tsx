import { useState } from 'react';
import { GripVertical, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DraggableItem {
  id: string;
  order: number;
}

interface DraggableListProps<T extends DraggableItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
  renderSubContent?: (item: T) => React.ReactNode;
  collapsible?: boolean;
}

export function DraggableList<T extends DraggableItem>({
  items,
  onReorder,
  onEdit,
  onDelete,
  renderItem,
  renderSubContent,
  collapsible = false,
}: DraggableListProps<T>) {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, item: T) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, item: T) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== item.id) {
      setDragOverId(item.id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetItem: T) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex((i) => i.id === draggedItem.id);
    const targetIndex = newItems.findIndex((i) => i.id === targetItem.id);

    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    onReorder(newItems.map((item, index) => ({ ...item, order: index })));
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverId(null);
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sortedItems.map((item) => {
        const isExpanded = expandedIds.has(item.id);
        return (
          <div key={item.id}>
            <Card
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item)}
              onDragEnd={handleDragEnd}
              className={cn(
                'transition-all cursor-grab active:cursor-grabbing',
                draggedItem?.id === item.id && 'opacity-50',
                dragOverId === item.id && 'ring-2 ring-primary'
              )}
            >
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
                  {collapsible && renderSubContent && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => toggleExpanded(item.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <div className="flex-1 min-w-0">{renderItem(item)}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            {collapsible && renderSubContent && isExpanded && (
              <div className="ml-8 mt-2 space-y-2">{renderSubContent(item)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
