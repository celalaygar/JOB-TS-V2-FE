
import { ProjectTaskPriority } from "@/types/task";

/**
 * Görev önceliğine göre Tailwind CSS class'ı döndürür.
 * @param priority Görev önceliği (ProjectTaskPriority)
 * @returns Öncelik için Tailwind CSS class adı
 */
export const getPriorityClassName = (priority: ProjectTaskPriority): string => {
    switch (priority) {
        case ProjectTaskPriority.CRITICAL:
            return "bg-[var(--fixed-danger)] text-white";
        case ProjectTaskPriority.HIGH:
            return "bg-[var(--fixed-warning)] text-white";
        case ProjectTaskPriority.MEDIUM:
            return "bg-[var(--fixed-primary)] text-white";
        case ProjectTaskPriority.LOW:
            return "bg-[var(--fixed-success)] text-white";
        default:
            return "bg-[var(--fixed-secondary)] text-bold";
    }
};