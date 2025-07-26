"use client";

import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/cartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// backend URL
import cred from "@/mine.config";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import useAuthStore from "@/AuthStore/userStore";

import axios from "axios";

// login tabs provider
import { useLogin } from "@/context/LoginContext";

// order success
import { useOrderSuccess } from "@/context/OrderSuccessContext";

import { ShoppingCart, Angry, Trash2, Cat, MapPin, Check } from "lucide-react";

const CheckoutPage = () => {
    const { openLogin } = useLogin();

    const { user, isAuthenticated, isLoading, setUser } = useAuthStore();
    const { cartItems, addToCart, removeFromCart, deleteFromCart, storeConfig } = useCart();
    const [loading, setLoading] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isAddressFocused, setIsAddressFocused] = useState(false);
    const [loadingAddress, setLoadingAddress] = useState(false);

    const { openOrderSuccess } = useOrderSuccess();

    const [form, setForm] = useState({
        fullName: "" || user?.fullName || "",
        phone: "" || user?.phone || "",
        address: "",
        city: "",
        state: "",
        zip: "",
        landmark: "",
        isValidLocation: null,
    });

    const debounceTimer = useRef(null);

    // Handle selecting saved address
    const handleSelectSavedAddress = (savedAddress) => {
        setForm({
            ...form,
            address: savedAddress.address,
            city: savedAddress.city,
            state: savedAddress.state,
            zip: savedAddress.zip || "",
            landmark: savedAddress.landmark || "",
            isValidLocation: true,
        });
        toast.success("Address selected successfully!");
    };

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

        // Clear previous timer
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_ADDRESS_API_KEY;
                const response = await axios.get(
                    `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${form.address}&limit=5&countrycodes=pk&normalizeaddress=1`
                );
                setAddressSuggestions(response.data);
            } catch (err) {
                if (err.response && err.response.data.error === "Unable to geocode") {
                    toast.error("Please enter a valid address in Pakistan.");
                } else if (err.response && err.response.status === 403) {
                    toast.error("Search limit exceeded. Please try again later.");
                } else {
                    toast.error("Failed to fetch address suggestions. Please try again.");
                }

                setAddressSuggestions([]);
            } finally {
                setLoadingAddress(false);
            }
        }, 600);

        // Cleanup on unmount or address change
        return () => clearTimeout(debounceTimer.current);
    }, [form.address]);


    useEffect(() => {
        document.title = "Checkout - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Complete your purchase securely with Clean Bubble. Enter your shipping details and place your order.");
        }
    }, []);

    const handleAddressSelect = (item) => {
        setForm({
            ...form,
            address: item.display_name,
            city: item.address.city || "Unknown",
            state: item.address.state || "Unknown",
            zip: item.address.postcode || "",
            isValidLocation: true,
        });
        setAddressSuggestions([]);
        toast.success("Address selected!");
    };

    // create order function
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.fullName || !form.phone || !form.address || !form.city) {
            return toast.error("Please fill all fields.");
        }

        if (!form.isValidLocation) {
            return toast.error("Address must be in Pakistan.");
        }

        try {
            setLoading(true);
            const response = await axios.post(`${cred.backendURL}/api/order/create`, {
                products: cartItems,
                name: form.fullName,
                totalItems: cartItems.reduce((acc, item) => acc + item.quantity, 0),
                netAmount: discountedTotal,
                discountPercent: disPercentForHtml,
                totalAmount: discountedTotal,
                user: user,
                phone: form.phone,
                shippingAddress: {
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    zip: form.zip,
                    landmark: form.landmark,
                },
                paymentMethod: 'cod',
            },
                {
                    withCredentials: true
                });

            if (!response.data.success) {
                setLoading(false);
                toast.error("Failed to place order. Please try again.");
            }

            // Clear cart after successful order
            for (const item of cartItems) {
                await removeFromCart(item.id);
            }

            //console.log("Order response:", response.data);

            if (response.data.success) {
                setLoading(false);
                openOrderSuccess();
                setUser(response.data.user)
                toast.success("Order placed successfully!");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setLoading(false);
            toast.error("Failed to place order. Please try again.");
        }
    };

    // cart items edit functions
    const handleAdd = async (item) => {
        try {
            await addToCart(item);
        } catch (e) {
            toast.error("Failed to increase quantity");
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeFromCart(id);
        } catch (e) {
            toast.error("Failed to decrease quantity");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteFromCart(id);
        } catch (e) {
            toast.error("Failed to remove item");
        }
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    let discount = 0;

    // Calculate discount
    if (cartCount >= storeConfig.bulkQuantityThreshold && storeConfig.bulkDiscountPercent > 0) {
        discount = cartTotal * (storeConfig.bulkDiscountPercent / 100);
    } else if (storeConfig.discountPercent > 0) {
        discount = cartTotal * (storeConfig.discountPercent / 100);
    }

    let disPercentForHtml = 0;
    if (cartCount >= storeConfig.bulkQuantityThreshold && storeConfig.bulkDiscountPercent > 0) {
        disPercentForHtml = storeConfig.bulkDiscountPercent;
    } else if (storeConfig.discountPercent > 0) {
        disPercentForHtml = storeConfig.discountPercent;
    }

    const discountedTotal = cartTotal - discount;

    return (
        <main className="min-h-screen flex flex-col max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">

            <h1 className="text-4xl font-bold mb-16 mt-4 flex gap-4 items-center"><ShoppingCart style={{ width: 36, height: 36 }} /> Checkout</h1>

            {!isAuthenticated && !isLoading && (
                <div className="bg-muted p-4 rounded-md mb-8 flex flex-col items-center justify-center text-center">
                    <Cat size={88} className="animate-shake-twice" />
                    <h2 className="text-xl font-semibold">Please login to continue.</h2>
                    <p className="text-sm text-muted-foreground">You need to be logged in to place an order.</p>
                    <Button onClick={() => openLogin(true)} className="mt-4 font-bold">
                        Login
                    </Button>
                </div>
            )}

            {isAuthenticated && user && (
                <form onSubmit={handleSubmit} className="space-y-4 lg:flex lg:space-x-6">
                    <div className="space-y-4 lg:flex-1">

                        {/* Saved Addresses Section */}
                        {user?.shippingAddress && user.shippingAddress.length > 0 && (
                            <div className="bg-muted p-4 rounded-md mb-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <MapPin size={20} />
                                    Your Saved Addresses
                                </h2>
                                <div className="space-y-3">
                                    {user.shippingAddress.map((savedAddress, index) => (
                                        <div key={savedAddress._id || index} className="bg-background p-3 rounded-md border-l-4 border-primary">
                                            <div className="flex flex-col justify-between items-start gap-3">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm mb-1">
                                                        {savedAddress.city}, {savedAddress.state}
                                                        {savedAddress.zip && ` - ${savedAddress.zip}`}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                                                        {savedAddress.address}
                                                    </p>
                                                    {savedAddress.landmark && (
                                                        <p className="text-xs text-muted-foreground">
                                                            <span className="font-medium">Landmark:</span> {savedAddress.landmark}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSelectSavedAddress(savedAddress)}
                                                    className="flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    <Check size={14} />
                                                    Select This Address
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <h2 className="text-xl font-semibold underline">Shipping Address</h2>
                        <div>
                            <label htmlFor="fullName"
                                className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'
                            >Full Name</label>
                            <Input
                                name="fullName"
                                type="text"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                pattern="^[a-zA-Z\s]+$"
                                title="Please enter a valid name (letters and spaces only)"
                                className="outline-none rounded-md border-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone"
                                className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'
                            >Phone Number</label>
                            <div className="flex gap-4 ml-1">
                                <div className="flex gap-1 items-center">
                                    <img src="/pk-flag.png" alt="Pakistan Flag" className="h-4" />
                                    <span>+92</span>
                                </div>
                                <Input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone (eg: XXXXXXXXXX)"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    pattern="^[0-9]{10}$"
                                    title="Please enter a valid phone number in the format 3XXXXXXXXX"
                                    className="outline-none rounded-md border-none"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="address"
                                className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'
                            >Address (Pakistan only)</label>
                            <Input
                                name="address"
                                placeholder="Search Address "
                                value={form.address}
                                onChange={handleChange}
                                onFocus={() => setIsAddressFocused(true)}
                                onBlur={() => setTimeout(() => setIsAddressFocused(false), 100)}
                                required
                                className="outline-none rounded-md border-none"
                            />
                            {isAddressFocused && (
                                <>
                                    {loadingAddress ? (
                                        <div className="absolute bg-muted border rounded-md shadow-md mt-1 w-full z-10 p-2">
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">

                                                <svg className='idkgg' viewBox='25 25 50 50'>
                                                    <circle
                                                        className='gayxx'
                                                        r='20'
                                                        cy='50'
                                                        cx='50'
                                                    ></circle>
                                                </svg>

                                                <span>
                                                    Searching...
                                                </span>
                                            </p>
                                        </div>
                                    ) : addressSuggestions.length > 0 ? (
                                        <ul className="absolute bg-muted border rounded-md shadow-md mt-1 w-full z-10 max-h-80 overflow-y-auto">
                                            {addressSuggestions.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-dimmer-background cursor-pointer"
                                                    onMouseDown={() => handleAddressSelect(item)}
                                                >
                                                    {item.display_name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        form.address && (
                                            <div className="absolute bg-muted border rounded-md shadow-md mt-1 w-full z-10 p-2">
                                                <p className="text-sm text-muted-foreground">No suggestions found.</p>
                                            </div>
                                        )
                                    )}
                                </>
                            )}
                        </div>

                        <div>
                            <label htmlFor="country"
                                className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>Country</label>
                            <Select value="pakistan">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pakistan">Pakistan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="city"
                                className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'
                            >City</label>
                            <Input
                                name="city"
                                placeholder="City"
                                value={form.city}
                                onChange={handleChange}
                                required
                                className="outline-none rounded-md border-none"

                            />
                        </div>
                        <div>
                            <label htmlFor="state"
                                className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'
                            >State</label>
                            <Input
                                name="state"
                                placeholder="State"
                                value={form.state}
                                onChange={handleChange}
                                required
                                className="outline-none rounded-md border-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="zip"
                                className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'
                            >Zip Code (Optional)</label>
                            <Input
                                name="zip"
                                placeholder="Zip Code"
                                value={form.zip}
                                onChange={handleChange}
                                className="outline-none rounded-md border-none"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="landmark"
                                className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'
                            >Landmark (Optional)</label>
                            <Input
                                name="landmark"
                                placeholder="Landmark (e.g. Near Park)"
                                value={form.landmark || ""}
                                onChange={handleChange}
                                className="outline-none rounded-md border-none"
                            />
                        </div>
                    </div>

                    <div className="lg:w-[400px] lg:mt-17 flex flex-col gap-4">

                        <div>
                            {cartItems.length > 0 ? (
                                <div className="flex flex-col gap-4 bg-muted p-4 rounded-md">
                                    <h2 className="text-xl font-semibold mb-2">Cart Items</h2>
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div>
                                                <img src={item.image} alt={item.name} className="h-20 w-20 object-center rounded-md" />
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-md font-semibold">{item.name}</p>
                                                        <p className="text-[12px] text-dimmer-foreground">{item.size}</p>
                                                    </div>
                                                    <button type="button" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-md font-semibold mt-2">₹{item.price.toFixed(2)} PKR</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <Button type="button" variant="outline" size="sm" className="rounded-full px-[11px] py-1" onClick={() => handleRemove(item.id)}>-</Button>
                                                        <span className="text-md font-semibold">{item.quantity}</span>
                                                        <Button type="button" variant="outline" size="sm" className="rounded-full px-2.5 py-1" onClick={() => handleAdd(item)}>+</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center mt-10">
                                    <Angry className="mx-auto mb-4 animate-pulse" size={120} />
                                    <p className="text-lg font-semibold">Your cart is empty</p>
                                    <p className="text-sm text-gray-500">Add items to your cart to proceed.</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-muted p-4 rounded-md">
                            <h2 className="text-xl font-semibold mb-2">Payment Method</h2>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="cod"
                                    checked={true}
                                    disabled={true}
                                />
                                <label htmlFor="cod" className="text-sm font-medium">Cash on Delivery</label>
                            </div>
                        </div>

                        <div className="bg-muted p-4 rounded-md">
                            <h2 className="text-xl font-semibold mb-2">Cart Summary</h2>
                            {cartItems.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                <ul className="space-y-2">

                                    <li className="flex justify-between">
                                        <span>Items</span>
                                        <span>{cartCount}</span>
                                    </li>

                                    <li className="flex justify-between">
                                        <span>Net Ammount</span>
                                        <span>Rs. {cartTotal.toFixed(2)}</span>
                                    </li>

                                    <li className="flex justify-between">
                                        <span>Discount</span>
                                        <span>Rs. {discount.toFixed(2)} ({disPercentForHtml}%)</span>
                                    </li>

                                    <li className="flex justify-between font-semibold border-t pt-2 mt-2">
                                        <span>Total</span>
                                        <span>Rs. {discountedTotal.toFixed(2)}</span>
                                    </li>
                                </ul>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !form.isValidLocation}
                            className="w-full rounded-full font-semibold text-md p-6"
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </Button>
                        {form.isValidLocation === false && (
                            <p className="text-red-500 text-sm">We only deliver within Pakistan.</p>
                        )}
                    </div>
                </form>

            )}

            <div className="my-8 text-center">
                <p className="text-sm text-muted-foreground">
                    By placing an order, you agree to our{" "}
                    <a href="/terms" className="text-blue-500 hover:underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-blue-500 hover:underline">
                        Privacy Policy
                    </a>.
                </p>

                <p>
                    <span className=" font-semibold">Note:</span> Any of the items won't be delivered as this is a demo project. This page is for demonstration purposes only. Contact us for more information.
                </p>
            </div>
        </main>
    );
};

export default CheckoutPage;
