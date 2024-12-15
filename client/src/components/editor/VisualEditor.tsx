import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useDrag, useDrop } from "react-dnd";
import { useEditorStore } from "@/lib/editor-store";
import { parseHtml, updateHtml, getXPath, evaluateXPath } from "@/lib/html-utils";

export function VisualEditor() {
  const { html, setHtml, selectedElement, setSelectedElement } = useEditorStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const [editingElement, setEditingElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editingElement && !editingElement.contains(e.target as Node)) {
        finishEditing();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingElement]);

  const finishEditing = () => {
    if (editingElement) {
      const doc = parseHtml(html);
      const xpath = getXPath(editingElement);
      const elementInDoc = evaluateXPath(doc, xpath);
      
      if (elementInDoc) {
        elementInDoc.innerHTML = editingElement.innerHTML;
        setHtml(doc.documentElement.outerHTML);
      }
      
      setEditingElement(null);
    }
  };

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    setSelectedElement(target);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.nodeType === Node.ELEMENT_NODE && target !== editorRef.current) {
      target.contentEditable = "true";
      target.focus();
      setEditingElement(target);
    }
  };

  const handleDrop = (item: any, monitor: any) => {
    const clientOffset = monitor.getClientOffset();
    const editorBounds = editorRef.current?.getBoundingClientRect();
    
    if (editorBounds && clientOffset) {
      const element = document.createElement(item.type);
      const x = clientOffset.x - editorBounds.left;
      const y = clientOffset.y - editorBounds.top;
      
      if (item.type === 'p') {
        element.textContent = 'Double-click to edit text';
      } else if (item.type === 'button') {
        element.textContent = 'Button';
      }
      
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
        onDoubleClick={handleDoubleClick}
        onBlur={finishEditing}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Card>
  );
}
