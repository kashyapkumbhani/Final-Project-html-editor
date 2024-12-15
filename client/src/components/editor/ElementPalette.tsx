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
  const { html, setHtml, setSelectedElement } = useEditorStore();
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const handleElementClick = (element: HTMLElement, index: number) => {
    const previewFrame = document.querySelector('iframe');
    if (previewFrame && previewFrame.contentDocument) {
      const elementId = element.getAttribute('data-element-id');
      const elementInPreview = previewFrame.contentDocument.querySelector(
        `[data-element-id="${elementId}"]`
      ) as HTMLElement;
      
      if (elementInPreview) {
        // Remove previous highlight
        const prevHighlighted = previewFrame.contentDocument.querySelector('.element-highlight');
        if (prevHighlighted) {
          prevHighlighted.classList.remove('element-highlight');
        }
        
        // Add highlight
        elementInPreview.classList.add('element-highlight');
        
        // Scroll into view
        elementInPreview.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
        
        setSelectedElement(elementInPreview);
        setEditingIndex(index);
      }
    }
  };

  const handleTextEdit = (index: number, newText: string) => {
    const elementId = elements[index].getAttribute('data-element-id');
    
    // Parse the current HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find and update the element in the parsed HTML
    const elementToUpdate = doc.querySelector(`[data-element-id="${elementId}"]`);
    if (elementToUpdate) {
      elementToUpdate.textContent = newText;
      
      // Update the HTML state with the modified content
      const updatedHtml = doc.documentElement.outerHTML;
      setHtml(updatedHtml);
      
      // Update local elements list for the sidebar
      const updatedElements = [...elements];
      updatedElements[index] = elementToUpdate as HTMLElement;
      setElements(updatedElements);
      
      // Set the selected element to highlight it in the preview
      const previewFrame = document.querySelector('iframe');
      if (previewFrame?.contentDocument) {
        const elementInPreview = previewFrame.contentDocument.querySelector(
          `[data-element-id="${elementId}"]`
        ) as HTMLElement;
        if (elementInPreview) {
          setSelectedElement(elementInPreview);
          elementInPreview.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  };

  return (
    <div className="space-y-2 pl-4">
      {elements.map((element, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div
            className="p-2 rounded hover:bg-accent group relative"
            onMouseEnter={() => {
              const previewFrame = document.querySelector('iframe');
              if (previewFrame?.contentDocument) {
                const elementInPreview = previewFrame.contentDocument.querySelector(
                  `[data-element-id="${element.getAttribute('data-element-id')}"]`
                ) as HTMLElement;
                if (elementInPreview) {
                  elementInPreview.classList.add('element-hover');
                  elementInPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            <input
              type="text"
              value={element.textContent || ''}
              onChange={(e) => handleTextEdit(index, e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick(element, index);
              }}
              className="w-full bg-transparent border-none focus:ring-2 focus:ring-primary rounded px-2 py-1 text-sm cursor-text"
              placeholder={`${type} ${index + 1}`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
              Click to edit
            </div>
          </div>
        </div>
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
