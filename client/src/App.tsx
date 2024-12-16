import { useEffect } from "react";
import { Switch, Route } from "wouter";
import Editor from "@/pages/Editor";
import Home from "@/pages/Home";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  useEffect(() => {
    // Theme initialization
    const theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/editor" component={Editor} />
      </Switch>
    </DndProvider>
  );
}

export default App;
