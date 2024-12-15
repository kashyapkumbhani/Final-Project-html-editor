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
  const { html } = useEditorStore();

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
          srcDoc={html}
          className="w-full h-full border-0"
          title="Preview"
          key={html} // Force iframe to reload when html changes
        />
      </div>
    </Card>
  );
}
