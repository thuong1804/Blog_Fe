// context/AuthContext.tsx
"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    avatarPublicId: string;
    description: string;
    handle: string;
    provider: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // NOTE: user profile is kept in memory only (never in localStorage),
        // so a stored-XSS payload cannot steal PII from disk. It is
        // re-fetched from the httpOnly-cookie session on every page load.
        async function fetchUser() {
            try {
                const res = await fetch("/api/me", {
                    method: "GET",
                    cache: "no-store",
                    credentials: "include",
                });
                if (!res.ok) {
                    setUser(null);
                    return;
                }
                const data = await res.json();
                const userData = data.userDetail?.data ?? null;
                setUser(userData);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
