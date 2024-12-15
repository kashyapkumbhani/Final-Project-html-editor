import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Preview } from "@/components/editor/Preview";
import { ElementPalette } from "@/components/editor/ElementPalette";
import { Toolbar } from "@/components/editor/Toolbar";
import { useEditorStore } from "@/lib/editor-store";

export default function Editor() {
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const handleFileImport = async (file: File) => {
    try {
      const text = await file.text();
      // Parse the HTML to ensure we keep all styles
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      // Ensure all styles and links are preserved
      const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
      const styles = doc.querySelectorAll('style');
      
      // Preserve the complete HTML structure including head section
      useEditorStore.getState().setHtml(text);
      
      alert("File imported successfully");
    } catch (error) {
      alert("Error importing file. Please try again with a valid HTML file");
    }
  };

  const handleFileExport = () => {
    const currentHtml = useEditorStore.getState().html;
    
    // Create a complete HTML document with styles
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported HTML</title>
    <style>
        /* Base styles */
        body {
            margin: 0;
            padding: 1rem;
            font-family: system-ui, -apple-system, sans-serif;
        }
        /* Preserve custom styles from elements */
        ${Array.from(document.getElementsByTagName('style')).map(style => style.innerHTML).join('\n')}
    </style>
</head>
<body>
    ${currentHtml}
</body>
</html>`;

    // Create and trigger download
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("File exported successfully with all updates");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white">
        <Toolbar
          onFileImport={handleFileImport}
          onFileExport={handleFileExport}
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
        />
      </div>
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full flex flex-col">
              <ElementPalette />
              <div className="flex-1">
                <PropertiesPanel />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <Preview mode={previewMode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}