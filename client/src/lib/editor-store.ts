import { create } from 'zustand';

interface EditorStore {
  html: string;
  setHtml: (html: string) => void;
  selectedElement: HTMLElement | null;
  setSelectedElement: (element: HTMLElement | null) => void;
  updateElementStyle: (property: string, value: string) => void;
  history: string[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  html: '<!DOCTYPE html><html><head><title>Visual HTML Editor</title></head><body></body></html>',
  selectedElement: null,
  history: ['<!DOCTYPE html><html><head><title>Visual HTML Editor</title></head><body></body></html>'],
  currentIndex: 0,
  canUndo: false,
  canRedo: false,

  setHtml: (html) => {
    const { history, currentIndex } = get();
    const newHistory = [...history.slice(0, currentIndex + 1), html];
    set({ 
      html,
      history: newHistory,
      currentIndex: newHistory.length - 1,
      canUndo: newHistory.length > 1,
      canRedo: false
    });
  },

  setSelectedElement: (element) => {
    set({ selectedElement: element });
  },

  updateElementStyle: (property, value) => {
    const { selectedElement, setHtml } = get();
    if (selectedElement) {
      // Update the style
      selectedElement.style[property as any] = value;
      
      // Find the editor container
      const editor = document.querySelector('[data-visual-editor]');
      if (editor) {
        // Create a new document fragment to preserve event listeners
        const temp = document.createElement('div');
        temp.innerHTML = editor.innerHTML;
        
        // Find and update the corresponding element in the fragment
        const elementInFragment = temp.querySelector(`[data-element-id="${selectedElement.getAttribute('data-element-id')}"]`);
        if (elementInFragment) {
          elementInFragment.setAttribute('style', selectedElement.getAttribute('style') || '');
        }
        
        // Update the HTML with the modified content
        setHtml(temp.innerHTML);
      }
    }
  },

  undo: () => {
    const { history, currentIndex } = get();
    if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        html: history[currentIndex - 1],
        canUndo: currentIndex - 1 > 0,
        canRedo: true
      });
    }
  },

  redo: () => {
    const { history, currentIndex } = get();
    if (currentIndex < history.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        html: history[currentIndex + 1],
        canUndo: true,
        canRedo: currentIndex + 1 < history.length - 1
      });
    }
  }
}));
