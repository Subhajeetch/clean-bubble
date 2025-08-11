"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import cred from "@/mine.config";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";

import { StarIcon, OutlineStarIcon } from "@/universal/Icons";

import { useEffect, useState, use } from "react";

const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
};

// from chat gpt
function formatDatefortabs(dateString) {
    const date = new Date(dateString);
    const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    const datePart = date.toLocaleDateString(undefined, options);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 to 12 for 12 AM

    // Pad minutes with leading zero if needed
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${datePart}  -  ${hours}:${minutesStr} ${ampm}`;
}

const copyToClipboard = (text, toastMsg) => {
    navigator.clipboard.writeText(text).then(() => {
        toast.success(toastMsg || "Copied to clipboard");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy");
    });
}


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

function groupByDate(items, getDate) {
    const groups = {};
    items.forEach(item => {
        const d = getDate(item);
        let label = formatDate(d);
        if (isToday(d)) label = "Today";
        else if (isYesterday(d)) label = "Yesterday";
        if (!groups[label]) groups[label] = [];
        groups[label].push(item);
    });
    return groups;
}

function TabSection({ items, sort, setSort, loading, type, handleDeleteNotification }) {
    let sorted = [...items];
    if (sort === "recent") sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (sort === "older") sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));


    const groups = groupByDate(sorted, item => new Date(item.createdAt || 0));

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <Button size="sm" variant={sort === "recent" ? "default" : "outline"} onClick={() => setSort("recent")}>Recent</Button>
                <Button size="sm" variant={sort === "older" ? "default" : "outline"} onClick={() => setSort("older")}>Older</Button>
            </div>
            {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : Object.keys(groups).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No {type}s found.</div>
            ) : (
                Object.entries(groups).map(([date, arr]) => (
                    <div key={date} className="mb-6">
                        <div className="font-semibold text-xl mb-2">{date}</div>
                        <div className="space-y-2">
                            {arr.map((item, idx) => (
                                <div key={item._id || idx} className="bg-muted rounded-lg border p-3 shadow-sm">
                                    {type === "notification" && (
                                        <>
                                            <div className="font-medium text-sm">{item.title}</div>
                                            <div className="text-xs text-muted-foreground">{item.message}</div>
                                            <div className="text-[10px] text-muted-foreground mt-1">{item.createdAt ? formatDatefortabs(item.createdAt) : ""}</div>
                                            {handleDeleteNotification && (
                                                <div className="text-xs text-blue-500 hover:underline mt-2">

                                                    <Dialog>
                                                        <DialogTrigger className="text-blue-500 hover:underline">Delete this notification</DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Are you sure?</DialogTitle>
                                                                <DialogDescription>
                                                                    This action cannot be undone. User cannot see this notification again.
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="flex flex-col mt-5 border-2 p-2 rounded-md bg-muted">
                                                                <div className="font-medium text-sm">{item.title}</div>
                                                                <div className="text-xs text-muted-foreground">{item.message}</div>
                                                                <div className="text-[10px] text-muted-foreground mt-1">{item.createdAt ? formatDatefortabs(item.createdAt) : ""}</div>
                                                            </div>

                                                            <div className="flex items-center gap-3 mt-6">

                                                                <DialogClose className="flex-1 border-2 rounded-md py-1.5">
                                                                    Cancel
                                                                </DialogClose>


                                                                <Button className="flex-1" variant="destructive" onClick={() => handleDeleteNotification(item._id)}>
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                </div>
                                            )}
                                        </>
                                    )}
                                    {type === "order" && (
                                        <>
                                            <div className="relative">
                                                <div
                                                    className="flex gap-1.5 w-fit items-center p-0.5 px-3 rounded-full"
                                                    style={{ backgroundColor: getOrderStatusColor(item.status).background }}
                                                >
                                                    <div
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: getOrderStatusColor(item.status).indicator }}
                                                    ></div>
                                                    <p className="text-xs">
                                                        {item.status.toUpperCase()}
                                                    </p>
                                                </div>
                                                <div className="font-medium text-sm">Order #{item._id.slice(-6).toUpperCase()}</div>
                                                <div className="text-xs text-muted-foreground">Total: Rs. {item.totalAmount || '-'}</div>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {item.createdAt ? formatDatefortabs(item.createdAt) : ""}
                                                </span>


                                                <div className="flex flex-col gap-1 mt-2">
                                                    <Link className="text-blue-500 hover:underline text-xs" href={`/admin/order/${item._id}`}>
                                                        Go to Order
                                                    </Link>

                                                    <span className="text-blue-500 hover:underline text-xs cursor-pointer" onClick={() => copyToClipboard(item._id, "Order ID copied to clipboard")}>
                                                        Copy Order ID
                                                    </span>

                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {type === "review" && (
                                        <>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>
                                                        {i < item.rating ? (
                                                            <StarIcon color="#facc15" size={18} />
                                                        ) : (
                                                            <OutlineStarIcon size={16} />
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="font-medium text-sm">{item.text || 'Review'}</div>

                                            <div className="text-xs text-muted-foreground">{item.comment || ''}</div>
                                            <div className="text-[10px] text-muted-foreground mt-1">{item.createdAt ? formatDatefortabs(item.createdAt) : ''}</div>

                                            <div className="flex flex-col gap-1 mt-2">
                                                <span className="text-blue-500 hover:underline text-xs cursor-pointer" onClick={() => copyToClipboard(item._id, "Review ID copied to clipboard")}>
                                                    Copy Review ID
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

const UserInfoPage = ({ params }) => {
    const { id } = use(params);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [dialog, setDialog] = useState(null);
    const [editData, setEditData] = useState({});
    const [tab, setTab] = useState("notifications");
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [notifSort, setNotifSort] = useState("recent");
    const [orderSort, setOrderSort] = useState("recent");
    const [reviewSort, setReviewSort] = useState("recent");
    const [loadingTabs, setLoadingTabs] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const res = await axios.get(`/api/fetch?url=${cred.backendURL}/api/admin/get/user/${id}`, { withCredentials: true });
                if (res.data.success) {
                    setUser(res.data.user);
                } else {
                    toast.error("Failed to load user data");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                toast.error("Error fetching user data");
            }
            setLoading(false);
        }
        fetchUser();
    }, [id]);

    useEffect(() => {
        async function fetchTabs() {
            setLoadingTabs(true);
            try {
                const res = await axios.get(`/api/fetch?url=${cred.backendURL}/api/admin/fetch/o-r/${id}`, { withCredentials: true });
                if (res.data.success) {
                    setOrders(res.data.orders || []);
                    setReviews(res.data.reviews || []);
                } else {
                    setOrders([]);
                    setReviews([]);
                }
            } catch (err) {
                setOrders([]);
                setReviews([]);
            }
            setLoadingTabs(false);
        }
        fetchTabs();
    }, [id]);


    useEffect(() => {
        document.title = "Manage User - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Manage and view user details, orders, and reviews in the Clean Bubble admin panel.");
        }
    }, []);



    const handleDeleteNotification = async (notifId) => {
        if (!notifId) return;
        try {
            const res = await axios.delete(`/api/fetch?url=${cred.backendURL}/api/admin/delete/notification/${user._id}/${notifId}`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message || "Notification deleted successfully");
                setUser(prev => ({
                    ...prev,
                    notifications: prev.notifications.filter(n => n._id !== notifId)
                }));
            } else {
                toast.error(res.data.message || "Failed to delete notification");
            }
        } catch (err) {
            console.error("Error deleting notification:", err);
            toast.error("Error deleting notification");
        }
    }


    const openDialog = (type) => {
        setDialog(type);
        if (type === "user") setEditData({ fullName: user.fullName });
        if (type === "contact") setEditData({ email: user.email, phone: user.phone });
        if (type === "accountType") setEditData({ accountType: user.accountType });
        if (type === "adminNote") setEditData({ adminNote: user.adminNote || "" });
        if (type === "isVerified") setEditData({ isVerified: !!user.isVerified });
    };


    const handleDialogChange = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        setUpdating(true);
        let updatePayload = {};
        if (dialog === "user") updatePayload = { fullName: editData.fullName };
        if (dialog === "contact") updatePayload = { email: editData.email, phone: editData.phone };
        if (dialog === "accountType") updatePayload = { accountType: editData.accountType };
        if (dialog === "adminNote") updatePayload = { adminNote: editData.adminNote };
        if (dialog === "isVerified") updatePayload = { isVerified: !!editData.isVerified };
        try {
            console.log("Update Payload:", updatePayload);
            const res = await axios.put(`/api/fetch?url=${cred.backendURL}/api/admin/update/user/${id}`, updatePayload, { withCredentials: true });
            if (res.data.success) {
                toast.success("User updated successfully");
                setUser(res.data.user);
                setDialog(null);
            } else {
                toast.error(res.data.message || "Failed to update user");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating user");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex gap-3 justify-center items-center h-96">
                <svg className='idkgg' viewBox='25 25 50 50'>
                    <circle className='gayxx' r='20' cy='50' cx='50'></circle>
                </svg>
                <span>Loading user data...</span>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center text-lg text-muted-foreground py-16">User not found</div>;
    }

    return (
        <div className="">
            <div className="">

                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-18 h-18 bg-[#321069] rounded-full mb-4">
                        <span className="text-4xl font-semibold text-foreground">
                            {user?.fullName.charAt(0).toUpperCase() || "?"}
                        </span>
                    </div>
                    <div className="max-w-2/3">
                        <h1 className="text-2xl font-semibold truncate">{user?.fullName || "..."}</h1>
                        <p className="text-sm text-muted-foreground mb-2">{user._id || "..."}</p>

                        <div className="flex items-center gap-2">
                            {user.accountType === 'admin' && (
                                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-semibold">ADMIN</span>
                            )}

                            <span className={`text-xs px-2 py-1 rounded font-semibold ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{user.isVerified ? 'Verified' : 'Not Verified'}</span>
                        </div>
                    </div>

                </div>


                <div className="ml-20">
                    {user.adminNote && (
                        <div className="flex gap-2 mt-2 w-fit bg-emerald-800 text-white px-3 py-1 rounded-md">
                            <p className="text-sm font-bold">Admin Note:</p>
                            <p className="text-sm">{user.adminNote}</p>
                        </div>
                    )}
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-indigo-700">Contact Details</h3>
                        <div className="flex flex-col bg-muted p-3 rounded-lg gap-2">
                            <span className=" rounded text-base">Email: {user.email}</span>
                            <span className="rounded text-base">Phone: {user.phone || 'Not Added'}</span>
                        </div>
                    </div>


                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-indigo-700">Shipping Addresses</h3>
                        {user.shippingAddress && user.shippingAddress.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                                {user.shippingAddress.map((addr, idx) => (
                                    <div key={idx} className=" rounded-lg bg-muted p-3 shadow-sm">
                                        <div className="font-medium">{addr.address}</div>
                                        <div className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip && `- ${addr.zip}`}</div>
                                        {addr.landmark && <div className="text-xs text-muted-foreground">Landmark: {addr.landmark}</div>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground text-sm">No shipping addresses.</div>
                        )}
                    </div>


                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-indigo-700">Other Info</h3>
                        <div className="flex flex-col bg-muted p-3 rounded-lg">
                            <span className=" rounded text-base">Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</span>
                            <span className="rounded text-base">Updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}</span>
                            <span className="rounded text-base">Total Orders: {user.orders ? user.orders.length : 0}</span>
                            <span className="rounded text-base">Total Reviews: {user.reviews ? user.reviews.length : 0}</span>
                        </div>
                    </div>


                    <div>
                        <h3 className="font-semibold text-lg mt-8 mb-2 text-indigo-700">Actions</h3>
                        <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="outline" onClick={() => openDialog('user')}>Edit User Data</Button>
                            <Button size="sm" variant="outline" onClick={() => openDialog('contact')}>Edit Contact Info</Button>
                            <Button size="sm" variant="outline" onClick={() => openDialog('accountType')}>Update Account Type</Button>
                            <Button size="sm" variant="outline" onClick={() => openDialog('adminNote')}>Add Admin Note</Button>
                            <Button size="sm" variant="outline" onClick={() => openDialog('isVerified')}>Update Verification</Button>

                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(user._id, "User ID copied to clipboard")}>
                                Copy User ID
                            </Button>

                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(user.email, "Email copied to clipboard")}>
                                Copy Email
                            </Button>

                        </div>
                    </div>

                </div>

                {/* Tabs for Notifications, Orders, Reviews */}
                <div className="mt-10">
                    <Tabs value={tab} onValueChange={setTab} className="w-full">
                        <TabsList className="mb-4 w-full bg-background">
                            <TabsTrigger
                                value="notifications"
                                className="data-[state=active]:border-b-foreground border-b-muted border-b-2 data-[state=active]:text-foreground data-[state=active]:font-bold">
                                Notifications
                            </TabsTrigger>

                            <TabsTrigger
                                value="orders"
                                className="data-[state=active]:border-b-foreground border-b-muted border-b-2 data-[state=active]:text-foreground data-[state=active]:font-bold">
                                Orders
                            </TabsTrigger>

                            <TabsTrigger
                                value="reviews"
                                className="data-[state=active]:border-b-foreground border-b-muted border-b-2 data-[state=active]:text-foreground data-[state=active]:font-bold">
                                Reviews
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="notifications">
                            <TabSection
                                items={user.notifications || []}
                                sort={notifSort}
                                setSort={setNotifSort}
                                loading={loadingTabs}
                                type="notification"
                                handleDeleteNotification={handleDeleteNotification}
                            />
                        </TabsContent>
                        <TabsContent value="orders">
                            <TabSection
                                items={orders}
                                sort={orderSort}
                                setSort={setOrderSort}
                                loading={loadingTabs}
                                type="order"
                            />
                        </TabsContent>
                        <TabsContent value="reviews">
                            <TabSection
                                items={reviews}
                                sort={reviewSort}
                                setSort={setReviewSort}
                                loading={loadingTabs}
                                type="review"
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Dialogs for editing */}
            <Dialog open={!!dialog} onOpenChange={v => !v && setDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialog === 'user' && 'Edit User Data'}
                            {dialog === 'contact' && 'Edit Contact Info'}
                            {dialog === 'accountType' && 'Update Account Type'}
                            {dialog === 'adminNote' && 'Add Admin Note'}
                            {dialog === 'isVerified' && 'Update Verification'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        {dialog === 'user' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <Input value={editData.fullName || ''} onChange={e => handleDialogChange('fullName', e.target.value)} />
                            </div>
                        )}
                        {dialog === 'contact' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <Input value={editData.email || ''} onChange={e => handleDialogChange('email', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <Input value={editData.phone || ''} onChange={e => handleDialogChange('phone', e.target.value)} />
                                </div>
                            </>
                        )}
                        {dialog === 'accountType' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Account Type</label>
                                <Select value={editData.accountType} onValueChange={v => handleDialogChange('accountType', v)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {dialog === 'adminNote' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Admin Note</label>
                                <Input value={editData.adminNote || ''} onChange={e => handleDialogChange('adminNote', e.target.value)} />
                            </div>
                        )}
                        {dialog === 'isVerified' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Verified Status</label>
                                <Select value={editData.isVerified ? "true" : "false"} onValueChange={v => handleDialogChange('isVerified', v === "true")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Verified</SelectItem>
                                        <SelectItem value="false">Not Verified</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={handleUpdate} disabled={updating} className="w-full">
                            {updating ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserInfoPage;