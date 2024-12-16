import { Switch, Route } from "wouter";
import Editor from "@/pages/Editor";
import Home from "@/pages/Home";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
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
