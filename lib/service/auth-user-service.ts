// services/auth-user-service.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { AuthenticationUser } from "@/types/user";

export interface AuthUser {
    token: string;
    user: AuthenticationUser;
}

export async function getAuthUser(): Promise<AuthUser | null> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) return null;

    return {
        token: (session as any).accessToken || "",
        user: session.user as AuthenticationUser,
    };
}
