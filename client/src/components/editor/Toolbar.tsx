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
  Copy,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
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
  const { toast } = useToast();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileImport(file);
    }
  };

  const handleFileExport = () => {
    // Get the latest HTML from the preview iframe
    const previewFrame = document.querySelector('iframe');
    if (!previewFrame?.contentDocument) {
      toast({
        title: "Export Failed",
        description: "Could not access preview content",
        variant: "destructive",
      });
      return;
    }
    
    // Clone the document to avoid modifying the preview
    const doc = previewFrame.contentDocument.cloneNode(true) as Document;
    
    // Clean up editor-specific attributes and classes
    const elements = doc.querySelectorAll('*');
    elements.forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-element-id');
      el.classList.remove('element-hover', 'element-highlight');
    });

    // Collect all styles
    const styleRules = new Set<string>();
    
    // Add base styles
    styleRules.add(`
      body {
        margin: 0;
        padding: 1rem;
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.5;
      }
    `);
    
    // Get computed styles for elements
    elements.forEach(el => {
      if (el.nodeType === Node.ELEMENT_NODE && el.tagName !== 'HTML' && el.tagName !== 'HEAD' && el.tagName !== 'BODY') {
        const computedStyle = window.getComputedStyle(el as HTMLElement);
        const elementStyles = new Set<string>();
        
        [
          'color', 'background-color', 'font-family', 'font-size', 'font-weight',
          'margin', 'padding', 'border', 'width', 'height', 'display', 'position',
          'top', 'left', 'right', 'bottom', 'z-index', 'flex', 'grid',
          'transform', 'transition', 'text-align', 'text-decoration',
          'border-radius', 'box-shadow', 'opacity', 'overflow'
        ].forEach(prop => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && value !== 'none' && value !== 'auto' && value !== '0px') {
            elementStyles.add(`${prop}: ${value};`);
          }
        });
        
        if (elementStyles.size > 0) {
          const className = `el-${Math.random().toString(36).substring(2, 9)}`;
          el.className = className;
          styleRules.add(`.${className} { ${Array.from(elementStyles).join(' ')} }`);
        }
      }
    });

    // Create the complete HTML document
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual HTML Editor Export</title>
    <style>
        ${Array.from(styleRules).join('\n        ')}
    </style>
</head>
<body>
    ${doc.body.innerHTML}
</body>
</html>`;

    // Download the file
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "HTML file has been downloaded",
      duration: 2000,
    });
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
      
      <Button variant="outline" size="icon" onClick={handleFileExport}>
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
          <div className="relative overflow-hidden">
            <div className="relative">
              <div className="overflow-auto max-h-[60vh] bg-muted rounded-lg">
                <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">
                  {html
                    .split('>')
                    .join('>\n')
                    .split('<')
                    .join('\n<')
                    .split('\n')
                    .filter(line => line.trim())
                    .map(line => '  '.repeat(
                      (line.match(/^[\s]*</g) || [''])[0].length / 2
                    ) + line.trim())
                    .join('\n')
                  }
                </pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                onClick={() => {
                  navigator.clipboard.writeText(html).then(() => {
                    toast({
                      title: "Copied!",
                      description: "HTML code copied to clipboard",
                      duration: 2000,
                    });
                  });
                }}
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}