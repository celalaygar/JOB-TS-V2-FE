// hooks/useAuthUser.ts

"use client"

import { useSession } from "next-auth/react"
import { AuthenticationUser } from "@/types/user"

export interface AuthUser {
    token: string
    user: AuthenticationUser
}

export function useAuthUser(): AuthUser | null {
    const { data: session } = useSession()

    if (!session || !session.user) return null

    return {
        token: (session as any).accessToken || "",
        user: session.user as AuthenticationUser,
    }
}
