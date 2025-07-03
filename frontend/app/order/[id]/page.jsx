"use client"

import axios from "axios"
import { useEffect, useState, use } from "react";
import cred from "@/mine.config";
import useAuthStore from "@/AuthStore/userStore";

import {
    Package,
    CircleUser,
    Truck,
    HandCoins,
    Bubbles,
    MessageCircleQuestion,
    Cat
} from 'lucide-react';

import { toast } from "sonner";

import OrderProgress from "./orderProgress";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";

import ReviewSection from "./ReviewSection";

const OrderPage = ({ params }) => {
    const { id } = use(params); // cuz of shitty update of nextjs tsk tsk
    const { user } = useAuthStore();
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // cancel order
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [orderCancelled, setOrderCancelled] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            if (!user?._id) return;

            try {
                setLoading(true)
                const res = await axios.post(`${cred.backendURL}/api/get/order`, {
                    orderId: id,
                    userId: user._id
                }, {
                    withCredentials: true
                });
                setOrderData(res.data.orderData);
                setLoading(false);
            } catch (err) {
                console.log(err.response.data.message, err)
                setError(true);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, user]);


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

    // cancel order functions:
    const handleReasonChange = (value) => {
        setSelectedReason(value);
        if (value !== "others") {
            setCustomReason("");
            setCharCount(0);
        }
    };

    const handleCustomReasonChange = (e) => {
        const text = e.target.value.slice(0, 150);
        setCustomReason(text);
        setCharCount(text.length);
    };

    const handleCancelOrder = async () => {
        if (!selectedReason) return;

        const reason =
            selectedReason === "others" ? customReason.trim() : selectedReason;

        if (selectedReason === "others" && reason.length === 0) return;

        try {
            setSubmitting(true);
            const response = await axios.post(
                `${cred.backendURL}/api/order/cancel`,
                {
                    orderId: orderData._id,
                    cancelReason: reason,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                setOrderCancelled(true)
                toast.success(response.data.message)
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }

        } catch (err) {
            console.error("Error cancelling order:", err);
            toast.error(err.response.data.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            {loading && !orderData ? (
                <div className='flex gap-3 justify-center items-center h-screen'>
                    <svg className='idkgg' viewBox='25 25 50 50'>
                        <circle
                            className='gayxx'
                            r='20'
                            cy='50'
                            cx='50'
                        ></circle>
                    </svg>

                    <span>Loading...</span>
                </div>
            ) : error ? (
                <div className="flex flex-col gap-3 justify-center items-center h-screen">
                    <h1>Something went wrong, please try again!</h1>

                    <Button variant='outline' onClick={handleReload} >Reload</Button>

                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold">Order Details</h1>
                    <div className="mt-2 bg-muted rounded-md p-2 md:p-4 mb-8">

                        {orderData && (
                            <div className={`mb-2 ${orderData.status === "cancelled" ? "mb-8" : ""}`}>
                                <div className="flex items-center gap-3">
                                    <p className="font-semibold">
                                        Order #{orderData._id.slice(-6).toUpperCase()}
                                    </p>

                                    <div
                                        className="flex items-center w-fit gap-2 px-3 rounded-full"
                                        style={{
                                            backgroundColor: getOrderStatusColor(orderData.status).background,
                                            color: getOrderStatusColor(orderData.status).indicator
                                        }}
                                    >
                                        <div className="h-2 w-2 rounded-full"
                                            style={{
                                                backgroundColor: getOrderStatusColor(orderData.status).indicator
                                            }}> </div>

                                        <span className="font-semibold">{orderData.status.toUpperCase()}</span>
                                    </div>
                                </div>

                                <span className="text-sm text-muted-foreground">
                                    {orderData ? formatDate(orderData.createdAt) : ""}
                                </span>
                            </div>
                        )}

                        {orderData && orderData.status !== "cancelled" && <OrderProgress currentStatus={orderData.status} />}


                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <Package size={28} />
                                    <h2 className="font-semibold text-xl">
                                        Products
                                    </h2>
                                </div>

                                {orderData && orderData.products[0] && (
                                    orderData.products.map(p => (
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
                                    <p><span className="font-semibold">Name:</span> {orderData.name}</p>
                                    <p><span className="font-semibold">Phone:</span> {orderData.phone}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <Truck size={28} />
                                    <h2 className="font-semibold text-xl">
                                        Shipping Address
                                    </h2>
                                </div>
                                {orderData && orderData.shippingAddress[0] && (
                                    orderData.shippingAddress.map(a => (
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
                                    <p><span className="font-semibold">Payment Method:</span> {orderData.paymentMethod === "cod" ? 'Cash On Delivery' : "Unknown"}</p>
                                    <p className="mt-2"><span className="font-semibold">Net Amount:</span> {orderData.netAmount}</p>
                                    <p><span className="font-semibold">Total Items:</span> {orderData.totalItems}</p>
                                    <p><span className="font-semibold">Discount:</span> {orderData.discountPercent}%</p>
                                    <p><span className="font-semibold">Total Amount:</span> {orderData.totalAmount}</p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-20 flex flex-col">
                            <div className="flex gap-2 mb-4">
                                <Bubbles size={28} />
                                <h2 className="font-semibold text-xl">
                                    Actions
                                </h2>
                            </div>

                            {orderData.status === "shipped" || orderData.status === "delivered" || orderData.status === "cancelled" ? (
                                <>
                                    <Button disabled className="w-fit px-3 py-1 ml-2 bg-foreground text-background font-semibold text-sm rounded-md">
                                        Cancel Order
                                    </Button>
                                    {orderData.status === "cancelled" ? (
                                        <p className="mt-1 text-sm text-muted-foreground">This order is already cancelled!</p>
                                    ) : (
                                        <p className="mt-1 text-sm text-muted-foreground">You cannot cancel this order, it's already shipped or delivered!</p>
                                    )}
                                </>
                            ) : (
                                <Dialog>
                                    <DialogTrigger className="w-fit px-3 py-1 ml-2 bg-foreground text-background font-semibold text-sm rounded-md">
                                        Cancel Order
                                    </DialogTrigger>
                                    <DialogContent>

                                        {orderCancelled ? (
                                            <div className="flex flex-col gap-2 items-center justify-center">

                                                <DialogHeader className='sr-only'>
                                                    <DialogTitle>Order Cancelled!</DialogTitle>
                                                    <DialogDescription>
                                                        You have successfully cancelled your order!
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <Cat size={88} className="animate-shake-twice" />

                                                <h2 className="text-2xl font-bold">Cancelled!</h2>
                                                <p>
                                                    You have successfully cancelled your order.
                                                </p>

                                                <DialogClose onClick={handleReload} className='mt-8 bg-foreground p-2 px-4 text-background rounded-md w-full font-bold'>Done</DialogClose>

                                            </div>
                                        ) : (
                                            <>
                                                <DialogHeader className="sr-only">
                                                    <DialogTitle>Do you really want to cancel this order?</DialogTitle>
                                                    <DialogDescription>
                                                        Please select a reason to cancel this order!
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <h3 className="text-xl font-semibold">Do you really want to cancel this order?</h3>

                                                {orderData?.products?.map((p) => (
                                                    <div key={p._id} className="flex gap-2 bg-muted p-2 rounded-md mt-3">
                                                        <div className="h-20 w-20 rounded-sm overflow-hidden">
                                                            <img src={p.image} alt={p.name} className="object-cover h-full w-full" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-[17px]">{p.name}</p>
                                                            <p>Size: {p.size}</p>
                                                            <p>
                                                                {p.quantity} Pieces <span className="mx-3">x</span> Rs. {p.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="mt-6">
                                                    <div className="flex gap-2 items-center">
                                                        <MessageCircleQuestion />
                                                        <h4 className="text-xl font-semibold">Please select your reason:</h4>
                                                    </div>

                                                    <RadioGroup
                                                        className="ml-6 mt-3 space-y-2"
                                                        value={selectedReason}
                                                        onValueChange={handleReasonChange}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Changed my mind" id="reason1" />
                                                            <Label htmlFor="reason1">Changed my mind</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Found a better price elsewhere" id="reason2" />
                                                            <Label htmlFor="reason2">Found a better price elsewhere</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Order placed by mistake" id="reason3" />
                                                            <Label htmlFor="reason3">Order placed by mistake</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Delivery time is too long" id="reason4" />
                                                            <Label htmlFor="reason4">Delivery time is too long</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="others" id="others" />
                                                            <Label htmlFor="others">Others</Label>
                                                        </div>
                                                    </RadioGroup>

                                                    {selectedReason === "others" && (
                                                        <div className="mt-4 ml-6">
                                                            <Textarea
                                                                placeholder="Write your reason (max 150 characters)"
                                                                value={customReason}
                                                                onChange={handleCustomReasonChange}
                                                                className="resize-none"
                                                            />
                                                            <p className="text-sm text-muted-foreground text-right mt-1">
                                                                {150 - charCount} / 150
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>


                                                <div className="flex gap-4">

                                                    <DialogClose className="flex-1 border-2 border-muted rounded-md">
                                                        Close
                                                    </DialogClose>

                                                    <Button
                                                        className="flex-1"
                                                        disabled={
                                                            submitting ||
                                                            !selectedReason ||
                                                            (selectedReason === "others" && customReason.trim().length === 0)
                                                        }
                                                        onClick={handleCancelOrder}
                                                    >
                                                        {submitting ? "Cancelling..." : "Cancel Order"}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                    </div>

                    <div className="mt-2 bg-muted rounded-md p-2 px-3 md:p-4 mb-8">



                        <ReviewSection orderData={orderData} />

                    </div>

                </>
            )}
        </main >
    );
}

export default OrderPage;