'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import useAuthStore from "@/AuthStore/userStore";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user, isLoading } = useAuthStore();
    const [isNotificationOpen, setNotificationOpen] = useState(false);

    const openNotification = () => setNotificationOpen(true);
    const closeNotification = () => setNotificationOpen(false);
    const setNotificationState = (val) => setNotificationOpen(val);

    // Calculate unread notifications safely
    const unreadNotifications = Array.isArray(user?.notifications)
        ? user.notifications.filter(n => !n.isRead).length
        : 0;

    const haveUnreadNotifications = unreadNotifications > 0;

    return (
        <NotificationContext.Provider
            value={{
                isNotificationOpen,
                openNotification,
                closeNotification,
                setNotificationState,
                unreadNotifications,
                haveUnreadNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);