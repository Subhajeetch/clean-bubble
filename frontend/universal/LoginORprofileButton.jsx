"use client"

import Link from "next/link";
import { UserRoundPen, Bell, Package, LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import "./styleForLogOutLoading.css"

// dialog
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog"

// popover
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// login and signup
import AuthSection from "@/components/auth/LoginSignup";

import useAuthStore from "@/AuthStore/userStore";


// login tabs provider
import { useLogin } from "@/context/LoginContext";

// notification
import { useNotification } from "@/context/NotificationsContext";



export default function LoginORprofileButton() {
    // context
    const { isLoginOpen, closeLogin, setLoginState } = useLogin();

    const [popoverOpen, setPopoverOpen] = useState(false);

    const { user, logout, isAuthenticated, setLoading, isLoading } = useAuthStore();
    const { setNotificationState, unreadNotifications, haveUnreadNotifications } = useNotification();

    const router = useRouter();

    const handleLogout = async () => {
        try {
            setLoading(true);
            logout();
            router.push("/");
            toast.success(
                "Successfully logged out!"
            );
        } catch (e) {
            console.log(e.message);
        }
    };


    // toggle login dialog
    const handleLoginOpen = (open) => {
        setLoginState(open);
    };

    // open notifiacton sheet
    const handleNotificationOpen = () => {
        setNotificationState(true)
    }


    const hh = () => {
        console.log(user)
    }


    return (
        isLoading ? (
            <div className="h-8 w-8 flex justify-center items-center">
                <svg className='idkgg' viewBox='25 25 50 50'>
                    <circle
                        className='gayxx'
                        r='20'
                        cy='50'
                        cx='50'
                    ></circle>
                </svg>
            </div>
        ) : user && isAuthenticated ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger>
                    <div className="h-8 w-8 rounded-full bg-[#321069] flex justify-center items-center relative">
                        <span className="font-semibold">{user.fullName.charAt(0).toUpperCase()}</span>
                        {haveUnreadNotifications && (
                            <span className="h-2 w-2 rounded-full bg-red-700 absolute bottom-0 left-0"></span>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-3 mr-2 p-2 pb-4">
                    <div className="flex gap-2 p-2">
                        <div className="h-12 w-12 rounded-full bg-[#321069] flex justify-center items-center" onClick={hh}><span className="text-2xl font-semibold">{user.fullName.charAt(0).toUpperCase()}</span></div>
                        <div className="flex flex-col max-w-[180px]">
                            <span className="font-semibold truncate">{user.fullName}</span>
                            <span className="text-xs text-dimmer-foreground truncate">{user.email}</span>
                        </div>
                    </div>

                    <div className="bg-muted h-1 rounded-full mx-4"></div>

                    <div className="flex flex-col gap-2">
                        <Link className="px-6 py-4 rounded-full bg-background flex gap-3 hover:bg-dimmer-background" href="/profile" onClick={() => setPopoverOpen(false)}>
                            <UserRoundPen /> Profile
                        </Link>

                        <div className="px-6 py-4 rounded-full bg-background flex gap-3 hover:bg-dimmer-background" onClick={handleNotificationOpen}>
                            <span className="relative">
                                <Bell />
                                {haveUnreadNotifications && (
                                    <span className="absolute top-[-7px] right-[-4px] h-5 w-5  bg-amber-400 rounded-full p-1 text-xs flex items-center justify-center font-semibold">
                                        {unreadNotifications}
                                    </span>
                                )}

                            </span>
                            Notifications
                        </div>

                        <Link className="px-6 py-4 rounded-full bg-background flex gap-3 hover:bg-dimmer-background" href="/profile?tab=orders" onClick={() => setPopoverOpen(false)}>
                            <Package />
                            Orders
                        </Link>

                        <div
                            onClick={handleLogout}
                            className="px-6 py-4 rounded-full bg-background flex justify-between text-red-500 hover:bg-dimmer-background">
                            <span className="flex gap-3"><LogOut />Log Out</span>
                            {isLoading && (
                                <div>
                                    <svg className='idkgg' viewBox='25 25 50 50'>
                                        <circle
                                            className='gayxx'
                                            r='20'
                                            cy='50'
                                            cx='50'
                                        ></circle>
                                    </svg>
                                </div>
                            )}

                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        ) : (
            <Dialog open={isLoginOpen} onOpenChange={handleLoginOpen}>
                <DialogTrigger className='bg-foreground text-background px-2.5 py-1 justify-center items-center font-[700] rounded-lg cursor-pointer'>
                    Login
                </DialogTrigger>
                <DialogContent onEscapeKeyDown={closeLogin}>
                    <AuthSection />
                </DialogContent>
            </Dialog>
        )
    )
}
