import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/lib/editor-store";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function PropertiesPanel() {
  const { selectedElement, html, setHtml } = useEditorStore();
  const [styles, setStyles] = useState<Record<string, string>>({});
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedElement) {
      const computedStyles = window.getComputedStyle(selectedElement);
      const styleObj: Record<string, string> = {};
      
      // Only show common CSS properties
      const commonProperties = [
        'color', 'background-color', 'font-size', 'font-weight',
        'margin', 'padding', 'border', 'width', 'height',
        'display', 'position', 'text-align', 'border-radius',
        'opacity', 'line-height', 'letter-spacing',
        'text-decoration', 'text-transform', 'box-shadow',
        'z-index', 'overflow', 'cursor'
      ];

  const colorProperties = ['color', 'background-color', 'border-color'];
      
      commonProperties.forEach(prop => {
        styleObj[prop] = selectedElement.style[prop as any] || computedStyles.getPropertyValue(prop);
      });
      
      setStyles(styleObj);

      const attrObj: Record<string, string> = {};
      Array.from(selectedElement.attributes).forEach(attr => {
        attrObj[attr.name] = attr.value;
      });
      
      setAttributes(attrObj);
    }
  }, [selectedElement]);

  return (
    <Card className={`h-full overflow-auto transition-opacity duration-200 ${!selectedElement ? 'opacity-50' : 'opacity-100'}`}>
      <Tabs defaultValue="styles">
        <TabsList className="w-full">
          <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
          <TabsTrigger value="attributes" className="flex-1">Attributes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="styles" className="p-4 space-y-4">
          {selectedElement ? (
            Object.entries(styles).map(([property, value]) => (
              <div key={property}>
                <Label>{property}</Label>
                {colorProperties.includes(property) ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={value}
                      onChange={(e) => {
                        if (selectedElement) {
                          const newValue = e.target.value;
                          selectedElement.style[property as any] = newValue;
                          setStyles(prev => ({ ...prev, [property]: newValue }));
                          const editor = document.querySelector('[data-visual-editor]');
                          if (editor) {
                            setHtml(editor.innerHTML);
                          }
                        }
                      }}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-8 h-8 rounded border cursor-pointer hover:border-primary" 
                          style={{ backgroundColor: value }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2">
                        <HexColorPicker
                          color={value}
                          onChange={(color) => {
                            if (selectedElement) {
                              selectedElement.style[property as any] = color;
                              setStyles(prev => ({ ...prev, [property]: color }));
                              const editor = document.querySelector('[data-visual-editor]');
                              if (editor) {
                                setHtml(editor.innerHTML);
                              }
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <Input 
                    value={value}
                    onChange={(e) => {
                      if (selectedElement) {
                        const newValue = e.target.value;
                        selectedElement.style[property as any] = newValue;
                        setStyles(prev => ({ ...prev, [property]: newValue }));
                        const editor = document.querySelector('[data-visual-editor]');
                        if (editor) {
                          setHtml(editor.innerHTML);
                        }
                      }
                    }}
                    className="font-mono"
                    placeholder={`Enter ${property}`}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Select an element to edit styles</p>
          )}
        </TabsContent>
        
        <TabsContent value="attributes" className="p-4 space-y-4">
          {selectedElement ? (
            Object.entries(attributes).map(([name, value]) => (
              <div key={name}>
                <Label>{name}</Label>
                <Input 
                  value={value}
                  onChange={(e) => {
                    if (selectedElement) {
                      selectedElement.setAttribute(name, e.target.value);
                      setHtml(document.querySelector('[data-visual-editor]')?.innerHTML || '');
                    }
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Select an element to edit attributes</p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
