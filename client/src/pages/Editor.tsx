import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Preview } from "@/components/editor/Preview";
import { ElementPalette } from "@/components/editor/ElementPalette";
import { useEditorStore } from "@/lib/editor-store";

export default function Editor() {
  const [previewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  return (
    <div className="h-screen flex">
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
  );
}
