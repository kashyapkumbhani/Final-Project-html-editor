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
  const { html, setSelectedElement } = useEditorStore();
  const [elements, setElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    // Parse the HTML to get all elements of the specified type
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const foundElements = Array.from(doc.getElementsByTagName(type));
    setElements(foundElements as HTMLElement[]);
  }, [html, type]);

  const handleElementClick = (element: HTMLElement) => {
    const previewFrame = document.querySelector('iframe');
    if (previewFrame && previewFrame.contentDocument) {
      const elementInPreview = previewFrame.contentDocument.querySelector(
        `[data-element-id="${element.getAttribute('data-element-id')}"]`
      ) as HTMLElement;
      
      if (elementInPreview) {
        // Highlight the element
        const prevHighlighted = previewFrame.contentDocument.querySelector('.element-highlight');
        if (prevHighlighted) {
          prevHighlighted.classList.remove('element-highlight');
        }
        elementInPreview.classList.add('element-highlight');
        
        // Scroll the element into view
        elementInPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Make element editable
        elementInPreview.contentEditable = 'true';
        elementInPreview.focus();
        
        setSelectedElement(elementInPreview);
      }
    }
  };

  return (
    <div className="space-y-2 pl-4">
      {elements.map((element, index) => (
        <Button
          key={index}
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={() => handleElementClick(element)}
          onMouseEnter={() => {
            const previewFrame = document.querySelector('iframe');
            if (previewFrame?.contentDocument) {
              const elementInPreview = previewFrame.contentDocument.querySelector(
                `[data-element-id="${element.getAttribute('data-element-id')}"]`
              ) as HTMLElement;
              if (elementInPreview) {
                elementInPreview.classList.add('element-hover');
              }
            }
          }}
          onMouseLeave={() => {
            const previewFrame = document.querySelector('iframe');
            if (previewFrame?.contentDocument) {
              const elementInPreview = previewFrame.contentDocument.querySelector(
                `[data-element-id="${element.getAttribute('data-element-id')}"]`
              ) as HTMLElement;
              if (elementInPreview) {
                elementInPreview.classList.remove('element-hover');
              }
            }
          }}
        >
          {element.textContent || `${type} ${index + 1}`}
        </Button>
      ))}
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
        <Accordion type="single" collapsible className="w-full">
          {elementTypes.map((element) => (
            <AccordionItem key={element.id} value={element.id}>
              <AccordionTrigger className="text-sm">
                <span className="flex items-center gap-2">
                  <element.icon className="h-4 w-4" />
                  {element.label}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ElementsList type={element.id} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}
