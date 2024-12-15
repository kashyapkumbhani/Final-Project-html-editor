import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useDrag, useDrop } from "react-dnd";
import { useEditorStore } from "@/lib/editor-store";
import { parseHtml, updateHtml } from "@/lib/html-utils";

export function VisualEditor() {
  const { html, setHtml, selectedElement, setSelectedElement } = useEditorStore();
  const editorRef = useRef<HTMLDivElement>(null);

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    setSelectedElement(target);
  };

  const handleDrop = (item: any, monitor: any) => {
    const clientOffset = monitor.getClientOffset();
    const editorBounds = editorRef.current?.getBoundingClientRect();
    
    if (editorBounds && clientOffset) {
      const element = document.createElement(item.type);
      const x = clientOffset.x - editorBounds.left;
      const y = clientOffset.y - editorBounds.top;
      
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      
      const newHtml = updateHtml(html, element);
      setHtml(newHtml);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['div', 'p', 'button', 'input', 'form'],
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Card className="h-full overflow-auto relative p-4">
      <div 
        ref={(node) => {
          drop(node);
          editorRef.current = node;
        }}
        className="min-h-full relative"
        onClick={handleElementClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Card>
  );
}
