"use client";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogHeader
} from "@/components/ui/dialog"

import { useOrderSuccess } from "@/context/OrderSuccessContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import confetti from "canvas-confetti";

import { Cat } from "lucide-react";

export default function OrderSuccessUI() {
    const { isOrderSuccessOpen, closeOrderSuccess, setOrderSuccessState } = useOrderSuccess();

    const handleOrderSuccessOpen = (open) => {
        setOrderSuccessState(open);
    };

    useEffect(() => {
        let intervalId;

        if (isOrderSuccessOpen) {

            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });


            intervalId = setInterval(() => {
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.7 }
                });
            }, 3000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isOrderSuccessOpen]);

    return (
        <Dialog open={isOrderSuccessOpen} onOpenChange={handleOrderSuccessOpen}>
            <DialogTrigger className="hidden">
                <span className="hidden">Order Success</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={closeOrderSuccess}>
                <DialogHeader className="flex flex-col items-center justify-center gap-1">


                    <Cat size={88} className="animate-shake-twice" />

                    <DialogTitle>Thank You!</DialogTitle>
                    <DialogDescription>
                        Your order has been successfully placed.
                    </DialogDescription>
                </DialogHeader>

                <Button>Go to Orders</Button>
            </DialogContent>
        </Dialog>
    );
}
