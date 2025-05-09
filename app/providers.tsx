// providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}