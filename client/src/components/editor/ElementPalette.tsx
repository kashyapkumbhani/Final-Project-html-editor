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
  { id: "p", icon: Type, label: "Paragraph", tag: "p" },
  { id: "h1", icon: Heading1, label: "Heading 1", tag: "h1" },
  { id: "h2", icon: Heading2, label: "Heading 2", tag: "h2" },
  { id: "h3", icon: Heading3, label: "Heading 3", tag: "h3" },
  { id: "button", icon: Square, label: "Button", tag: "button" },
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
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-2">
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

function ElementsList({ tag }: { tag: string }) {
  const { html, setHtml } = useEditorStore();
  const [elements, setElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const foundElements = Array.from(doc.getElementsByTagName(tag));
    setElements(foundElements as HTMLElement[]);
  }, [html, tag]);

  const handleTextChange = (element: HTMLElement, newText: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elementId = element.getAttribute('data-element-id');
    
    if (elementId) {
      const targetElement = doc.querySelector(`[data-element-id="${elementId}"]`);
      if (targetElement) {
        targetElement.textContent = newText;
        setHtml(doc.documentElement.outerHTML);
      }
    }
  };

  if (elements.length === 0) {
    return (
      <div className="px-4 py-2 text-sm text-muted-foreground">
        No {tag} elements found
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {elements.map((element, index) => {
        // Ensure element has a data-element-id
        if (!element.getAttribute('data-element-id')) {
          element.setAttribute('data-element-id', `${tag}-${Date.now()}-${index}`);
        }
        
        return (
          <div 
            key={element.getAttribute('data-element-id')} 
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent group"
          >
            <Input
              value={element.textContent || ''}
              onChange={(e) => handleTextChange(element, e.target.value)}
              className="h-8 text-sm"
              placeholder={`Edit ${tag} text`}
            />
          </div>
        );
      })}
    </div>
  );
}

export function ElementPalette() {
  return (
    <Card className="h-full overflow-auto">
      <div className="p-4">
        <h3 className="font-medium mb-4">Page Elements</h3>
        
        {/* Draggable Elements */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Drag to add new elements</p>
          {elementTypes.map((element) => (
            <DraggableElement
              key={element.id}
              type={element.id}
              icon={element.icon}
              label={element.label}
            />
          ))}
        </div>

        {/* Existing Elements */}
        <Accordion type="multiple" className="w-full">
          {elementTypes.map((element) => (
            <AccordionItem key={element.id} value={element.id}>
              <AccordionTrigger className="text-sm">
                {element.label}s
              </AccordionTrigger>
              <AccordionContent>
                <ElementsList tag={element.tag} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}
