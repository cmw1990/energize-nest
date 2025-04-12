
import { Task } from "@/types/database";
import { DbTask } from "@/integrations/supabase/schema";
import { assertType } from "@/utils/typeUtils";

/**
 * Convert database priority string to Task priority type
 */
export function convertPriority(priority: string): "high" | "medium" | "low" {
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priority as "high" | "medium" | "low";
  }
  return "medium"; // Default fallback
}

/**
 * Convert database urgency string to Task urgency type
 */
export function convertUrgency(urgency: string): "urgent" | "normal" | "low" {
  if (urgency === "urgent" || urgency === "normal" || urgency === "low") {
    return urgency as "urgent" | "normal" | "low";
  }
  return "normal"; // Default fallback
}

/**
 * Convert database status string to Task status type
 */
export function convertStatus(status: string): "todo" | "in_progress" | "done" {
  if (status === "todo" || status === "in_progress" || status === "done") {
    return status as "todo" | "in_progress" | "done";
  }
  return "todo"; // Default fallback
}

/**
 * Adapt a database task to application Task type
 * Use assertType to prevent "excessively deep" type errors
 */
export function adaptTask(dbTask: any): Task {
  return assertType<Task>({
    id: dbTask.id,
    user_id: dbTask.user_id,
    title: dbTask.title,
    description: dbTask.description || "",
    priority: convertPriority(dbTask.priority),
    urgency: convertUrgency(dbTask.urgency || "normal"), // Add fallback
    status: convertStatus(dbTask.status),
    estimated_minutes: dbTask.estimated_minutes,
    actual_minutes: dbTask.actual_minutes,
    due_date: dbTask.due_date,
    created_at: dbTask.created_at,
    updated_at: dbTask.updated_at,
    tags: dbTask.tags || [],
    category: dbTask.category,
    cognitive_load_estimate: dbTask.cognitive_load_estimate,
    difficulty_level: dbTask.difficulty_level,
    energy_required: dbTask.energy_required,
    blocked_by: dbTask.blocked_by || [],
    blocking: dbTask.blocking || [],
    parent_task_id: dbTask.parent_task_id,
    completed_at: dbTask.completed_at
  });
}

/**
 * Adapt an array of database tasks to application Task type
 * Use assertType to prevent "excessively deep" type errors
 */
export function adaptTasks(dbTasks: any[]): Task[] {
  if (!Array.isArray(dbTasks)) return [];
  return dbTasks.map(task => adaptTask(task));
}

/**
 * Creates a database-ready task object from a Task
 * Used for type-safe inserts and updates to Supabase
 */
export function prepareTaskForDb(task: Partial<Task>): any {
  // Use a loose return type to avoid TypeScript errors with Supabase
  return {
    ...task,
    // Ensure these properties are always strings in the database
    priority: task.priority ? String(task.priority) : undefined,
    urgency: task.urgency ? String(task.urgency) : undefined,
    status: task.status ? String(task.status) : undefined
  };
}
