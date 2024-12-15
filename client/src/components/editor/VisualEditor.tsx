import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useDrop } from "react-dnd";
import { useEditorStore } from "@/lib/editor-store";
import { ImageUploadDialog } from "./ImageUploadDialog";

export function VisualEditor() {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
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
    if (editingElement && editorRef.current) {
      editingElement.contentEditable = "false";
      setEditingElement(null);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    
    // Don't select the editor container itself
    if (target === editorRef.current) return;
    
    // Handle image clicks
    if (target.tagName.toLowerCase() === 'img') {
      setSelectedImage(target as HTMLImageElement);
      setShowImageUpload(true);
    }
    
    setSelectedElement(target);
  };

  const handleImageUpload = (imageUrl: string) => {
    if (selectedImage && editorRef.current) {
      selectedImage.src = imageUrl;
      setHtml(editorRef.current.innerHTML);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    
    // Don't make the editor container editable
    if (target === editorRef.current) return;
    
    target.contentEditable = "true";
    target.focus();
    setEditingElement(target);
  };

  const handleDrop = (item: any, monitor: any) => {
    const clientOffset = monitor.getClientOffset();
    const editorBounds = editorRef.current?.getBoundingClientRect();
    
    if (editorBounds && clientOffset && editorRef.current) {
      const x = clientOffset.x - editorBounds.left;
      const y = clientOffset.y - editorBounds.top;
      
      let element: HTMLElement;
      
      switch (item.type) {
        case 'p':
          element = document.createElement('p');
          element.textContent = 'Double-click to edit text';
          break;
        case 'button':
          element = document.createElement('button');
          element.textContent = 'Button';
          element.className = 'px-4 py-2 bg-blue-500 text-white rounded';
          break;
        case 'input':
          element = document.createElement('input');
          element.placeholder = 'Enter text...';
          element.className = 'px-4 py-2 border rounded';
          break;
        default:
          element = document.createElement('div');
          element.textContent = 'New Element';
      }
      
      // Assign a unique ID for selection tracking
      element.setAttribute('data-element-id', `el-${Date.now()}`);
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      
      editorRef.current.appendChild(element);
      setHtml(editorRef.current.innerHTML);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['p', 'button', 'input'],
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Card className="h-full overflow-auto">
      <div 
        ref={(node) => {
          drop(node);
          if (node) editorRef.current = node;
        }}
        className="min-h-full p-4"
        data-visual-editor
        onClick={handleElementClick}
        onDoubleClick={handleDoubleClick}
        onBlur={finishEditing}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ImageUploadDialog
        open={showImageUpload}
        onOpenChange={setShowImageUpload}
        onImageUpload={handleImageUpload}
        currentSrc={selectedImage?.src}
      />
    </Card>
  );
}
