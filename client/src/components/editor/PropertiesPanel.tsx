import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/lib/editor-store";

export function PropertiesPanel() {
  const { selectedElement } = useEditorStore();
  const [styles, setStyles] = useState<Record<string, string>>({});
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedElement) {
      const computedStyles = window.getComputedStyle(selectedElement);
      const styleObj: Record<string, string> = {};
      
      Array.from(computedStyles).forEach(style => {
        styleObj[style] = computedStyles.getPropertyValue(style);
      });
      
      setStyles(styleObj);

      const attrObj: Record<string, string> = {};
      Array.from(selectedElement.attributes).forEach(attr => {
        attrObj[attr.name] = attr.value;
      });
      
      setAttributes(attrObj);
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <Card className="h-full p-4">
        <p className="text-muted-foreground">Select an element to view properties</p>
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
              <Input 
                value={value}
                onChange={(e) => {
                  selectedElement.style.setProperty(property, e.target.value);
                }}
              />
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
                  selectedElement.setAttribute(name, e.target.value);
                }}
              />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
