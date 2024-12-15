import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import * as monaco from "monaco-editor";
import { useEditorStore } from "@/lib/editor-store";

export function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { html, setHtml } = useEditorStore();

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = monaco.editor.create(
        document.getElementById("monaco-editor")!,
        {
          value: html,
          language: "html",
          theme: "vs-light",
          minimap: { enabled: false },
          automaticLayout: true,
        }
      );

      editorRef.current.onDidChangeModelContent(() => {
        const value = editorRef.current?.getValue() || "";
        setHtml(value);
      });
    }

    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && html !== editorRef.current.getValue()) {
      editorRef.current.setValue(html);
    }
  }, [html]);

  return (
    <Card className="h-full">
      <div id="monaco-editor" className="h-full w-full" />
    </Card>
  );
}
