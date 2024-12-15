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

const getIconForElement = (type: string) => {
  switch (type.toLowerCase()) {
    case 'h1':
      return Heading1;
    case 'h2':
      return Heading2;
    case 'h3':
      return Heading3;
    case 'h4':
      return Heading2; // Reuse Heading2 icon for h4
    case 'h5':
      return Heading3; // Reuse Heading3 icon for h5
    case 'h6':
      return Heading3; // Reuse Heading3 icon for h6
    case 'p':
      return Type;
    case 'button':
      return Square;
    case 'img':
      return Image;
    default:
      return Type; // Default icon for unknown elements
  }
};

const getLabelForElement = (type: string) => {
  switch (type.toLowerCase()) {
    case 'h1':
      return 'Heading 1';
    case 'h2':
      return 'Heading 2';
    case 'h3':
      return 'Heading 3';
    case 'h4':
      return 'Heading 4';
    case 'h5':
      return 'Heading 5';
    case 'h6':
      return 'Heading 6';
    case 'p':
      return 'Paragraphs';
    case 'button':
      return 'Buttons';
    case 'img':
      return 'Images';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1) + 's';
  }
};

const useElementTypes = () => {
  const { html } = useEditorStore();
  const [elementTypes, setElementTypes] = useState<Array<{ id: string; icon: any; label: string }>>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.getElementsByTagName('*');
    const uniqueTypes = new Set<string>();
    
    Array.from(elements).forEach(element => {
      uniqueTypes.add(element.tagName.toLowerCase());
    });

    const types = Array.from(uniqueTypes)
      .filter(type => type !== 'html' && type !== 'head' && type !== 'body' && type !== 'style' && type !== 'script')
      .map(type => ({
        id: type,
        icon: getIconForElement(type),
        label: getLabelForElement(type)
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    setElementTypes(types);
  }, [html]);

  return elementTypes;
};

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
    // Get elements from the preview iframe instead of parsing HTML
    const previewFrame = document.querySelector('iframe');
    if (previewFrame?.contentDocument) {
      const foundElements = Array.from(previewFrame.contentDocument.getElementsByTagName(type));
      foundElements.forEach((el, index) => {
        if (!el.getAttribute('data-element-id')) {
          el.setAttribute('data-element-id', `${type}-${index}`);
        }
      });
      setElements(foundElements as HTMLElement[]);
    }
  }, [html, type]);

  const handleElementSelect = (element: HTMLElement) => {
    const elementId = element.getAttribute('data-element-id');
    if (!elementId) return;

    const previewFrame = document.querySelector('iframe');
    if (previewFrame?.contentDocument) {
      // Clear existing highlights
      const existingHighlights = previewFrame.contentDocument.querySelectorAll('.element-highlight');
      existingHighlights.forEach(el => el.classList.remove('element-highlight'));

      // Find the element in preview
      const elementInPreview = previewFrame.contentDocument.querySelector(
        `[data-element-id="${elementId}"]`
      );

      if (elementInPreview) {
        // Add highlight class
        elementInPreview.classList.add('element-highlight');
        
        // Scroll into view
        elementInPreview.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Set as selected element
        setSelectedElement(elementInPreview as HTMLElement);
      }
    }
  };

  return (
    <div className="space-y-2 pl-4">
      {elements.map((element) => {
        const elementId = element.getAttribute('data-element-id');
        const elementText = type === 'img' ? 
          element.getAttribute('alt') || 'Image' : 
          element.textContent?.slice(0, 30) || `${type} element`;
        
        return (
          <div 
            key={elementId} 
            className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
            onClick={() => handleElementSelect(element)}
          >
            <span className="text-xs text-muted-foreground font-mono">
              {type.toUpperCase()}
            </span>
            <span className="text-sm truncate flex-1">
              {elementText}
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
  const elementTypes = useElementTypes();
  
  if (elementTypes.length === 0) {
    return (
      <Card className="h-full p-4 overflow-auto">
        <div className="space-y-4">
          <h3 className="font-medium mb-4">Page Elements</h3>
          <p className="text-sm text-muted-foreground">No elements found. Try importing an HTML file.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="elements">
          <div className="px-4 pt-4">
            <AccordionTrigger className="text-base font-medium">
              Page Elements
            </AccordionTrigger>
          </div>
          <AccordionContent>
            <div className="px-4 pb-4">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
