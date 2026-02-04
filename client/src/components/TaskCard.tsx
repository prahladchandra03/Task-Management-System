"use client";
import { Task } from "@/types/task"; // Status agar use nahi ho raha to hata dein
import { CheckCircle, Circle, Trash2, Edit, Clock } from "lucide-react";

// Props define karein
interface TaskCardProps {
  task: Task;
  onToggle: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

// 'any' hata kar 'TaskCardProps' use karein
export default function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {

  const getNextStatus = (status: Task['status']) => {
    if (status === 'PENDING') return 'IN_PROGRESS';
    if (status === 'IN_PROGRESS') return 'COMPLETED';
    return 'PENDING';
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
           <h3 className={`font-bold ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>
             {task.title}
           </h3>
           <p className="text-sm text-gray-500 mt-1">{task.description}</p>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4 items-center">
        {/* Toggle Status Button with Icons */}
        <button 
          onClick={() => onToggle(task.id, getNextStatus(task.status))}
          className={`text-xs flex items-center gap-1 px-2 py-1 rounded border ${
            task.status === 'COMPLETED' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : task.status === 'IN_PROGRESS'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
          }`}
        >
          {task.status === 'COMPLETED' ? <CheckCircle size={14} /> : task.status === 'IN_PROGRESS' ? <Clock size={14} /> : <Circle size={14} />}
          {task.status}
        </button>
        
        <div className="flex gap-2 ml-auto">
            {/* Edit Button */}
            <button 
              onClick={() => onEdit(task)} 
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
            >
              <Edit size={14} /> Edit
            </button>

            {/* Delete Button */}
            <button 
              onClick={() => onDelete(task.id)} 
              className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete
            </button>
        </div>
      </div>
    </div>
  );
}