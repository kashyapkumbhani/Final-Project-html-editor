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
        <div
          ref={previewRef}
          className="min-h-full w-full"
          onClick={handleElementClick}
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            cursor: 'pointer'
          }}
        />
        <style>{`
          [data-preview] * {
            outline: 1px solid transparent;
            transition: outline 0.2s ease;
          }
          [data-preview] *:hover {
            outline: 2px solid #3b82f6;
          }
          [data-preview] *:focus {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
          }
        `}</style>
      </div>
    </Card>
  );
}
