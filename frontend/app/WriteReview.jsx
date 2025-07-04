"use client";

import { useState } from "react";
import { StarIcon, OutlineStarIcon } from "@/universal/Icons";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

import { toast } from "sonner";
import cred from "@/mine.config";
import useAuthStore from "@/AuthStore/userStore";

import { PartyPopper } from 'lucide-react';

const MAX_CHARACTERS = 600;

const STAR_LABELS = {
    1: "Very Bad",
    2: "Bad",
    3: "Okay",
    4: "Good",
    5: "Excellent"
};

const WriteReview = ({ orderId }) => {
    const { user } = useAuthStore()
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [reviewDone, setReviewDone] = useState(false);

    const handleStarClick = (index) => {
        setRating(index);
        if (index === 5) {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

    const handleSubmit = async () => {
        if (rating < 1) return;

        setLoading(true);
        try {
            const res = await axios.post(
                `${cred.backendURL}/api/create/review`,
                {
                    rating,
                    name: user?.fullName,
                    comment: comment.trim(),
                    ...(orderId && { orderId: orderId })
                },
                { withCredentials: true }
            );
            console.log("Review submitted:", res.data);

            if (res.data.success) {
                setRating(0);
                setComment("");
                toast.success(res.data.message);
                setReviewDone(true);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    const currentLabel = hovered ? STAR_LABELS[hovered] : STAR_LABELS[rating] || "";

    return (
        reviewDone ? (
            <div className="flex flex-col justify-center items-center">
                <PartyPopper size={58} />
                <h2 className="mt-4 text-2xl font-bold">Thank you!</h2>
                <p className="text-dimmer-foreground">Thanks for your feedback, it means a lot...</p>

                <Button className="mt-6" onClick={handleReload}>
                    Refresh
                </Button>
            </div>
        ) : (
            <div className="w-full">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3 >

                {/* Rating Stars */}
                < div className="flex items-center gap-3  mb-4" >
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => {
                            const index = i + 1;
                            const isActive = hovered >= index || rating >= index;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onMouseEnter={() => setHovered(index)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => handleStarClick(index)}
                                    className="transition"
                                >
                                    {isActive ? (
                                        <StarIcon size={28} color="#facc15" />
                                    ) : (
                                        <OutlineStarIcon size={28} color="#e5e7eb" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {
                        currentLabel && (
                            <p className="text-md font-bold text-muted-foreground">{currentLabel}</p>
                        )
                    }
                </div >

                {/* Textarea */}
                < Textarea
                    placeholder="Write your review here..."
                    value={comment}
                    maxLength={MAX_CHARACTERS}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px]"
                />

                <p className="text-right text-sm text-gray-500 mt-1">
                    {comment.length}/{MAX_CHARACTERS} characters
                </p>

                <div className="flex justify-end mt-5">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || rating < 1}
                        className="mt-4"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>
            </div >
        )
    );
};

export default WriteReview;
