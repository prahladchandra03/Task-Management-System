"use client";

import { Task } from "@/types/task"; // Path check kar lein
import TaskCard from "./TaskCard";

interface TasksListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TasksList({ tasks, loading, onToggle, onDelete, onEdit }: TasksListProps) {
  if (loading) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center py-10 text-gray-500">No tasks found. Create one!</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}