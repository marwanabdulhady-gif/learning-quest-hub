import { useRef } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ImportExportPanelProps {
  onExportJSON: () => string;
  onExportCSV: () => string;
  onImportJSON: (content: string) => { success: boolean; error?: string };
  onImportCSV: (content: string) => { success: boolean; error?: string };
}

export function ImportExportPanel({
  onExportJSON,
  onExportCSV,
  onImportJSON,
  onImportCSV,
}: ImportExportPanelProps) {
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const content = onExportJSON();
    downloadFile(content, 'math-hub-content.json', 'application/json');
    toast.success('Exported to JSON');
  };

  const handleExportCSV = () => {
    const content = onExportCSV();
    downloadFile(content, 'math-hub-content.csv', 'text/csv');
    toast.success('Exported to CSV');
  };

  const handleFileImport = (
    file: File,
    importFn: (content: string) => { success: boolean; error?: string }
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = importFn(content);
      if (result.success) {
        toast.success('Content imported successfully');
      } else {
        toast.error(result.error || 'Import failed');
      }
    };
    reader.readAsText(file);
  };

  const handleJSONFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileImport(file, onImportJSON);
    }
    e.target.value = '';
  };

  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileImport(file, onImportCSV);
    }
    e.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleJSONFileChange}
      />
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleCSVFileChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => jsonInputRef.current?.click()}>
            <FileJson className="h-4 w-4 mr-2" />
            Import JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => csvInputRef.current?.click()}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleExportJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            Export JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
