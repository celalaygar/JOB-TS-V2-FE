import { Bug, Lightbulb, BookOpen, GitBranch, LucideIcon } from "lucide-react";
import { ProjectTaskType, type TaskType } from "@/types/task";

/**
 * Görev tipine göre ilgili Lucide ikon bileşenini döndürür.
 * @param taskType Görev tipi (ProjectTaskType veya TaskType)
 * @returns İlgili ikon bileşeni veya null
 */
export const getTaskTypeIcon = (taskType: ProjectTaskType | TaskType): LucideIcon => {
    switch (taskType) {
        case ProjectTaskType.BUG:
        case "bug":
            return Bug;
        case ProjectTaskType.FEATURE:
        case "feature":
            return Lightbulb;
        case ProjectTaskType.STORY:
        case "story":
            return BookOpen;
        case ProjectTaskType.SUBTASK:
        case "subtask":
            return GitBranch;
        default:
            return Bug;
    }
};

/**
 * Görev tipine göre Tailwind CSS class'ı döndürür.
 * @param taskType Görev tipi (ProjectTaskType veya TaskType)
 * @returns İlgili ikon için Tailwind CSS class adı
 */
export const getTaskTypeIconClassName = (taskType: ProjectTaskType | TaskType): string => {
    switch (taskType) {
        case ProjectTaskType.BUG:
        case "bug":
            return "text-red-500";
        case ProjectTaskType.FEATURE:
        case "feature":
            return "text-blue-500";
        case ProjectTaskType.STORY:
        case "story":
            return "text-purple-500";
        case ProjectTaskType.SUBTASK:
        case "subtask":
            return "text-gray-500";
        default:
            return "text-blue-500"; // Varsayılan renk
    }
};





/**
 * Görev tipine göre badge (rozet) için Tailwind CSS arka plan rengi döndürür.
 * @param taskType Görev tipi (ProjectTaskType)
 * @returns İlgili badge için Tailwind CSS class adı
 */
export const getTaskTypeBadgeColor = (taskType: ProjectTaskType): string => {
    switch (taskType) {
        case ProjectTaskType.BUG:
            return "bg-red-500";
        case ProjectTaskType.FEATURE:
            return "bg-green-500";
        case ProjectTaskType.STORY:
            return "bg-blue-500";
        case ProjectTaskType.SUBTASK:
            return "bg-purple-500";
        default:
            return "bg-slate-500";
    }
};


export const getTypeColor = (taskType: ProjectTaskType): string => {
    switch (taskType) {
        case ProjectTaskType.BUG:
            return "bg-red-100 text-red-800 border-red-200"
        case ProjectTaskType.FEATURE:
            return "bg-blue-100 text-blue-800 border-blue-200"
        case ProjectTaskType.STORY:
            return "bg-purple-100 text-purple-800 border-purple-200"
        case ProjectTaskType.SUBTASK:
            return "bg-gray-100 text-gray-800 border-gray-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}