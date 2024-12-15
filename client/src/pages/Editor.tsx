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
    // Get the preview iframe to extract the latest HTML
    const previewFrame = document.querySelector('iframe');
    if (!previewFrame?.contentDocument) {
      alert("Error: Could not access preview content");
      return;
    }

    // Get all elements from the preview
    const elements = Array.from(previewFrame.contentDocument.body.children);
    
    // Create a temporary container to preserve styles and attributes
    const tempContainer = document.createElement('div');
    elements.forEach(el => {
      const clone = el.cloneNode(true) as HTMLElement;
      // Remove editor-specific attributes
      clone.removeAttribute('contenteditable');
      tempContainer.appendChild(clone);
    });

    // Get computed styles for each element
    const styleSheet = new Set<string>();
    elements.forEach(el => {
      const computedStyle = window.getComputedStyle(el as HTMLElement);
      let elementStyles = '';
      Array.from(computedStyle).forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value) {
          elementStyles += `${prop}: ${value};\n`;
        }
      });
      if (elementStyles) {
        const elementId = (el as HTMLElement).getAttribute('data-element-id');
        if (elementId) {
          styleSheet.add(`
            [data-element-id="${elementId}"] {
              ${elementStyles}
            }
          `);
        }
      }
    });

    // Create the complete HTML document
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
        /* Computed styles */
        ${Array.from(styleSheet).join('\n')}
    </style>
</head>
<body>
    ${tempContainer.innerHTML}
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