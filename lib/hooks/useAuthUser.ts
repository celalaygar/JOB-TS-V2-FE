// hooks/useAuthUser.ts

"use client"

import { useSession } from "next-auth/react"
import { AuthenticationUser, UserDto } from "@/types/user"

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

// Session'ı güncellemek için güncellenmiş fonksiyon
// Session'ı güncellemek için güncellenmiş fonksiyon
export function useUpdateAuthUser() {
    const { data: session, update } = useSession();

    const updateAuthUser = async (userDto: UserDto) => {
        if (!session) {
            console.error("Session is not available for update.");
            return;
        }

        // `update` fonksiyonu için, `session` objesinin yapısına uygun bir nesne oluşturun.
        // userDto'dan gelen verileri session.user'a doğru şekilde yerleştirin.
        // `AuthenticationUser` tanımınıza göre diğer alanları da ekleyin.
        const updatedUser: AuthenticationUser = {
            ...session.user, // Mevcut session.user verilerini koru
            id: userDto.id || session?.user?.id,
            username: userDto.username,
            firstname: userDto.firstname,
            lastname: userDto.lastname,
            phone: userDto.phone,
            dateOfBirth: userDto.dateOfBirth,
            gender: userDto.gender,
            position: userDto.position,
            department: userDto.department,
            company: userDto.company,
            // name: `${userDto.firstname} ${userDto.lastname}`, // NextAuth name alanını güncelleyebilirsiniz.
        };
        // `update` fonksiyonu, oturumun tamamını güncelleyecektir.
        // Token gibi diğer hassas bilgileri elle değiştirmemeniz gerekir.
        // NextAuth, `user` nesnesini güncelleyerek session'ı yeniden oluşturacaktır.
        await update({ user: updatedUser });
    };

    return updateAuthUser;
}


// ✅ Yeni export: Token güncelleme fonksiyonu
export function useUpdateAuthToken() {
    const { update } = useSession()

    const updateAuthToken = async (newToken: string) => {
        if (!newToken) {
            console.error("Yeni token boş geldi, güncellenemiyor.")
            return
        }
        await update({
            accessToken: newToken, // ✅ jwt callback’te yakalanacak
        })
    }

    return updateAuthToken
}