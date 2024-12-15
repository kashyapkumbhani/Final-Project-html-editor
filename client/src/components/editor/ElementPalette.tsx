import { useDrag } from "react-dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type, Square, FormInput } from "lucide-react";

const elements = [
  { id: "text", type: "p", icon: Type, label: "Text" },
  { id: "button", type: "button", icon: Square, label: "Button" },
  { id: "input", type: "input", icon: FormInput, label: "Input" },
];

function DraggableElement({ type, icon: Icon, label }: { type: string; icon: any; label: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Button
        variant="outline"
        className="flex items-center gap-2 w-full"
      >
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
}

export function ElementPalette() {
  return (
    <Card className="p-4 space-y-2">
      <h3 className="font-medium mb-4">Elements</h3>
      {elements.map((element) => (
        <DraggableElement
          key={element.id}
          type={element.type}
          icon={element.icon}
          label={element.label}
        />
      ))}
    </Card>
  );
}
