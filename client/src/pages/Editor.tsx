import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { VisualEditor } from "@/components/editor/VisualEditor";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Preview } from "@/components/editor/Preview";
import { Toolbar } from "@/components/editor/Toolbar";
import { ElementPalette } from "@/components/editor/ElementPalette";
import { useToast } from "@/hooks/use-toast";
import { useEditorStore } from "@/lib/editor-store";

export default function Editor() {
  const { toast } = useToast();
  const { html, setHtml } = useEditorStore();
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Handle file import
  const handleFileImport = async (file: File) => {
    try {
      const content = await file.text();
      setHtml(content);
      toast({
        title: "Success",
        description: "File imported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import file",
        variant: "destructive",
      });
    }
  };

  // Handle file export
  const handleFileExport = () => {
    try {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "index.html";
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "File exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Toolbar 
        onFileImport={handleFileImport}
        onFileExport={handleFileExport}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={15} minSize={10}>
          <ElementPalette />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={45}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <VisualEditor />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30}>
              <CodeEditor />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={20}>
          <PropertiesPanel />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={20}>
          <Preview mode={previewMode} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
