import { useRef } from "react";
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
  const { html, setHtml, setSelectedElement } = useEditorStore();
  const previewRef = useRef<HTMLDivElement>(null);

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
          srcDoc={html}
          style={{
            cursor: 'pointer'
          }}
          onLoad={(e) => {
            const frame = e.target as HTMLIFrameElement;
            if (frame.contentDocument) {
              frame.contentDocument.body.addEventListener('click', handleElementClick as any);
              frame.contentDocument.body.addEventListener('blur', handleBlur as any);
            }
          }}
        />
        <style>{`
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
        `}</style>
      </div>
    </Card>
  );
}
