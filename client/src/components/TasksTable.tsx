"use client";

import api from "@/lib/api"; // ✅ CHANGE 1: 'axios' ki jagah 'api' import karein
import { CheckCircle, Circle, Trash2, Loader2, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
}

interface Props {
  tasks: Task[];
  loading: boolean;
  refresh: () => void;
  onEdit: (task: Task) => void;
}

export default function TasksTable({ tasks, loading, refresh, onEdit }: Props) {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --- TOGGLE STATUS ---
  const handleToggle = async (id: string) => {
    try {
      setTogglingId(id);
      // ✅ CHANGE 2: '/api' hataya aur 'api.patch' use kiya
      // Kyunki aapke api instance me baseURL already set hoga
      await api.patch(`/tasks/${id}/toggle`); 
      
      toast.success("Status updated");
      refresh(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // --- DELETE TASK ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      setDeletingId(id);
      // ✅ CHANGE 3: 'api.delete' use kiya
      await api.delete(`/tasks/${id}`);
      
      toast.success("Task deleted");
      refresh();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
        <span className="ml-2 text-gray-500">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                
                {/* Title */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-xs text-gray-400 truncate max-w-[200px]">{task.description}</span>
                    )}
                  </div>
                </td>

                {/* Status Button */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(task.id)}
                    disabled={togglingId === task.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                      task.status === "COMPLETED"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                    }`}
                  >
                    {togglingId === task.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : task.status === "COMPLETED" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Circle size={14} />
                    )}
                    {togglingId === task.id ? "Updating..." : task.status}
                  </button>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(task)} 
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                    >
                      {deletingId === task.id ? (
                        <Loader2 size={18} className="animate-spin text-red-600" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}