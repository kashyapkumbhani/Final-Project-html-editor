import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useEditorStore } from "@/lib/editor-store";

interface PreviewProps {
  mode: "desktop" | "tablet" | "mobile";
}

const viewportSizes = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export function Preview({ mode }: PreviewProps) {
  const { html, setHtml, setSelectedElement, selectedElement } = useEditorStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleElementClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target !== previewRef.current) {
      setSelectedElement(target);
      target.contentEditable = "true";
      target.focus();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    target.contentEditable = "false";
    if (previewRef.current) {
      setHtml(previewRef.current.innerHTML);
    }
  };

  useEffect(() => {
    const updatePreview = () => {
      if (iframeRef.current?.contentDocument) {
        const doc = iframeRef.current.contentDocument;
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                * {
                  outline: 1px solid transparent;
                  transition: all 0.2s ease;
                }
                .element-hover {
                  outline: 2px solid #3b82f6 !important;
                  background-color: rgba(59, 130, 246, 0.1);
                }
                .element-highlight {
                  outline: 3px solid #2563eb !important;
                  outline-offset: 2px;
                  background-color: rgba(37, 99, 235, 0.1);
                }
                *:focus {
                  outline: 2px solid #2563eb;
                  outline-offset: 2px;
                }
                body {
                  margin: 0;
                  padding: 1rem;
                  min-height: 100vh;
                }
              </style>
            </head>
            <body>${html}</body>
          </html>
        `);
        doc.close();

        // Handle element highlighting and scrolling
        if (selectedElement) {
          const elementId = selectedElement.getAttribute('data-element-id');
          if (elementId) {
            setTimeout(() => {
              const elementInPreview = doc.querySelector(
                `[data-element-id="${elementId}"]`
              ) as HTMLElement;
              if (elementInPreview) {
                // Remove any existing highlights
                doc.querySelectorAll('.element-highlight').forEach(el => {
                  el.classList.remove('element-highlight');
                });
                
                elementInPreview.classList.add('element-highlight');
                elementInPreview.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            }, 100); // Small delay to ensure DOM is ready
          }
        }
      }
    };

    updatePreview();
  }, [html, selectedElement]);

  return (
    <Card className="h-full overflow-auto flex items-center justify-center p-4">
      <div
        style={{
          width: viewportSizes[mode],
          height: "100%",
          transform: mode === "mobile" ? "scale(0.75)" : "none",
          transformOrigin: "top center",
        }}
        className="bg-white shadow-lg overflow-auto transition-all duration-300"
      >
        <iframe
          ref={previewRef as any}
          className="min-h-full w-full border-none"
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  * {
                    outline: 1px solid transparent;
                    transition: all 0.2s ease;
                  }
                  .element-hover {
                    outline: 2px solid #3b82f6 !important;
                    background-color: rgba(59, 130, 246, 0.1);
                  }
                  .element-highlight {
                    outline: 3px solid #2563eb !important;
                    outline-offset: 2px;
                    background-color: rgba(37, 99, 235, 0.1);
                  }
                  *:focus {
                    outline: 2px solid #2563eb;
                    outline-offset: 2px;
                  }
                </style>
              </head>
              <body>${html}</body>
            </html>
          `}
          style={{
            cursor: 'pointer'
          }}
          onLoad={(e) => {
            const frame = e.target as HTMLIFrameElement;
            if (frame.contentDocument) {
              frame.contentDocument.body.addEventListener('click', handleElementClick as any);
              frame.contentDocument.body.addEventListener('blur', handleBlur as any);
              
              // Re-apply any existing highlights
              if (selectedElement) {
                const elementId = selectedElement.getAttribute('data-element-id');
                const elementInPreview = frame.contentDocument.querySelector(
                  `[data-element-id="${elementId}"]`
                );
                if (elementInPreview) {
                  elementInPreview.classList.add('element-highlight');
                }
              }
            }
          }}
        />
      </div>
    </Card>
  );
}
