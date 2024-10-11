import TrainerSidebar from "./TrainerSidebar";
import { Outlet } from "react-router-dom";

function TrainerLayout() {
  return (
    <div className="flex h-screen">
      <TrainerSidebar />
      <div className="flex-1 overflow-auto p-6 bg-slate-100">
        <Outlet />
      </div>
    </div>
  );
}

export default TrainerLayout;
