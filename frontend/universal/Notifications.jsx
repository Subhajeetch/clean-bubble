"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/AuthStore/userStore";
import { useNotification } from "@/context/NotificationsContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

//backend URL
import cred from "@/mine.config"

// formate date by chat GPT
function formatNotifDate(ms) {
    const date = new Date(ms);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear().toString().slice(-2);

    return `${day} ${month}, ${year}`;
}

// Group notifications by date label
function groupNotificationsByDate(notifications) {
    return notifications.reduce((groups, notif) => {
        const label = formatNotifDate(notif.createdAt);
        if (!groups[label]) groups[label] = [];
        groups[label].push(notif);
        return groups;
    }, {});
}

const Notifications = () => {
    const { isNotificationOpen, closeNotification, setNotificationState } = useNotification();
    const { user, isLoading } = useAuthStore();
    const [marking, setMarking] = useState({});

    const handleNotificationToggle = (open) => {
        setNotificationState(open);
    };

    const handleMarkAsRead = async (notifId) => {
        setMarking((prev) => ({ ...prev, [notifId]: true }));
        try {

            await axios.post(`${cred.backendURL}/api/notifs/mark-read`, { id: notifId }, { withCredentials: true });
            toast.success("Marked as read!");
            if (user && user.notifications) {
                const idx = user.notifications.findIndex(n => n._id === notifId);
                if (idx !== -1) user.notifications[idx].isRead = true;
            }
        } catch (e) {
            console.log(e)
            toast.error("Failed to mark as read.");
        }
        setMarking((prev) => ({ ...prev, [notifId]: false }));
    };

    let grouped = {};
    let sortedLabels = [];
    if (user?.notifications?.length) {
        // Sort notifications by createdAt descending
        const sorted = [...user.notifications].sort((a, b) => b.createdAt - a.createdAt);
        grouped = groupNotificationsByDate(sorted);
        // Sort date labels: Today, Yesterday, then others descending
        sortedLabels = Object.keys(grouped).sort((a, b) => {
            if (a === "Today") return -1;
            if (b === "Today") return 1;
            if (a === "Yesterday") return -1;
            if (b === "Yesterday") return 1;
            // Parse "23 June, 25" to Date for sorting
            const parse = (label) => {
                if (label === "Today" || label === "Yesterday") return new Date();
                const [day, month, year] = label.replace(",", "").split(" ");
                return new Date(`20${year}-${month}-` + day);
            };
            return parse(b) - parse(a);
        });
    }

    return (
        <Sheet open={isNotificationOpen} onOpenChange={handleNotificationToggle}>
            <SheetTrigger />
            <SheetContent onEscapeKeyDown={closeNotification}>
                <SheetHeader>
                    <SheetTitle className="text-xl">Notifications</SheetTitle>
                    <SheetDescription />
                </SheetHeader>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="overflow-y-auto max-h-full px-1">
                        {(!user?.notifications || user.notifications.length === 0) && (
                            <div className="text-center text-muted-foreground py-8">No notifications.</div>
                        )}
                        {sortedLabels.map(label => (
                            <div key={label} className="mb-4">
                                <div className="font-bold text-base mb-2">{label}</div>
                                <div className="flex flex-col gap-2">
                                    {grouped[label].map(notif => (
                                        <div
                                            key={notif._id}
                                            className={`rounded-md p-3 border flex flex-col gap-1 transition-colors ${notif.isRead
                                                ? "bg-background"
                                                : "bg-muted"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">{notif.title}</span>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </div>

                                            </div>
                                            <div className="text-sm">{notif.message}</div>

                                            <div className="flex gap-3 items-center mt-3">



                                                {!notif.isRead && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={marking[notif._id]}
                                                        onClick={() => handleMarkAsRead(notif._id)}
                                                    >
                                                        {marking[notif._id] ? "Marking..." : "Mark as read"}
                                                    </Button>
                                                )}

                                                {notif.redirectUrl && (
                                                    <a
                                                        href={notif.redirectUrl}
                                                        className="text-xs text-blue-500 hover:underline mt-1"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Details
                                                    </a>
                                                )}

                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default Notifications;