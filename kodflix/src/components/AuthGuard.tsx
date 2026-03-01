"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const publicRoutes = ['/login', '/register'];
        const isPublicRoute = publicRoutes.includes(pathname);

        // This runs only on the client because it wraps the app
        const token = localStorage.getItem('kodflix_token');
        const username = localStorage.getItem('kodflix_username');

        if (!token || !username) {
            // Not logged in
            if (!isPublicRoute) {
                router.replace('/login');
            } else {
                setIsAuthorized(true);
            }
        } else {
            // Logged in
            if (isPublicRoute) {
                // If they go to /login but are already authenticated, redirect home
                router.replace('/');
            } else {
                setIsAuthorized(true);
            }
        }
    }, [pathname, router]);

    // Prevent flashing protected content before redirect
    if (!isAuthorized) {
        return <div className="min-h-screen bg-[#141414]" />;
    }

    return <>{children}</>;
}
