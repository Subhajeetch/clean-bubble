"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import cred from "@/mine.config";
import {
    Input
} from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import {
    Package,
    CircleUser,
    Truck,
    HandCoins,
    Bubbles,
} from "lucide-react";

import OrderProgress from "./orderProgress";

import OrderSlip from "./OrderSlip";

const AdminOrderInfoPage = () => {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id;
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [form, setForm] = useState({});
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isAddressFocused, setIsAddressFocused] = useState(false);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const debounceTimer = useRef(null);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openAddressDialog, setOpenAddressDialog] = useState(false);

    useEffect(() => {
        if (!orderId) return;
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${cred.backendURL}/api/admin/get/order/${orderId}`, {
                    withCredentials: true
                });
                setOrder(res.data.order);
                setForm({
                    ...res.data.order,
                    shippingAddress: res.data.order.shippingAddress?.[0] || {}
                });
            } catch (err) {
                toast.error("Failed to load order");
                router.back();
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (e.target.name === "address") {
            setLoadingAddress(true);
        }
    };

    useEffect(() => {
        if (!form.address) {
            setAddressSuggestions([]);
            setLoadingAddress(false);
            return;
        }
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_ADDRESS_API_KEY;
                const res = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${form.address}&limit=5&countrycodes=pk&normalizeaddress=1`);
                setAddressSuggestions(res.data);
            } catch (err) {
                toast.error("Failed to fetch address suggestions");
                setAddressSuggestions([]);
            } finally {
                setLoadingAddress(false);
            }
        }, 600);
        return () => clearTimeout(debounceTimer.current);
    }, [form.address]);

    const handleAddressSelect = (item) => {
        setForm({
            ...form,
            address: item.display_name,
            city: item.address.city || "Unknown",
            state: item.address.state || "Unknown",
            zip: item.address.postcode || "",
            isValidLocation: true
        });
        setAddressSuggestions([]);
        toast.success("Address selected!");
    };

    const handleUpdate = async (type) => {
        try {
            const payload = {};

            if (type === "status") {
                payload.status = form.status;
            } else if (type === "userInfo") {
                payload.name = form.name;
                payload.phone = form.phone;
            } else if (type === "address") {
                payload.address = form.address;
                payload.city = form.city;
                payload.state = form.state;
                payload.zip = form.zip;
                payload.landmark = form.landmark;
            } else {
                toast.error("Unknown update type.");
                return;
            }

            const res = await axios.put(
                `${cred.backendURL}/api/admin/update/single/order`,
                {
                    orderId: order._id,
                    type,
                    payload,
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("Order updated successfully!");
                setOrder(res.data.order);
                setForm({
                    ...res.data.order,
                    shippingAddress: res.data.order.shippingAddress?.[0] || {}
                });
            } else {
                toast.error("Failed to update order.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while updating.");
        } finally {
            setOpenStatusDialog(false);
            setOpenUserDialog(false);
            setOpenAddressDialog(false);
        }
    };


    useEffect(() => {
        document.title = "Manage Order - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Manage and update order details, including status, customer information, and shipping address. Ensure accurate order processing in the Clean Bubble admin panel.");
        }
    }, []);


    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'ordered':
                return {
                    indicator: 'rgba(185, 225, 80, 1)',
                    background: 'rgba(185, 225, 80, 0.2)',
                };
            case 'confirmed':
                return {
                    indicator: 'rgba(100, 180, 230, 1)',
                    background: 'rgba(100, 180, 230, 0.2)',
                };
            case 'shipped':
                return {
                    indicator: 'rgba(240, 180, 50, 1)',
                    background: 'rgba(240, 180, 50, 0.2)',
                };
            case 'delivered':
                return {
                    indicator: 'rgba(90, 160, 90, 1)',
                    background: 'rgba(90, 160, 90, 0.2)',
                };
            case 'cancelled':
                return {
                    indicator: 'rgba(220, 80, 80, 1)',
                    background: 'rgba(220, 80, 80, 0.2)',
                };
            default:
                return {
                    indicator: '#bbb',
                    background: 'rgba(0,0,0,0.05)',
                };
        }
    };

    // from chat gpt
    function formatDate(dateString) {
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


    const handleReload = () => {
        window.location.reload();
    };

    const copyToClipboard = (text, toastMsg) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(toastMsg || "Copied to clipboard");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy");
        });
    }

    if (loading) return <div className="text-center py-10">Loading order...</div>;

    return (
        <div className="">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="mb-5 text-dimmer-foreground">
                You are admin, you can edit the order!
            </p>
            <Card className="bg-card/90 border-none shadow-xl">
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">Order #{order._id.slice(-6).toUpperCase()}</CardTitle>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div
                        className="flex items-center w-fit gap-2 px-3 py-1 rounded-full"
                        style={{
                            backgroundColor: getOrderStatusColor(order.status).background,
                            color: getOrderStatusColor(order.status).indicator
                        }}
                    >
                        <div className="h-2 w-2 rounded-full"
                            style={{
                                backgroundColor: getOrderStatusColor(order.status).indicator
                            }}> </div>

                        <span className="font-semibold text-xs md:text-[16px] ">{order.status.toUpperCase()}</span>
                    </div>
                </CardHeader>

                <div className="mx-3">
                    {order && order.status !== "cancelled" && <OrderProgress currentStatus={order.status} />}
                </div>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Package size={28} />
                            <h2 className="font-semibold text-xl">
                                Products
                            </h2>
                        </div>

                        {order && order.products[0] && (
                            order.products.map(p => (
                                <div key={p._id} className="flex gap-2 pl-2">
                                    <div className="h-20 w-20 rounded-sm overflow-hidden">
                                        <img src={p.image} alt={p.name} className="" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[17px]">{p.name}</p>
                                        <p>Size: {p.size}</p>
                                        <p>{p.quantity} Pieces <span className="mx-3">x</span> Rs. {p.price}</p>

                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <CircleUser size={28} />
                            <h2 className="font-semibold text-xl">
                                Customer Details
                            </h2>
                        </div>

                        <div className="pl-2">
                            <p><span className="font-semibold">Name:</span> {order.name}</p>
                            <p><span className="font-semibold">Phone:</span> {order.phone}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Truck size={28} />
                            <h2 className="font-semibold text-xl">
                                Shipping Address
                            </h2>
                        </div>
                        {order && order.shippingAddress[0] && (
                            order.shippingAddress.map(a => (
                                <div key={a._id} className="flex flex-col pl-2">
                                    <p><span className="font-semibold">Address:</span> {a.address}</p>
                                    <p className="mt-2"><span className="font-semibold">State:</span> {a.state}</p>
                                    <p><span className="font-semibold">City:</span> {a.city}</p>
                                    <p><span className="font-semibold">Zip/Postal Code:</span> {a.zip || "Unknown"}</p>
                                    <p><span className="font-semibold">Landmark:</span> {a.landmark || "Unknown"}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <HandCoins size={28} />
                            <h2 className="font-semibold text-xl">
                                Payment & Pricing
                            </h2>
                        </div>

                        <div className="pl-2">
                            <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod === "cod" ? 'Cash On Delivery' : "Unknown"}</p>
                            <p className="mt-2"><span className="font-semibold">Net Amount:</span> {order.netAmount}</p>
                            <p><span className="font-semibold">Total Items:</span> {order.totalItems}</p>
                            <p><span className="font-semibold">Discount:</span> {order.discountPercent}%</p>
                            <p><span className="font-semibold">Total Amount:</span> {order.totalAmount}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 mt-6">
                            <Bubbles size={28} />
                            <h2 className="font-semibold text-xl">
                                Actions
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Dialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Update Status</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className='mb-4'><DialogTitle>Update Order Status</DialogTitle>
                                        <DialogDescription>
                                            This will be upadted on the user's profile as well, so make sure you do this after the product is actually meet the in real life's status.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ordered">Ordered</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button className="mt-4 w-full" onClick={() => handleUpdate("status")}>Submit</Button>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Edit Customer Info</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Update Customer Info</DialogTitle>
                                        <DialogDescription>
                                            User has already put their details, there is absolutly no need to update the user's name and contacts, do it only if it is absolutly necessary or user asked you to. This update is shown on user's order page as well.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Label>Name</Label>
                                    <Input name="name" value={form.name || ""} onChange={handleChange} />
                                    <Label className="mt-2">Phone</Label>
                                    <Input name="phone" value={form.phone || ""} onChange={handleChange} />
                                    <Button className="mt-4 w-full" onClick={() => handleUpdate("userInfo")}>Submit</Button>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={openAddressDialog} onOpenChange={setOpenAddressDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Edit Address</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                    <DialogHeader><DialogTitle>Update Address</DialogTitle>
                                        <DialogDescription>
                                            User has already put their address, there is absolutly no need to update it, do it only if it is absolutly necessary or user asked you to. This update is shown on user's order page as well.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="relative">
                                        <Label>Address</Label>
                                        <Input name="address" value={form.address || ""} onChange={handleChange} onFocus={() => setIsAddressFocused(true)} onBlur={() => setTimeout(() => setIsAddressFocused(false), 100)} />
                                        {isAddressFocused && addressSuggestions.length > 0 && (
                                            <ul className="absolute bg-muted border rounded-md shadow-md mt-1 w-full z-10 max-h-80 overflow-y-auto">
                                                {addressSuggestions.map((item, index) => (
                                                    <li key={index} className="p-2 hover:bg-muted cursor-pointer" onMouseDown={() => handleAddressSelect(item)}>
                                                        {item.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <Label className="mt-2">City</Label>
                                    <Input name="city" value={form.city || ""} onChange={handleChange} />
                                    <Label className="mt-2">State</Label>
                                    <Input name="state" value={form.state || ""} onChange={handleChange} />
                                    <Label className="mt-2">Zip</Label>
                                    <Input name="zip" value={form.zip || ""} onChange={handleChange} />
                                    <Label className="mt-2">Landmark</Label>
                                    <Input name="landmark" value={form.landmark || ""} onChange={handleChange} />
                                    <Button className="mt-4 w-full" onClick={() => handleUpdate("address")}>Submit</Button>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" onClick={() => copyToClipboard(order._id, "Order ID copied to clipboard")}>
                                Copy Order ID
                            </Button>

                            <Button variant="outline" onClick={() => copyToClipboard(order.user._id, "User ID copied to clipboard")}>
                                Copy User ID
                            </Button>
                        </div>
                    </div>


                </CardContent>

                <OrderSlip order={order} />
            </Card>
        </div>
    );
};

export default AdminOrderInfoPage; 