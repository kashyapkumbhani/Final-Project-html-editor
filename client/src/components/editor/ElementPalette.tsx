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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const foundElements = Array.from(doc.getElementsByTagName(type));
    foundElements.forEach((el, index) => {
      if (!el.getAttribute('data-element-id')) {
        el.setAttribute('data-element-id', `${type}-${index}`);
      }
    });
    setElements(foundElements as HTMLElement[]);
  }, [html, type]);

  const handleElementSelect = (element: HTMLElement) => {
    const elementId = element.getAttribute('data-element-id');
    if (!elementId) return;

    // Update preview and highlight selected element
    const previewFrame = document.querySelector('iframe');
    if (previewFrame?.contentDocument) {
      // Remove existing highlights
      previewFrame.contentDocument.querySelectorAll('.element-highlight').forEach(el => {
        el.classList.remove('element-highlight');
      });

      // Find and highlight the selected element
      const elementInPreview = previewFrame.contentDocument.querySelector(
        `[data-element-id="${elementId}"]`
      ) as HTMLElement;

      if (elementInPreview) {
        elementInPreview.classList.add('element-highlight');
        elementInPreview.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        setSelectedElement(elementInPreview);
      }
    }
  };

  return (
    <div className="space-y-2 pl-4">
      {elements.map((element) => {
        const elementId = element.getAttribute('data-element-id');
        const elementText = type === 'img' ? element.getAttribute('alt') || '' : element.textContent || '';
        
        return (
          <div 
            key={elementId} 
            className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer group"
            onClick={() => handleElementSelect(element)}
            onMouseEnter={() => {
              const previewFrame = document.querySelector('iframe');
              if (previewFrame?.contentDocument) {
                const elementInPreview = previewFrame.contentDocument.querySelector(
                  `[data-element-id="${elementId}"]`
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
                  `[data-element-id="${elementId}"]`
                ) as HTMLElement;
                if (elementInPreview) {
                  elementInPreview.classList.remove('element-hover');
                }
              }
            }}
          >
            <span className="text-xs text-muted-foreground font-mono">
              {type.toUpperCase()}
            </span>
            <span className="text-sm truncate flex-1">
              {elementText || `(Empty ${type})`}
            </span>
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
              Click to select
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
