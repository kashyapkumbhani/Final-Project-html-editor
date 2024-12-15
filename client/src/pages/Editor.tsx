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
    // Get the latest HTML from the editor store
    const { html } = useEditorStore.getState();
    
    // Create a temporary document to parse and process the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Clean up editor-specific attributes from all elements
    const elements = doc.querySelectorAll('*');
    elements.forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-element-id');
      
      // Remove editor-specific classes
      if (el.classList.contains('element-hover')) el.classList.remove('element-hover');
      if (el.classList.contains('element-highlight')) el.classList.remove('element-highlight');
    });

    // Get all styles from the preview frame
    const previewFrame = document.querySelector('iframe');
    const styleRules = new Set<string>();
    
    if (previewFrame?.contentDocument) {
      // Collect styles from the preview iframe
      const sheets = previewFrame.contentDocument.styleSheets;
      Array.from(sheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules).forEach(rule => {
            if (!rule.cssText.includes('element-hover') && !rule.cssText.includes('element-highlight')) {
              styleRules.add(rule.cssText);
            }
          });
        } catch (e) {
          console.warn('Could not access stylesheet rules', e);
        }
      });
      
      // Get computed styles for elements
      elements.forEach(el => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          const computedStyle = window.getComputedStyle(el as HTMLElement);
          const elementStyles = new Set<string>();
          
          ['color', 'background-color', 'font-family', 'font-size', 'font-weight',
           'margin', 'padding', 'border', 'width', 'height', 'display', 'position',
           'top', 'left', 'right', 'bottom', 'z-index', 'flex', 'grid',
           'transform', 'transition', 'animation'].forEach(prop => {
            const value = computedStyle.getPropertyValue(prop);
            if (value && value !== 'none' && value !== 'auto') {
              elementStyles.add(`${prop}: ${value};`);
            }
          });
          
          if (elementStyles.size > 0) {
            const selector = el.tagName.toLowerCase() + 
                           (el.id ? `#${el.id}` : '') + 
                           (el.className ? `.${el.className.split(' ').join('.')}` : '');
            styleRules.add(`${selector} { ${Array.from(elementStyles).join(' ')} }`);
          }
        }
      });
    }

    // Create the complete HTML document with all styles and content
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual HTML Editor Export</title>
    <style>
        /* Base styles */
        body {
            margin: 0;
            padding: 1rem;
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
        }
        
        /* Exported styles */
        ${Array.from(styleRules).join('\n        ')}
    </style>
</head>
<body>
    ${doc.body.innerHTML}
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