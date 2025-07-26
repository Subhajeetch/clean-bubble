'use client';

import { ShoppingCart, ShoppingBag, Trash2, Angry } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { useCart } from '@/context/cartContext';
import { useSheet } from '@/context/SheetContext';

import { useRouter } from 'next/navigation';

const Cart = () => {
    const { cartItems, loading, addToCart, removeFromCart, deleteFromCart, storeConfig } = useCart();
    const { isOpen, closeSheet, setSheetState } = useSheet();

    const router = useRouter();

    const handleCheckout = () => {
        closeSheet();
        router.push('/checkout');
    };

    const handleSheetToggle = (open) => {
        setSheetState(open);
    };

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

    // Calculate total quantity
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    // Calculate discount
    let discount = 0;
    if (cartCount >= storeConfig.bulkQuantityThreshold && storeConfig.bulkDiscountPercent > 0) {
        discount = subtotal * (storeConfig.bulkDiscountPercent / 100);
    } else if (storeConfig.discountPercent > 0) {
        discount = subtotal * (storeConfig.discountPercent / 100);
    }

    let disPercentForHtml = 0;
    if (cartCount >= storeConfig.bulkQuantityThreshold && storeConfig.bulkDiscountPercent > 0) {
        disPercentForHtml = storeConfig.bulkDiscountPercent;
    } else if (storeConfig.discountPercent > 0) {
        disPercentForHtml = storeConfig.discountPercent;
    }

    // Calculate total after discount
    const total = subtotal - discount;

    return (
        <Sheet open={isOpen} onOpenChange={handleSheetToggle}>
            <SheetTrigger>
                <div className="h-7 w-7 relative">
                    <span className="h-4 w-4 rounded-full bg-orange-400 absolute top-[-7px] right-[-3px] flex items-center justify-center text-[12px] font-bold">{cartCount}</span>
                    <ShoppingBag size={26} />
                </div>
            </SheetTrigger>
            <SheetContent onEscapeKeyDown={closeSheet}>
                <SheetHeader className="sr-only">
                    <SheetTitle>Cart</SheetTitle>
                    <SheetDescription>
                        You have {cartCount} items in your cart.
                    </SheetDescription>
                </SheetHeader>
                <div className="h-full relative mt-4">
                    <h2 className="text-2xl font-semibold text-center">Cart <span className="text-[14px] font-light">
                        {(
                            loading ? (
                                <span className="animate-pulse">(Loading...)</span>
                            ) : (
                                <span>
                                    (
                                    {cartItems.reduce((total, item) => total + item.quantity, 0)} items
                                    )
                                </span>
                            ))}
                    </span></h2>

                    <div>
                        {cartItems.length > 0 ? (
                            <div className="flex flex-col gap-4 mt-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-4">
                                        <div>
                                            <img src={item.image} alt={item.name} className="h-20 w-20 object-center rounded-md" />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-md font-semibold">{item.name}</p>
                                                    <p className="text-[12px] text-dimmer-foreground">{item.size}</p>
                                                </div>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mt-1">
                                                <p className="text-md font-semibold mt-2">Rs.  {item.price.toFixed(2)} PKR</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <Button variant="outline" size="sm" className="rounded-full px-[11px] py-1" onClick={() => handleRemove(item.id)}>-</Button>
                                                    <span className="text-md font-semibold">{item.quantity}</span>
                                                    <Button variant="outline" size="sm" className="rounded-full px-2.5 py-1" onClick={() => handleAdd(item)}>+</Button>
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

                    <div className="absolute bottom-0 left-0 right-0 rounded-lg shadow-lg p-4 bg-dimmer-background rounded-t-[40px]">
                        <div>
                            <div className="flex items-center justify-between p-2">
                                <p>Items</p>
                                <p>Rs.   {subtotal.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center justify-between p-2">
                                <p>Discounts</p>
                                <p>Rs.   {discount.toFixed(2)} ({disPercentForHtml}%)</p>
                            </div>

                            <div className="h-0.5 w-full bg-muted rounded-full my-2"></div>

                            <div className="flex items-center justify-between p-2">
                                <p>Total</p>
                                <p>Rs.    {total.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="px-2">
                            <Button className={`rounded-full w-full max-w-100 text-md font-semibold p-7
                            ${loading || cartItems.length === 0 ? 'bg-dimmer-foreground hover:bg-dimmer-foreground cursor-not-allowed' : ''}`}
                                onClick={() => {
                                    if (cartItems.length === 0) {
                                        toast.error("Add items to your cart.");
                                        return;
                                    }
                                    handleCheckout();
                                }}
                            >
                                {(loading ? (
                                    <div>
                                        <svg className='idkggoncheckout' viewBox='25 25 50 50'>
                                            <circle
                                                className='gayxxoncheckout'
                                                r='20'
                                                cy='50'
                                                cx='50'
                                            ></circle>
                                        </svg>
                                    </div>
                                ) : (
                                    <ShoppingCart style={{ width: 24, height: 24 }} />
                                ))}
                                <span>Checkout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Cart;