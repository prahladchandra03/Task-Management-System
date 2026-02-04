"use client";
import { useState } from "react";
import TasksToolbar from "@/components/TasksToolbar"; // ✅ Naya Toolbar
import TasksList from "@/components/TasksList";     // ✅ Naya Table
import { useTasks } from "@/hooks/useTasks";          // ✅ Hook direct yahan use hoga
import api from "@/lib/api";
import { toast } from "sonner";
import { Task } from "@/types/task";

export default function Dashboard() {
  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 2. Hook call with Search/Filter params
  // (Ensure karein ki aapka useTasks hook ye arguments accept kare)
  const { tasks, loading, fetchTasks } = useTasks(searchQuery, statusFilter);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({ title: "", description: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal with Data
  // (Ise hum Table mein pass karenge)
  const openEditModal = (task: Task) => {
    setFormData({ title: task.title, description: task.description || "" });
    setCurrentTaskId(task.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentTaskId) {
        // --- UPDATE ---
        await api.patch(`/tasks/${currentTaskId}`, formData);
        toast.success("Task updated successfully!");
      } else {
        // --- CREATE ---
        await api.post('/tasks', formData);
        toast.success("Task created successfully!");
      }

      // Cleanup & Refresh
      setIsModalOpen(false);
      fetchTasks(); // ✅ List ko refresh karein
    } catch (error: any) {
      console.error(error);
      toast.error(isEditing ? "Failed to update" : "Failed to create task");
    }
  };

  const handleToggle = async (id: string, status: Task["status"]) => {
    try {
      await api.patch(`/tasks/${id}`, { status });
      toast.success("Task status updated!");
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task status");
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully!");
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your daily tasks efficiently.</p>
        </div>

        {/* 1. Toolbar (Search & Filter) */}
        <TasksToolbar 
          onSearch={setSearchQuery} 
          onFilter={setStatusFilter} 
          onCreate={openCreateModal} 
        />

        {/* 2. Table (Data Display) */}
        <TasksList 
          tasks={tasks} 
          loading={loading} 
          onEdit={openEditModal}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>

      {/* --- MODAL (Same as before) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Task" : "New Task"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  required 
                  placeholder="What needs to be done?"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  placeholder="Add details..."
                  className="w-full p-2 border rounded resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition font-medium"
                >
                  {isEditing ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}