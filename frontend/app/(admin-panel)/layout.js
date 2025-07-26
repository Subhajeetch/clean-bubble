"use client";

import AdminNavBar from "./adminNavBar";
import useAuthStore from "@/AuthStore/userStore";
import Loader from "./Loader";

// Error component
const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
                Error 404
            </h2>
            <p className="text-gray-600 mb-4 max-w-md">
                Page not found
            </p>
        </div>
    </div>
);

export default function WithAdminNavBar({ children }) {
    const { user, isLoading } = useAuthStore();

    if (isLoading) {
        return <Loader />;
    }

    if (!user || user.accountType !== "admin") {
        return (
            <main className="min-h-fit max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
                <ErrorDisplay />
            </main>
        );
    }

    return (
        <main className="min-h-fit max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <AdminNavBar />
            {children}
        </main>
    );
}
