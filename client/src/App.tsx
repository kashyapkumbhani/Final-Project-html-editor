import React, { useEffect } from "react";
import { Switch, Route } from "wouter";
import Editor from "@/pages/Editor";
import Home from "@/pages/Home";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  useEffect(() => {
    // Theme initialization
    const root = document.documentElement;
    const theme = localStorage.getItem('theme');
    
    if (theme) {
      root.classList.add(theme);
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = isDark ? 'dark' : 'light';
      root.classList.add(initialTheme);
      localStorage.setItem('theme', initialTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
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
