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
  const [elements, setElements] = useState<Array<{ id: string; text: string }>>([]);

  // Function to scan HTML and update elements list
  const scanHtml = () => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Find all elements of the specified tag
    const foundElements = Array.from(tempDiv.getElementsByTagName(tag));
    
    // Map elements to our format with IDs
    const mappedElements = foundElements.map(el => {
      let id = el.getAttribute('data-element-id');
      if (!id) {
        id = `${tag}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        el.setAttribute('data-element-id', id);
      }
      return {
        id,
        text: el.textContent || ''
      };
    });

    setElements(mappedElements);

    // Update HTML if we added any IDs
    if (foundElements.some(el => el.getAttribute('data-element-id'))) {
      setHtml(tempDiv.innerHTML);
    }
  };

  // Scan HTML whenever it changes
  useEffect(() => {
    scanHtml();
  }, [html]);

  const updateElementText = (elementId: string, newText: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const elementToUpdate = tempDiv.querySelector(`[data-element-id="${elementId}"]`);
    if (elementToUpdate) {
      elementToUpdate.textContent = newText;
      setHtml(tempDiv.innerHTML);
    }
  };

  return (
    <div className="space-y-2 p-2 max-h-[200px] overflow-y-auto">
      {elements.map((element) => (
        <div 
          key={element.id}
          className="flex items-center gap-2 bg-background/50 p-2 rounded-md hover:bg-accent"
        >
          <Input
            value={element.text}
            onChange={(e) => updateElementText(element.id, e.target.value)}
            className="h-8 text-sm"
            placeholder={`Edit ${tag} text`}
          />
        </div>
      ))}
      {elements.length === 0 && (
        <div className="text-sm text-muted-foreground px-2">
          No {tag} elements found
        </div>
      )}
    </div>
  );
}

export function ElementPalette() {
  return (
    <Card className="h-1/2 overflow-hidden flex flex-col">
      <div className="p-4 flex-shrink-0">
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
      </div>

      {/* Existing Elements */}
      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" className="w-full">
          {elementTypes.map((element) => (
            <AccordionItem key={element.id} value={element.id}>
              <AccordionTrigger className="text-sm px-4">
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
