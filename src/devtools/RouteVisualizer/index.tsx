import { HTML5Backend } from "react-dnd-html5-backend";
import { Flowchart } from "./components/Flowchart";
import { Toolbar } from "@/components/ui/toolbar/Toolbar";
import { PropertyPanel } from "./components/PropertyPanel";
import { WireframeEditor } from "./components/WireframeEditor";
import { DndProvider } from "react-dnd";

export const RouteVisualizer = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-background">
        <div className="w-16 border-r">
          <Toolbar />
        </div>
        <div className="flex-1 flex">
          <div className="flex-1">
            <Flowchart />
          </div>
          <div className="w-80 border-l">
            <PropertyPanel />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
