import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/lib/editor-store";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const colorProperties = ['color', 'background-color', 'border-color'];

export function PropertiesPanel() {
  const { selectedElement, updateElementStyle } = useEditorStore();
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

  const handleStyleChange = (property: string, value: string) => {
    updateElementStyle(property, value);
    setStyles(prev => ({ ...prev, [property]: value }));
  };

  if (!selectedElement) {
    return (
      <Card className="h-full overflow-auto p-4">
        <p className="text-muted-foreground">Select an element to edit properties</p>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <Tabs defaultValue="styles">
        <TabsList className="w-full">
          <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
          <TabsTrigger value="attributes" className="flex-1">Attributes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="styles" className="p-4 space-y-4">
          {Object.entries(styles).map(([property, value]) => (
            <div key={property}>
              <Label>{property}</Label>
              {colorProperties.includes(property) ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={value}
                    onChange={(e) => handleStyleChange(property, e.target.value)}
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
                        onChange={(color) => handleStyleChange(property, color)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <Input 
                  value={value}
                  onChange={(e) => handleStyleChange(property, e.target.value)}
                  className="font-mono"
                  placeholder={`Enter ${property}`}
                />
              )}
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="attributes" className="p-4 space-y-4">
          {Object.entries(attributes).map(([name, value]) => (
            <div key={name}>
              <Label>{name}</Label>
              <Input 
                value={value}
                onChange={(e) => {
                  if (selectedElement) {
                    selectedElement.setAttribute(name, e.target.value);
                    const editor = document.querySelector('[data-visual-editor]');
                    if (editor) {
                      const { setHtml } = useEditorStore.getState();
                      setHtml(editor.innerHTML);
                    }
                  }
                }}
              />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
