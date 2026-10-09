// context/AuthContext.tsx
"use client";

import {
    createContext,
    useCallback,
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
    /** Re-fetch the session (call after login/logout without reload). */
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        setLoading(true);
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
            const data = await res.json().catch(() => null);
            const userData = data?.userDetail?.data ?? null;
            setUser(userData);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
