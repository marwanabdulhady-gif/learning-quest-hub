import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye } from 'lucide-react';
import type { ContentItem, Unit } from '@/hooks/useContentManager';

interface ContentItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Omit<ContentItem, 'id' | 'type' | 'order'>) => void;
  editingItem?: ContentItem | null;
  units: Unit[];
  defaultUnitId?: string;
  contentType: string;
}

const difficulties = ['easy', 'medium', 'hard'] as const;

export function ContentItemForm({
  open,
  onOpenChange,
  onSave,
  editingItem,
  units,
  defaultUnitId,
  contentType,
}: ContentItemFormProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    unitId: defaultUnitId || '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    points: 10,
    icon: '📚',
    htmlContent: '',
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title,
        description: editingItem.description,
        unitId: editingItem.unitId,
        difficulty: editingItem.difficulty,
        points: editingItem.points,
        icon: editingItem.icon,
        htmlContent: editingItem.htmlContent || '',
      });
    } else {
      setForm({
        title: '',
        description: '',
        unitId: defaultUnitId || units[0]?.id || '',
        difficulty: 'easy',
        points: 10,
        icon: '📚',
        htmlContent: '',
      });
    }
  }, [editingItem, defaultUnitId, units, open]);

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      unitId: form.unitId,
      difficulty: form.difficulty,
      points: form.points,
      icon: form.icon,
      htmlContent: form.htmlContent || undefined,
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Edit ${contentType}` : `Add ${contentType}`}
            </DialogTitle>
            <DialogDescription>
              Fill in the details and optionally add interactive HTML content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder={`${contentType} title`}
                />
              </div>
              <div className="space-y-2">
                <Label>Icon (emoji)</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder="📚"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={form.unitId}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, unitId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={form.difficulty}
                  onValueChange={(value: typeof form.difficulty) =>
                    setForm((prev) => ({ ...prev, difficulty: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff} className="capitalize">
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Points</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.points}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, points: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HTML Content (optional)</Label>
                {form.htmlContent && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewOpen(true)}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                )}
              </div>
              <Textarea
                value={form.htmlContent}
                onChange={(e) => setForm((prev) => ({ ...prev, htmlContent: e.target.value }))}
                placeholder="<div>Your interactive content here...</div>"
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Add custom HTML with forms, embedded content, and interactive elements.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!form.title.trim() || !form.unitId}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>HTML Preview</DialogTitle>
          </DialogHeader>
          <div
            className="prose prose-sm max-w-none rounded-lg border p-4 bg-background"
            dangerouslySetInnerHTML={{ __html: form.htmlContent }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
