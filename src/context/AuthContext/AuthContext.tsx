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
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("auth_user");
            return savedUser ? JSON.parse(savedUser) : null;
        }
        return null;
    });

    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/me", {
                    method: "GET",
                    cache: "no-store",
                    credentials: "include",
                });
                if (!res.ok) {
                    setUser(null);
                    localStorage.removeItem("auth_user");
                    return;
                }
                const data = await res.json();
                const userData = data.userDetail.data;
                setUser(userData);
                localStorage.setItem("auth_user", JSON.stringify(userData));
            } catch (err) {
                console.log(err);
                setUser(null);
                localStorage.removeItem("auth_user");
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
