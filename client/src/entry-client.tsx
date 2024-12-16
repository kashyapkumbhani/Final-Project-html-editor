import { hydrate } from 'react-dom';
import { Router } from 'wouter';
import App from './App';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Create a client-side QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

// Get the dehydrated state from the server
const dehydratedState = (window as any).__REACT_QUERY_STATE__;

hydrate(
  <Router>
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </Hydrate>
    </QueryClientProvider>
  </Router>,
  document.getElementById('root')
);
