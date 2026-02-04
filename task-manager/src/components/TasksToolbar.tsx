"use client";
import { Plus } from "lucide-react";

interface ToolbarProps {
  onSearch: (q: string) => void;
  onFilter: (s: string) => void;
  onCreate: () => void; // New Prop for Create Modal
}

export default function TasksToolbar({ onSearch, onFilter, onCreate }: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex gap-4 w-full sm:w-auto flex-1">
        <input
          placeholder="Search tasks..."
          className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => onSearch(e.target.value)}
        />
       <select className="border px-4 py-2 rounded-md" onChange={(e) => onFilter(e.target.value)}>
  <option value="">All</option>
  <option value="PENDING">Pending</option>
  <option value="IN_PROGRESS">In Progress</option>
  <option value="COMPLETED">Completed</option>
</select>
      </div>

      <button 
        onClick={onCreate}
        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <Plus size={18} /> Create Task
      </button>
    </div>
  );
}