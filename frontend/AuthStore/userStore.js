import { create } from "zustand";
import axios from "axios";
import cred from "@/mine.config"

const useAuthStore = create(set => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    setUser: userData =>
        set({ user: userData, isAuthenticated: true, isLoading: false }),

    setLoading: loading => set({ isLoading: loading }),

    logout: async () => {
        try {
            await axios.post(
                `${cred.backendURL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );

            localStorage.removeItem("KKXXCHECK");
            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
}));

export default useAuthStore;
