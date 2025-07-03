"use client";

import useAuthStore from "@/AuthStore/userStore";
import { Button } from "@/components/ui/button";
import {
    Cat,
    UserRoundPen,
    Bell,
    ShieldCheck,
    Trash2,
    Info
} from "lucide-react";
import { useLogin } from "@/context/LoginContext";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationsContext";

// backend url
import cred from "@/mine.config";

// sections
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import Link from "next/link";

const ProfilePage = () => {
    const { user, isLoading } = useAuthStore();
    const { openLogin } = useLogin();

    const { setNotificationState, unreadNotifications, haveUnreadNotifications } = useNotification();

    const [ordersTabLoading, setOrdersTabLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersFetched, setOrdersFetched] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    const initialTab = searchParams.get("tab") === "orders" ? "orders" : "profile";
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const urlTab = searchParams.get("tab");
        if (urlTab && urlTab !== activeTab) {
            setActiveTab(urlTab === "orders" ? "orders" : "profile");
        }
    }, [searchParams]);

    useEffect(() => {
        if (
            activeTab === "orders" &&
            !ordersFetched &&
            !ordersTabLoading
        ) {
            setOrdersTabLoading(true);


            axios.get(
                `${cred.backendURL}/api/get/orders`,
                { withCredentials: true }
            ).then(res => {
                setOrders(res.data.orders || []);
                setOrdersFetched(true);
            })
                .catch(() => setOrders([]))
                .finally(() => setOrdersTabLoading(false)
                )
        }
    }, [activeTab, ordersFetched, user]);


    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'ordered':
                return {
                    indicator: 'rgba(208, 255, 79, 1)',
                    background: 'rgba(202, 255, 55, 0.3)',
                };
            case 'confirmed':
                return {
                    indicator: 'rgba(79, 195, 247, 1)',
                    background: 'rgba(79, 195, 247, 0.3)',
                };
            case 'shipped':
                return {
                    indicator: 'rgba(255, 193, 7, 1)',
                    background: 'rgba(255, 193, 7, 0.3)',
                };
            case 'delivered':
                return {
                    indicator: 'rgba(76, 175, 80, 1)',
                    background: 'rgba(76, 175, 80, 0.3)',
                };
            case 'cancelled':
                return {
                    indicator: 'rgba(244, 67, 54, 1)',
                    background: 'rgba(244, 67, 54, 0.3)',
                };
            default:
                return {
                    indicator: '#ccc',
                    background: 'rgba(0,0,0,0.1)',
                };
        }
    };


    // for sorting orders
    function groupOrdersByDate(orders) {
        return orders.reduce((groups, order) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(order);
            return groups;
        }, {});
    }

    const groupedOrders = groupOrdersByDate(orders);
    const sortedDates = Object.keys(groupedOrders).sort((a, b) => {
        return new Date(b) - new Date(a);
    });


    // formate date by chat gpt
    function formatOrderDate(dateString) {
        // Try to parse the dateString as locale date
        let dateParts = dateString.split("/");
        let date;
        if (dateParts.length === 3) {
            if (parseInt(dateParts[0], 10) > 12) {
                date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            } else {
                date = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
            }
        } else {
            date = new Date(dateString);
        }

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


    // open notifiacton sheet
    const handleNotificationOpen = () => {
        setNotificationState(true)
    }


    if (isLoading) {
        return (
            <main className="min-h-screen flex justify-center items-center">

                <div className="flex justify-center items-center py-10 gap-3">
                    <svg className='idkgg' viewBox='25 25 50 50' width={48} height={48}>
                        <circle className='gayxx' r='20' cy='50' cx='50'></circle>
                    </svg>
                    <span className="text-lg">Loading...</span>
                </div>

            </main>
        )
    }

    if (!user && !isLoading) {
        return (
            <main className="h-screen p-4 rounded-md mb-8 flex flex-col items-center justify-center text-center">
                <Cat size={88} className="animate-shake-twice" />
                <h2 className="text-xl font-semibold">Please login to continue.</h2>
                <p className="text-sm text-muted-foreground">You need to be logged in to view or edit your profile.</p>
                <Button onClick={() => openLogin(true)} className="mt-4 font-bold">
                    Login
                </Button>
            </main>
        );
    }
    return (
        <main className="min-h-screen flex flex-col max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-18 h-18 bg-[#321069] rounded-full mb-4">
                    <span className="text-4xl font-semibold text-foreground">
                        {user?.fullName.charAt(0).toUpperCase() || "?"}
                    </span>
                </div>
                <div className="max-w-2/3">
                    <h1 className="text-2xl font-semibold truncate">{user?.fullName || "..."}</h1>
                    <p className="text-sm text-muted-foreground mb-2">{user?.email || "..."}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="">
                            <UserRoundPen className="mr-1" />
                            Edit Profile
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <EditProfile />
                    </DialogContent>
                </Dialog>

                <Button onClick={handleNotificationOpen}>
                    <span className="relative mr-1">
                        <Bell />
                        {haveUnreadNotifications && (
                            <span className="absolute top-[-8px] right-[-4px] h-4 w-4  bg-amber-400 rounded-full p-1 text-[10px] flex items-center justify-center font-semibold">
                                {unreadNotifications}
                            </span>
                        )}

                    </span>
                    Notifications
                </Button>
            </div>

            <Tabs
                defaultValue={initialTab}
                className="w-full mt-6"
                value={activeTab}
                onValueChange={value => {
                    setActiveTab(value);
                    router.replace(`?tab=${value}`, { scroll: false });
                }}
            >
                <TabsList className="w-full bg-background">
                    <TabsTrigger
                        value="profile"
                        className="data-[state=active]:border-b-foreground border-b-muted border-b-2 data-[state=active]:text-foreground data-[state=active]:font-bold"
                    >
                        Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="data-[state=active]:border-b-foreground border-b-muted border-b-2 data-[state=active]:text-foreground data-[state=active]:font-bold"
                    >
                        Orders
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="flex flex-col gap-8">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Contacts
                        </h2>
                        <div>
                            <p>
                                <span>Email:</span>   {user?.email}
                            </p>
                            <p>
                                <span>Phone:</span>  {user?.phone || "Not Added"}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">
                            Saved Address
                        </h2>
                        <div className="bg-muted p-2 rounded-md w-full max-w-[440px]">
                            {user?.shippingAddress && user?.shippingAddress.length > 0 && user?.shippingAddress[0].address ? (
                                <div>
                                    <p className="font-semibold mb-4">{user.shippingAddress[0].address}</p>
                                    <p>{user.shippingAddress[0].city}, {user.shippingAddress[0].state} {user.shippingAddress[0].zip}</p>
                                    <p>{user.shippingAddress[0].landmark}</p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No address saved.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            Danger
                        </h2>

                        <div className="flex flex-col gap-3">

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className=" w-fit">
                                        <ShieldCheck className="mr-1" />
                                        Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>

                                    <ChangePassword />

                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-fit bg-amber-700 text-black hover:bg-amber-800">
                                        <Trash2 className="mr-1" />
                                        Delete Account
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Your Account</DialogTitle>
                                        <DialogDescription className="flex items-center gap-2 text-red-500 justify-center">
                                            <Info />
                                            This action cannot be undone!!!
                                        </DialogDescription>
                                    </DialogHeader>
                                    {/* Add form or inputs for editing profile here */}
                                    <p className="text-sm text-muted-foreground">
                                        This feature is under development.
                                    </p>
                                </DialogContent>
                            </Dialog>

                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="orders">
                    {ordersTabLoading ? (
                        <div className="flex justify-center items-center py-10 gap-3">
                            <svg className='idkgg' viewBox='25 25 50 50' width={48} height={48}>
                                <circle className='gayxx' r='20' cy='50' cx='50'></circle>
                            </svg>
                            <span className="text-lg">Loading orders...</span>
                        </div>
                    ) : (
                        <div>

                            {orders.length === 0 ? (
                                <p className="text-muted-foreground">No orders found.</p>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {sortedDates.map(date => (
                                        <div key={date}>
                                            <p className="font-bold text-lg mb-2">{formatOrderDate(date)}</p>
                                            <div className="flex flex-col gap-2">
                                                {groupedOrders[date].map(order => {
                                                    const statusColors = getOrderStatusColor(order.status);
                                                    return (
                                                        <Link
                                                            href={`/order/${order._id}`}
                                                            key={order._id}
                                                            className="flex gap-3 hover:bg-muted rounded-md p-2 cursor-pointer"
                                                        >
                                                            <div className="h-26 w-26">
                                                                <img
                                                                    src={order.products[0].image}
                                                                    alt={order.products[0].name}
                                                                    className="h-full w-full rounded-md"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div
                                                                    className="flex gap-1.5 w-fit items-center p-0.5 px-3 rounded-full"
                                                                    style={{ backgroundColor: statusColors.background }}
                                                                >
                                                                    <div
                                                                        className="h-2 w-2 rounded-full"
                                                                        style={{ backgroundColor: statusColors.indicator }}
                                                                    ></div>
                                                                    <p className="text-xs">
                                                                        {order.status.toUpperCase()}
                                                                    </p>
                                                                </div>
                                                                <h3 className="text-xl font-semibold line-clamp-1">
                                                                    {order.products[0].name}
                                                                </h3>
                                                                <p className="text-[12px]">
                                                                    {order.products[0].size} x {order.products[0].quantity}
                                                                </p>
                                                                <p className="mt-2">₹{order.totalAmount} PKR</p>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    );
}

export default ProfilePage;