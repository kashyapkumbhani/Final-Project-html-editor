import { useDrag } from "react-dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Type, 
  Square, 
  FormInput, 
  Heading1, 
  Heading2, 
  Heading3,
  Image, 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEditorStore } from "@/lib/editor-store";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const elementTypes = [
  { id: "p", icon: Type, label: "Paragraphs" },
  { id: "h1", icon: Heading1, label: "Heading 1" },
  { id: "h2", icon: Heading2, label: "Heading 2" },
  { id: "h3", icon: Heading3, label: "Heading 3" },
  { id: "button", icon: Square, label: "Buttons" },
  { id: "img", icon: Image, label: "Images" },
];

function DraggableElement({ type, icon: Icon, label }: { type: string; icon: any; label: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Button
        variant="outline"
        className="flex items-center gap-2 w-full justify-start"
      >
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
}

function ElementsList({ type }: { type: string }) {
  const { html, setHtml } = useEditorStore();
  const [elements, setElements] = useState<HTMLElement[]>([]);

  // Update elements list when HTML changes
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const foundElements = Array.from(doc.getElementsByTagName(type));
    
    // Ensure all elements have IDs
    foundElements.forEach((el, index) => {
      if (!el.getAttribute('data-element-id')) {
        el.setAttribute('data-element-id', `${type}-${index}`);
      }
    });
    
    setElements(foundElements as HTMLElement[]);
  }, [html, type]);

  // Function to update element text
  const updateElementText = (elementId: string, newText: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const elementToUpdate = doc.querySelector(`[data-element-id="${elementId}"]`);
    if (elementToUpdate) {
      elementToUpdate.textContent = newText;
      
      // Update the editor store with new HTML
      setHtml(doc.documentElement.outerHTML);
      
      // Update local elements list
      const updatedElements = Array.from(doc.getElementsByTagName(type)) as HTMLElement[];
      setElements(updatedElements);
    }
  };

  return (
    <div className="space-y-2 pl-4">
      {elements.map((element) => {
        const elementId = element.getAttribute('data-element-id') || '';
        
        return (
          <div key={elementId} className="flex items-center gap-2 p-2 rounded hover:bg-accent group">
            <Input
              value={element.textContent || ''}
              onChange={(e) => updateElementText(elementId, e.target.value)}
              className="flex-1 h-8 px-2 text-sm"
              placeholder={`${type} element`}
            />
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              Edit text
            </span>
          </div>
        );
      })}
      {elements.length === 0 && (
        <p className="text-sm text-muted-foreground pl-2">No {type} elements found</p>
      )}
    </div>
  );
}

export function ElementPalette() {
  return (
    <Card className="h-full p-4 overflow-auto">
      <div className="space-y-4">
        <h3 className="font-medium mb-4">Page Elements</h3>
        <div className="space-y-2">
          {elementTypes.map((element) => (
            <DraggableElement
              key={element.id}
              type={element.id}
              icon={element.icon}
              label={element.label}
            />
          ))}
        </div>
        {/* Removed Accordion, directly rendering DraggableElements */}

      </div>
    </Card>
  );
}