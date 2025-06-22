"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { useCart } from '@/context/cartContext';
import { CircleCheck } from "lucide-react";
import { useSheet } from "@/context/SheetContext";

const AddToCartButton = ({ productData }) => {
    const { addToCart } = useCart();
    const { openSheet } = useSheet();

    const handleAddToCart = async () => {
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

    return (
        <Button
            size="xl"
            className="flex items-center rounded-full px-6 py-3"
            onClick={handleAddToCart}
        >
            <CircleCheck />
            <span className="font-semibold">Add To Cart</span>
        </Button>
    );
};

export default AddToCartButton;
