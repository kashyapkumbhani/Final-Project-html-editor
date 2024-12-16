import { hydrate } from 'react-dom';
import { Router } from 'wouter';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

hydrate(
  <Router>
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </QueryClientProvider>
  </Router>,
  document.getElementById('root')
);
