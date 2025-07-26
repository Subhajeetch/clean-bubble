"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { useCart } from '@/context/cartContext';
import { CircleCheck, Heart, Box } from "lucide-react";
import { useSheet } from "@/context/SheetContext";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";

const AddToCartButton = ({ productData, stock }) => {
    const { addToCart } = useCart();
    const { openSheet } = useSheet();
    const [isLiked, setIsLiked] = useState(false);
    const [isOutOfStock, setIsOutOfStock] = useState(stock <= 0);

    useEffect(() => {
        setIsOutOfStock(stock <= 0);
    }, [stock]);

    // Check localStorage on component mount
    useEffect(() => {
        const likedStatus = localStorage.getItem(`liked_${productData.id}`);
        if (likedStatus === "yes") {
            setIsLiked(true);
        }
    }, [productData.id]);

    const handleAddToCart = async () => {
        //  console.log(stock);
        if (stock <= 0) {
            toast.error("Product is out of stock.");
            return;
        }
        try {
            const response = await addToCart(productData);
            if (response.success) {
                toast.success("Added to cart!", {
                    action: {
                        label: "Go to Cart",
                        onClick: () => openSheet(true)
                    }
                });
            } else {
                toast.error("Failed to add to cart.");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add to cart.");
        }
    };

    const handleLikeToggle = () => {
        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);

        if (newLikedStatus) {
            localStorage.setItem(`liked_${productData.id}`, "yes");
        } else {
            localStorage.removeItem(`liked_${productData.id}`);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="xl"
                className="flex items-center rounded-full px-6 py-3"
                onClick={handleAddToCart}
            >
                {isOutOfStock ? (
                    <>
                        <Box />
                        <span className="font-semibold">Out of stock</span>
                    </>
                ) : (
                    <>
                        <CircleCheck />
                        <span className="font-semibold">Add to cart</span>
                    </>
                )}

            </Button>

            <Button variant="outline" className="" onClick={handleLikeToggle}>
                {isLiked ? (
                    <FaHeart className="text-forground" />
                ) : (
                    <Heart />
                )}
            </Button>
        </div>
    );
};

export default AddToCartButton;
