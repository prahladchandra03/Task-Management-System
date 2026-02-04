import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Task } from "@/types/task"; // Ensure Task type exists in types/index.ts

export function useTasks(searchQuery: string, statusFilter: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch tasks (accepts query params like '?search=xyz')
  const fetchTasks = useCallback(async (query = "") => {
    try {
      setLoading(true);
      const { data } = await api.get(`/tasks${query}`);
      setTasks(data);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (statusFilter) {
      params.append("status", statusFilter);
    }
    const query = params.toString();
    fetchTasks(query ? `?${query}` : "");
  }, [searchQuery, statusFilter, fetchTasks]);

  return { tasks, loading, fetchTasks };
}