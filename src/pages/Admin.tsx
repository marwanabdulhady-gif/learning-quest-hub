import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, RotateCcw, Calendar, BookOpen, Gamepad2, FolderKanban, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useContentManager, type Year, type Unit, type ContentItem, type ManagedLesson, type Practice, type Project, type Game } from '@/hooks/useContentManager';
import { DraggableList } from '@/components/admin/DraggableList';
import { ContentItemForm } from '@/components/admin/ContentItemForm';
import { ImportExportPanel } from '@/components/admin/ImportExportPanel';
import { toast } from 'sonner';

const Admin = () => {
  const content = useContentManager();
  const [activeTab, setActiveTab] = useState('years');

  // Year dialogs
  const [yearDialogOpen, setYearDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<Year | null>(null);
  const [yearName, setYearName] = useState('');

  // Unit dialogs
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitName, setUnitName] = useState('');
  const [unitYearId, setUnitYearId] = useState('');

  // Content dialogs
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [contentType, setContentType] = useState<'lesson' | 'practice' | 'project' | 'game'>('lesson');
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [contentDefaultUnitId, setContentDefaultUnitId] = useState<string | undefined>();

  // Delete confirmations
  const [deleteYearId, setDeleteYearId] = useState<string | null>(null);
  const [deleteUnitId, setDeleteUnitId] = useState<string | null>(null);
  const [deleteContentId, setDeleteContentId] = useState<{ id: string; type: string } | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Year handlers
  const openAddYear = () => {
    setEditingYear(null);
    setYearName('');
    setYearDialogOpen(true);
  };

  const openEditYear = (year: Year) => {
    setEditingYear(year);
    setYearName(year.name);
    setYearDialogOpen(true);
  };

  const saveYear = () => {
    if (!yearName.trim()) {
      toast.error('Year name is required');
      return;
    }
    if (editingYear) {
      content.updateYear(editingYear.id, yearName.trim());
      toast.success('Year updated');
    } else {
      content.addYear(yearName.trim());
      toast.success('Year added');
    }
    setYearDialogOpen(false);
  };

  // Unit handlers
  const openAddUnit = (yearId?: string) => {
    setEditingUnit(null);
    setUnitName('');
    setUnitYearId(yearId || content.years[0]?.id || '');
    setUnitDialogOpen(true);
  };

  const openEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setUnitName(unit.name);
    setUnitYearId(unit.yearId);
    setUnitDialogOpen(true);
  };

  const saveUnit = () => {
    if (!unitName.trim()) {
      toast.error('Unit name is required');
      return;
    }
    if (!unitYearId) {
      toast.error('Please select a year');
      return;
    }
    if (editingUnit) {
      content.updateUnit(editingUnit.id, { name: unitName.trim(), yearId: unitYearId });
      toast.success('Unit updated');
    } else {
      content.addUnit(unitName.trim(), unitYearId);
      toast.success('Unit added');
    }
    setUnitDialogOpen(false);
  };

  // Content handlers
  const openAddContent = (type: 'lesson' | 'practice' | 'project' | 'game', unitId?: string) => {
    setContentType(type);
    setEditingContent(null);
    setContentDefaultUnitId(unitId);
    setContentDialogOpen(true);
  };

  const openEditContent = (item: ContentItem, type: 'lesson' | 'practice' | 'project' | 'game') => {
    setContentType(type);
    setEditingContent(item);
    setContentDefaultUnitId(item.unitId);
    setContentDialogOpen(true);
  };

  const saveContent = (item: Omit<ContentItem, 'id' | 'type' | 'order'>) => {
    if (editingContent) {
      switch (contentType) {
        case 'lesson':
          content.updateLesson(editingContent.id, item);
          break;
        case 'practice':
          content.updatePractice(editingContent.id, item);
          break;
        case 'project':
          content.updateProject(editingContent.id, item);
          break;
        case 'game':
          content.updateGame(editingContent.id, item);
          break;
      }
      toast.success(`${contentType} updated`);
    } else {
      switch (contentType) {
        case 'lesson':
          content.addLesson(item as Omit<ManagedLesson, 'id' | 'type' | 'order'>);
          break;
        case 'practice':
          content.addPractice(item as Omit<Practice, 'id' | 'type' | 'order'>);
          break;
        case 'project':
          content.addProject(item as Omit<Project, 'id' | 'type' | 'order'>);
          break;
        case 'game':
          content.addGame(item as Omit<Game, 'id' | 'type' | 'order'>);
          break;
      }
      toast.success(`${contentType} added`);
    }
  };

  const confirmDeleteContent = () => {
    if (!deleteContentId) return;
    switch (deleteContentId.type) {
      case 'lesson':
        content.deleteLesson(deleteContentId.id);
        break;
      case 'practice':
        content.deletePractice(deleteContentId.id);
        break;
      case 'project':
        content.deleteProject(deleteContentId.id);
        break;
      case 'game':
        content.deleteGame(deleteContentId.id);
        break;
    }
    toast.success(`${deleteContentId.type} deleted`);
    setDeleteContentId(null);
  };

  const handleReset = () => {
    content.resetToDefaults();
    toast.success('Reset to default content');
    setResetDialogOpen(false);
  };

  // Get units for selected year filter
  const selectedYearUnits = content.selectedYearId 
    ? content.getUnitsByYear(content.selectedYearId) 
    : content.units;

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
          <div className="flex items-center gap-2">
            <ImportExportPanel
              onExportJSON={content.exportToJSON}
              onExportCSV={content.exportToCSV}
              onImportJSON={content.importFromJSON}
              onImportCSV={content.importFromCSV}
            />
            <Button
              variant="outline"
              onClick={() => setResetDialogOpen(true)}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Year Filter */}
        <div className="mb-6 flex items-center gap-4">
          <Label>Filter by Year:</Label>
          <Select
            value={content.selectedYearId || 'all'}
            onValueChange={(value) => content.setSelectedYearId(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {content.years.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="years" className="gap-2">
              <Calendar className="h-4 w-4" />
              Years ({content.years.length})
            </TabsTrigger>
            <TabsTrigger value="units" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              Units ({selectedYearUnits.length})
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Lessons ({content.lessons.length})
            </TabsTrigger>
            <TabsTrigger value="practices" className="gap-2">
              <Dumbbell className="h-4 w-4" />
              Practice ({content.practices.length})
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              Projects ({content.projects.length})
            </TabsTrigger>
            <TabsTrigger value="games" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Games ({content.games.length})
            </TabsTrigger>
          </TabsList>

          {/* Years Tab */}
          <TabsContent value="years" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openAddYear} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Year
              </Button>
            </div>
            <DraggableList
              items={content.years}
              onReorder={content.reorderYears}
              onEdit={openEditYear}
              onDelete={(id) => setDeleteYearId(id)}
              renderItem={(year) => (
                <div>
                  <h3 className="font-semibold">{year.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {content.getUnitsByYear(year.id).length} units
                  </p>
                </div>
              )}
            />
          </TabsContent>

          {/* Units Tab */}
          <TabsContent value="units" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openAddUnit(content.selectedYearId || undefined)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Unit
              </Button>
            </div>
            <DraggableList
              items={selectedYearUnits}
              onReorder={content.reorderUnits}
              onEdit={openEditUnit}
              onDelete={(id) => setDeleteUnitId(id)}
              renderItem={(unit) => {
                const year = content.years.find((y) => y.id === unit.yearId);
                const unitContent = content.getContentByUnit(unit.id);
                const totalItems = unitContent.lessons.length + unitContent.practices.length + 
                                   unitContent.projects.length + unitContent.games.length;
                return (
                  <div>
                    <h3 className="font-semibold">{unit.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {year?.name} • {totalItems} items
                    </p>
                  </div>
                );
              }}
            />
          </TabsContent>

          {/* Content Tabs */}
          {(['lessons', 'practices', 'projects', 'games'] as const).map((tabType) => {
            const typeMap = {
              lessons: { items: content.lessons, type: 'lesson' as const, icon: '📚' },
              practices: { items: content.practices, type: 'practice' as const, icon: '💪' },
              projects: { items: content.projects, type: 'project' as const, icon: '🎨' },
              games: { items: content.games, type: 'game' as const, icon: '🎮' },
            };
            const { items, type, icon } = typeMap[tabType];
            
            // Filter by selected year
            const filteredItems = content.selectedYearId
              ? items.filter((item) => {
                  const unit = content.units.find((u) => u.id === item.unitId);
                  return unit?.yearId === content.selectedYearId;
                })
              : items;

            // Group by unit
            const groupedByUnit = selectedYearUnits.map((unit) => ({
              unit,
              items: filteredItems.filter((item) => item.unitId === unit.id),
            })).filter((group) => group.items.length > 0);

            return (
              <TabsContent key={tabType} value={tabType} className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={() => openAddContent(type)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                </div>

                {groupedByUnit.length > 0 ? (
                  groupedByUnit.map(({ unit, items: unitItems }) => (
                    <Card key={unit.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{unit.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAddContent(type, unit.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DraggableList
                          items={unitItems}
                          onReorder={(reordered) => {
                            switch (type) {
                              case 'lesson':
                                content.reorderLessons(reordered as ManagedLesson[]);
                                break;
                              case 'practice':
                                content.reorderPractices(reordered as Practice[]);
                                break;
                              case 'project':
                                content.reorderProjects(reordered as Project[]);
                                break;
                              case 'game':
                                content.reorderGames(reordered as Game[]);
                                break;
                            }
                          }}
                          onEdit={(item) => openEditContent(item, type)}
                          onDelete={(id) => setDeleteContentId({ id, type })}
                          renderItem={(item) => (
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                  <span className="capitalize">{item.difficulty}</span>
                                  <span>•</span>
                                  <span>{item.points} pts</span>
                                  {item.htmlContent && (
                                    <>
                                      <span>•</span>
                                      <span className="text-primary">Has HTML</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <div className="text-4xl mb-4">{icon}</div>
                      <h3 className="font-semibold text-lg">No {tabType} yet</h3>
                      <p className="text-muted-foreground">
                        Click the button above to add your first {type}.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </main>

      {/* Year Dialog */}
      <Dialog open={yearDialogOpen} onOpenChange={setYearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingYear ? 'Edit Year' : 'Add Year'}</DialogTitle>
            <DialogDescription>
              {editingYear ? 'Update the year name.' : 'Enter a name for the new year/grade level.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Year Name</Label>
              <Input
                value={yearName}
                onChange={(e) => setYearName(e.target.value)}
                placeholder="e.g., Grade 5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setYearDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveYear}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unit Dialog */}
      <Dialog open={unitDialogOpen} onOpenChange={setUnitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUnit ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
            <DialogDescription>
              {editingUnit ? 'Update the unit.' : 'Create a new unit within a year.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Unit Name</Label>
              <Input
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="e.g., Unit 7: Decimals"
              />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={unitYearId} onValueChange={setUnitYearId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {content.years.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Content Item Form */}
      <ContentItemForm
        open={contentDialogOpen}
        onOpenChange={setContentDialogOpen}
        onSave={saveContent}
        editingItem={editingContent}
        units={content.units}
        defaultUnitId={contentDefaultUnitId}
        contentType={contentType.charAt(0).toUpperCase() + contentType.slice(1)}
      />

      {/* Delete Year Confirmation */}
      <AlertDialog open={!!deleteYearId} onOpenChange={() => setDeleteYearId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Year?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the year, all its units, and all content. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteYearId) {
                  content.deleteYear(deleteYearId);
                  toast.success('Year deleted');
                  setDeleteYearId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Unit Confirmation */}
      <AlertDialog open={!!deleteUnitId} onOpenChange={() => setDeleteUnitId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Unit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the unit and all its content. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteUnitId) {
                  content.deleteUnit(deleteUnitId);
                  toast.success('Unit deleted');
                  setDeleteUnitId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Content Confirmation */}
      <AlertDialog open={!!deleteContentId} onOpenChange={() => setDeleteContentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteContentId?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteContent}
              className="bg-destructive text-destructive-foreground"
            >
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
              This will restore all content to the original state. All your custom changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
