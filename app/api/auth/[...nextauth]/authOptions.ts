// authOptions.ts


import { AuthOptions, User as NextAuthUser, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { AuthenticationUser } from "@/types/user";

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken: string;
    }
}

export interface AuthUser extends NextAuthUser {
    token: string;
    user: AuthenticationUser;
}


const URL = process.env.BASE_URL || "";



export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("Credentials are missing");
                }
                try {
                    const response = await axios.post(URL + "auth/login", {
                        email: credentials?.email,
                        password: credentials?.password
                    });

                    if (response.status === 200) {
                        const { token, user } = response.data;

                        // ✅ NextAuth'un beklediği tipte bir `User` nesnesi döndürülüyor
                        const nextAuthUser: AuthUser = {
                            id: user.id.toString(), // ❗ `id` zorunlu
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            token: token,
                            user: user as AuthenticationUser
                        };

                        return nextAuthUser;
                    }
                } catch (error) {
                    throw new Error("Invalid credentials " + error);
                }
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // 1. Yeni giriş (sign-in)
            if (user && "token" in user) {
                token.accessToken = user.token
                token.user = (user as AuthUser).user
            }

            // 2. Session güncelleme (update)
            if (trigger === "update") {
                if (session?.user) {
                    token.user = { ...token.user, ...session.user }
                }
                if (session?.accessToken) {
                    token.accessToken = session.accessToken as string
                }
            }

            return token
        },
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user as AuthenticationUser
                session.accessToken = token.accessToken as string
            }
            return session
        },
    },
    secret: process.env.SECRET_KEY,
    pages: {
        signIn: "/auth/login",
    }
};