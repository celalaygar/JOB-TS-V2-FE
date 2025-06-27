// src/lib/service/data-fetch-service.ts

import BaseService from "./BaseService";
import { httpMethods } from "./HttpService";
import { GET_PROJECT_USERS, SPRINT_NON_COMPLETED_GET_ALL_URL, PROJECT_URL } from "./BasePath";
import { ProjectUser } from "@/types/project";
import { Sprint } from "@/types/sprint";
import { Project } from "@/types/project";

/**
 * Belirli bir proje için proje kullanıcılarını (atanabilir kullanıcılar) getirir.
 * @param projectId - Kullanıcıları getirilecek projenin ID'si.
 * @returns ProjectUser[] dizisi veya hata durumunda Promise.reject.
 */
export async function fetchProjectUsers(projectId: string): Promise<ProjectUser[]> {
    if (!projectId) {
        console.warn("fetchProjectUsers: projectId provided is empty.");
        return [];
    }
    try {
        const response: ProjectUser[] = await BaseService.request(`${GET_PROJECT_USERS}/${projectId}`, {
            method: httpMethods.GET,
        });
        return response;
    } catch (error) {
        console.error('DataFetchService: Failed to fetch project users:', error);
        throw error; // Hatanın çağıran bileşen tarafından ele alınmasını sağlamak için yeniden fırlat
    }
}

/**
 * Belirli bir proje için tamamlanmamış (non-completed) sprintleri getirir.
 * @param projectId - Sprintleri getirilecek projenin ID'si.
 * @returns Sprint[] dizisi veya hata durumunda Promise.reject.
 */
export async function fetchSprints(projectId: string): Promise<Sprint[]> {
    if (!projectId) {
        console.warn("fetchSprints: projectId provided is empty.");
        return [];
    }
    try {
        const response: Sprint[] = await BaseService.request(`${SPRINT_NON_COMPLETED_GET_ALL_URL}/${projectId}`, {
            method: httpMethods.GET,
        });
        return response;
    } catch (error) {
        console.error("DataFetchService: Failed to fetch sprints:", error);
        throw error; // Hatanın çağıran bileşen tarafından ele alınmasını sağlamak için yeniden fırlat
    }
}

/**
 * Tüm projeleri getirir. (Eğer diğer sayfalarda da kullanılıyorsa bu da buraya eklenebilir)
 * @returns Project[] dizisi veya hata durumunda Promise.reject.
 */
export async function fetchAllProjects(): Promise<Project[]> {
    try {
        const response: Project[] = await BaseService.request(PROJECT_URL, {
            method: httpMethods.GET,
        });
        return response;
    } catch (error) {
        console.error("DataFetchService: Failed to fetch all projects:", error);
        throw error;
    }
}

// Not: formData ile proje kaydetme (saveTask içindeki) aslında bir Task değil, Project kaydetme gibi görünüyor.
// Eğer bu da başka yerlerde kullanılıyorsa, onu da buraya taşıyabilirsiniz.
// export async function saveProjectService(projectData: any): Promise<Project> {
//     try {
//         const response: Project = await BaseService.request(PROJECT_URL, {
//             method: httpMethods.POST,
//             body: projectData,
//         });
//         return response;
//     } catch (error) {
//         console.error("DataFetchService: Failed to save project:", error);
//         throw error;
//     }
// }