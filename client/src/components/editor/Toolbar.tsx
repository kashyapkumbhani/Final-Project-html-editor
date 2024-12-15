import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Download,
  Undo,
  Redo,
  Code,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditorStore } from "@/lib/editor-store";

interface ToolbarProps {
  onFileImport: (file: File) => void;
  onFileExport: () => void;
  previewMode: "desktop" | "tablet" | "mobile";
  onPreviewModeChange: (mode: "desktop" | "tablet" | "mobile") => void;
}

export function Toolbar({
  onFileImport,
  onFileExport,
  previewMode,
  onPreviewModeChange,
}: ToolbarProps) {
  const { canUndo, canRedo, undo, redo, html } = useEditorStore();
  const [showHtml, setShowHtml] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileImport(file);
    }
  };

  return (
    <div className="border-b p-2 flex items-center gap-2">
      <input
        type="file"
        accept=".html"
        className="hidden"
        id="file-input"
        onChange={handleFileInput}
      />
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Upload className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="icon" onClick={onFileExport}>
        <Download className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      <Button
        variant="outline"
        size="icon"
        disabled={!canUndo}
        onClick={undo}
      >
        <Undo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        disabled={!canRedo}
        onClick={redo}
      >
        <Redo className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      <Button
        variant={previewMode === "desktop" ? "default" : "outline"}
        size="icon"
        onClick={() => onPreviewModeChange("desktop")}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      
      <Button
        variant={previewMode === "tablet" ? "default" : "outline"}
        size="icon"
        onClick={() => onPreviewModeChange("tablet")}
      >
        <Tablet className="h-4 w-4" />
      </Button>
      
      <Button
        variant={previewMode === "mobile" ? "default" : "outline"}
        size="icon"
        onClick={() => onPreviewModeChange("mobile")}
      >
        <Smartphone className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-2" />
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowHtml(true)}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Dialog open={showHtml} onOpenChange={setShowHtml}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>HTML Code</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            <pre className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
              {html}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
