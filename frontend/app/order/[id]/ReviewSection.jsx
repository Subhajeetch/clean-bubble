import { useEffect, useState } from "react";
import axios from "axios";
// weite review
import WriteReview from "@/app/WriteReview";

import cred from "@/mine.config";

import { StarIcon, OutlineStarIcon } from "@/universal/Icons";
import { BadgeCheck } from 'lucide-react';

const ReviewSection = ({ orderData }) => {
    const reviewId = orderData?.reviews?.[0];
    const orderId = orderData?._id;

    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(!!reviewId);

    const fetchReviewById = async () => {
        if (!reviewId) return;

        try {
            const res = await axios.get(`${cred.backendURL}/api/get/review/${reviewId}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                setReview(res.data.review);
            }
        } catch (err) {
            console.error("Failed to fetch review:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reviewId) {
            fetchReviewById();
        } else {
            setLoading(false); // no review, allow writing
        }
    }, [reviewId]);


    // chat gpt
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            day: "numeric",
            month: "long",
            year: "2-digit",
        };
        const datePart = date.toLocaleDateString(undefined, options);

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

        return `${datePart} - ${hours}:${minutesStr} ${ampm}`;
    }

    if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;

    return (
        <div className="mt-2 bg-muted rounded-md p-2 px-3 md:p-4 mb-8">
            {review ? (
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg mb-2">Your Review</h3>
                    <div className="flex gap-2 items-center">
                        <div className="h-10 w-10 rounded-full bg-[#321069] flex justify-center items-center relative">
                            <span className="font-semibold text-[22px]">{review.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-bold flex items-center gap-0.5">
                                {review.name.toUpperCase()}

                                {review?.isVerified && (
                                    <BadgeCheck size={16} />
                                )}

                            </p>
                            <span className="text-[9px] text-muted-foreground">{formatDate(review.createdAt)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 ml-10">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <span key={i}>
                                    {i < review.rating ? (
                                        <StarIcon color="#facc15" size={26} />
                                    ) : (
                                        <OutlineStarIcon size={24} />
                                    )}
                                </span>
                            ))}
                        </div>
                        {review.text && <p className="text-sm text-muted-foreground">{review.text}</p>}
                    </div>
                </div>
            ) : (
                <WriteReview orderId={orderId} />
            )}
        </div>
    );
};

export default ReviewSection;
