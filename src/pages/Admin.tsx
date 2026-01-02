import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContentManager, type ManagedLesson, type Unit } from '@/hooks/useContentManager';
import { toast } from 'sonner';

const categories = ['lesson', 'practice', 'project', 'game'] as const;
const difficulties = ['easy', 'medium', 'hard'] as const;

const Admin = () => {
  const content = useContentManager();
  const [activeTab, setActiveTab] = useState('units');

  // Unit dialogs
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitName, setUnitName] = useState('');

  // Lesson dialogs
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ManagedLesson | null>(null);
  const [lessonForm, setLessonForm] = useState<{
    title: string;
    description: string;
    unit: string;
    category: 'lesson' | 'practice' | 'project' | 'game';
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    icon: string;
    htmlContent: string;
  }>({
    title: '',
    description: '',
    unit: '',
    category: 'lesson',
    difficulty: 'easy',
    points: 10,
    icon: '📚',
    htmlContent: '',
  });

  // Delete confirmations
  const [deleteUnitId, setDeleteUnitId] = useState<string | null>(null);
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // HTML Preview
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // Unit handlers
  const openAddUnit = () => {
    setEditingUnit(null);
    setUnitName('');
    setUnitDialogOpen(true);
  };

  const openEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setUnitName(unit.name);
    setUnitDialogOpen(true);
  };

  const saveUnit = () => {
    if (!unitName.trim()) {
      toast.error('Unit name is required');
      return;
    }
    if (editingUnit) {
      content.updateUnit(editingUnit.id, unitName.trim());
      toast.success('Unit updated');
    } else {
      content.addUnit(unitName.trim());
      toast.success('Unit added');
    }
    setUnitDialogOpen(false);
  };

  const confirmDeleteUnit = () => {
    if (deleteUnitId) {
      content.deleteUnit(deleteUnitId);
      toast.success('Unit deleted');
      setDeleteUnitId(null);
    }
  };

  // Lesson handlers
  const openAddLesson = (unitName?: string) => {
    setEditingLesson(null);
    setLessonForm({
      title: '',
      description: '',
      unit: unitName || content.units[0]?.name || '',
      category: 'lesson',
      difficulty: 'easy',
      points: 10,
      icon: '📚',
      htmlContent: '',
    });
    setLessonDialogOpen(true);
  };

  const openEditLesson = (lesson: ManagedLesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      unit: lesson.unit,
      category: lesson.category,
      difficulty: lesson.difficulty,
      points: lesson.points,
      icon: lesson.icon,
      htmlContent: lesson.htmlContent || '',
    });
    setLessonDialogOpen(true);
  };

  const saveLesson = () => {
    if (!lessonForm.title.trim()) {
      toast.error('Lesson title is required');
      return;
    }
    if (!lessonForm.unit) {
      toast.error('Please select a unit');
      return;
    }

    const lessonData = {
      title: lessonForm.title.trim(),
      description: lessonForm.description.trim(),
      unit: lessonForm.unit,
      category: lessonForm.category,
      difficulty: lessonForm.difficulty,
      points: lessonForm.points,
      icon: lessonForm.icon,
      htmlContent: lessonForm.htmlContent,
    };

    if (editingLesson) {
      content.updateLesson(editingLesson.id, lessonData);
      toast.success('Lesson updated');
    } else {
      content.addLesson(lessonData);
      toast.success('Lesson added');
    }
    setLessonDialogOpen(false);
  };

  const confirmDeleteLesson = () => {
    if (deleteLessonId) {
      content.deleteLesson(deleteLessonId);
      toast.success('Lesson deleted');
      setDeleteLessonId(null);
    }
  };

  const handleReset = () => {
    content.resetToDefaults();
    toast.success('Reset to default content');
    setResetDialogOpen(false);
  };

  if (!content.isLoaded) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Content Manager</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setResetDialogOpen(true)}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="units">Units ({content.units.length})</TabsTrigger>
            <TabsTrigger value="lessons">Lessons ({content.lessons.length})</TabsTrigger>
          </TabsList>

          {/* Units Tab */}
          <TabsContent value="units" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openAddUnit} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Unit
              </Button>
            </div>

            <div className="grid gap-4">
              {content.units.map((unit) => {
                const lessonCount = content.getLessonsByUnit(unit.name).length;
                return (
                  <Card key={unit.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <div>
                          <h3 className="font-semibold">{unit.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveTab('lessons');
                            // Could add unit filter here
                          }}
                        >
                          View Lessons
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditUnit(unit)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteUnitId(unit.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => openAddLesson()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Lesson
              </Button>
            </div>

            {content.units.map((unit) => {
              const unitLessons = content.getLessonsByUnit(unit.name);
              if (unitLessons.length === 0) return null;

              return (
                <Card key={unit.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {unitLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between rounded-lg border p-3 bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lesson.icon}</span>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <span className="capitalize">{lesson.category}</span>
                              <span>•</span>
                              <span className="capitalize">{lesson.difficulty}</span>
                              <span>•</span>
                              <span>{lesson.points} pts</span>
                              {lesson.htmlContent && (
                                <>
                                  <span>•</span>
                                  <span className="text-primary">Has HTML</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {lesson.htmlContent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewHtml(lesson.htmlContent || null)}
                            >
                              Preview
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditLesson(lesson)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteLessonId(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </main>

      {/* Unit Dialog */}
      <Dialog open={unitDialogOpen} onOpenChange={setUnitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUnit ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
            <DialogDescription>
              {editingUnit ? 'Update the unit name.' : 'Enter a name for the new unit.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unit-name">Unit Name</Label>
              <Input
                id="unit-name"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="e.g., Unit 7: Decimals"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUnit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
            <DialogDescription>
              Fill in the lesson details and optionally add HTML content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lesson-title">Title</Label>
                <Input
                  id="lesson-title"
                  value={lessonForm.title}
                  onChange={(e) =>
                    setLessonForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Lesson title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson-icon">Icon (emoji)</Label>
                <Input
                  id="lesson-icon"
                  value={lessonForm.icon}
                  onChange={(e) =>
                    setLessonForm((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="📚"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-description">Description</Label>
              <Textarea
                id="lesson-description"
                value={lessonForm.description}
                onChange={(e) =>
                  setLessonForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief description of the lesson"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={lessonForm.unit}
                  onValueChange={(value) =>
                    setLessonForm((prev) => ({ ...prev, unit: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {content.units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.name}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={lessonForm.category}
                  onValueChange={(value: typeof lessonForm.category) =>
                    setLessonForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={lessonForm.difficulty}
                  onValueChange={(value: typeof lessonForm.difficulty) =>
                    setLessonForm((prev) => ({ ...prev, difficulty: value }))
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
                <Label htmlFor="lesson-points">Points</Label>
                <Input
                  id="lesson-points"
                  type="number"
                  min={0}
                  value={lessonForm.points}
                  onChange={(e) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      points: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-html">HTML Content (optional)</Label>
              <Textarea
                id="lesson-html"
                value={lessonForm.htmlContent}
                onChange={(e) =>
                  setLessonForm((prev) => ({ ...prev, htmlContent: e.target.value }))
                }
                placeholder="<div>Your interactive lesson content here...</div>"
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Add custom HTML including forms, embedded content, and interactive elements.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveLesson}>Save Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HTML Preview Dialog */}
      <Dialog open={!!previewHtml} onOpenChange={() => setPreviewHtml(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>HTML Content Preview</DialogTitle>
          </DialogHeader>
          <div
            className="prose prose-sm max-w-none rounded-lg border p-4 bg-background"
            dangerouslySetInnerHTML={{ __html: previewHtml || '' }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Unit Confirmation */}
      <AlertDialog open={!!deleteUnitId} onOpenChange={() => setDeleteUnitId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Unit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the unit and all its lessons. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUnit} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Lesson Confirmation */}
      <AlertDialog open={!!deleteLessonId} onOpenChange={() => setDeleteLessonId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lesson. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteLesson} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default Content?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore all units and lessons to their original state. All your custom changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
