import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/lib/editor-store";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const colorProperties = [
  'color',
  'background-color',
  'border-color',
  'outline-color',
  'text-decoration-color'
];

const fontProperties = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'letter-spacing',
  'line-height',
  'text-align',
  'text-decoration',
  'text-transform'
];

const spacingProperties = [
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left'
];

const borderProperties = [
  'border',
  'border-width',
  'border-style',
  'border-color',
  'border-radius',
  'outline',
  'box-shadow'
];

const layoutProperties = [
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'z-index',
  'overflow',
  'opacity'
];

const transformProperties = [
  'transform',
  'transform-origin',
  'transition',
  'transition-duration',
  'transition-timing-function'
];

const hoverProperties = [
  ':hover color',
  ':hover background-color',
  ':hover border-color',
  ':hover opacity',
  ':hover transform'
];

const fontWeightOptions = [
  '100', '200', '300', '400', '500', '600', '700', '800', '900'
];

const fontFamilyOptions = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'system-ui', 'sans-serif', 'serif', 'monospace'
];

const displayOptions = [
  'block', 'inline', 'inline-block', 'flex', 'grid', 'none'
];

const positionOptions = [
  'static', 'relative', 'absolute', 'fixed', 'sticky'
];

const textAlignOptions = [
  'left', 'center', 'right', 'justify'
];

export function PropertiesPanel() {
  const { selectedElement, updateElementStyle } = useEditorStore();
  const [styles, setStyles] = useState<Record<string, string>>({});
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (selectedElement) {
      if (!selectedElement.getAttribute('data-element-id')) {
        selectedElement.setAttribute('data-element-id', `el-${Date.now()}`);
      }

      const computedStyles = window.getComputedStyle(selectedElement);
      const styleObj: Record<string, string> = {};
      
      // Collect all styles
      const allProperties = [
        ...colorProperties,
        ...fontProperties,
        ...spacingProperties,
        ...borderProperties,
        ...layoutProperties,
        ...transformProperties
      ];

      allProperties.forEach(prop => {
        styleObj[prop] = selectedElement.style[prop as any] || computedStyles.getPropertyValue(prop);
      });

      // Add hover styles
      const hoverStyle = document.createElement('style');
      document.head.appendChild(hoverStyle);
      const styleSheet = hoverStyle.sheet!;
      hoverProperties.forEach(prop => {
        const baseProp = prop.replace(':hover ', '');
        styleObj[prop] = selectedElement.style[baseProp as any] || '';
      });
      document.head.removeChild(hoverStyle);
      
      setStyles(styleObj);

      const attrObj: Record<string, string> = {};
      Array.from(selectedElement.attributes).forEach(attr => {
        attrObj[attr.name] = attr.value;
      });
      
      setAttributes(attrObj);
    }
  }, [selectedElement]);

  const handleStyleChange = (property: string, value: string) => {
    if (!selectedElement) return;
    
    setStyles(prev => ({ ...prev, [property]: value }));
    
    if (property.startsWith(':hover ')) {
      const baseProp = property.replace(':hover ', '');
      const elementId = selectedElement.getAttribute('data-element-id');
      const styleTag = document.getElementById(`hover-style-${elementId}`) || (() => {
        const tag = document.createElement('style');
        tag.id = `hover-style-${elementId}`;
        document.head.appendChild(tag);
        return tag;
      })();
      
      styleTag.textContent = `
        [data-element-id="${elementId}"]:hover {
          ${baseProp}: ${value};
        }
      `;
    } else {
      updateElementStyle(property, value);
    }
  };

  if (!selectedElement) {
    return (
      <Card className="h-full overflow-auto p-4">
        <p className="text-muted-foreground">Select an element to edit properties</p>
      </Card>
    );
  }

  const renderStyleInput = (property: string, value: string) => {
    if (colorProperties.includes(property)) {
      return (
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
      );
    }

    if (property === 'font-weight') {
      return (
        <Select value={value} onValueChange={(val) => handleStyleChange(property, val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {fontWeightOptions.map(weight => (
              <SelectItem key={weight} value={weight}>{weight}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (property === 'font-family') {
      return (
        <Select value={value} onValueChange={(val) => handleStyleChange(property, val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilyOptions.map(font => (
              <SelectItem key={font} value={font}>{font}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (property === 'display') {
      return (
        <Select value={value} onValueChange={(val) => handleStyleChange(property, val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select display" />
          </SelectTrigger>
          <SelectContent>
            {displayOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (property === 'position') {
      return (
        <Select value={value} onValueChange={(val) => handleStyleChange(property, val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positionOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (property === 'text-align') {
      return (
        <Select value={value} onValueChange={(val) => handleStyleChange(property, val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            {textAlignOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input 
        value={value}
        onChange={(e) => handleStyleChange(property, e.target.value)}
        className="font-mono"
        placeholder={`Enter ${property}`}
      />
    );
  };

  return (
    <Card className="h-full overflow-auto">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="p-4 space-y-4">
          {colorProperties.concat(spacingProperties).map(property => (
            <div key={property}>
              <Label>{property}</Label>
              {renderStyleInput(property, styles[property] || '')}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="layout" className="p-4 space-y-4">
          {layoutProperties.map(property => (
            <div key={property}>
              <Label>{property}</Label>
              {renderStyleInput(property, styles[property] || '')}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="typography" className="p-4 space-y-4">
          {fontProperties.map(property => (
            <div key={property}>
              <Label>{property}</Label>
              {renderStyleInput(property, styles[property] || '')}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="effects" className="p-4 space-y-4">
          {[...borderProperties, ...transformProperties, ...hoverProperties].map(property => (
            <div key={property}>
              <Label>{property}</Label>
              {renderStyleInput(property, styles[property] || '')}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
