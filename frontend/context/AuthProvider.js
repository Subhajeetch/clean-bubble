"use client";
import { useEffect } from "react";
import useAuthStore from "@/AuthStore/userStore";
import axios from "axios";

import cred from "@/mine.config"

export default function AuthProvider({ children }) {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        if (!localStorage.getItem("KKXXCHECK")) {
            setLoading(false)
            return;
        }

        const fetchUser = async () => {
            setLoading(true); // Start loading

            try {
                const response = await axios.get(`${cred.backendURL}/api/auth/get/user`, {
                    withCredentials: true
                });

                // console.log(response)

                if (response.data.success) {
                    setUser(response.data.user);
                    setLoading(false);
                }

                localStorage.setItem("KKXXCHECK", true)

            } catch (error) {
                console.error("Error fetching user:", error);
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return children;
}