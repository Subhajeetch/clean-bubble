"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { StarIcon } from "@/universal/Icons";

import useAuthStore from "@/AuthStore/userStore";
// login tabs provider
import { useLogin } from "@/context/LoginContext";

import { CircleX } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import WriteReview from "./WriteReview";

import cred from "@/mine.config";
import ReviewList from "./UIforReviewList";

const RatingOverview = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { openLogin } = useLogin();
    const [loading, setLoading] = useState(true);
    const [ratingsCount, setRatingsCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    });

    useEffect(() => {
        const fetchRatingData = async () => {
            try {
                const res = await axios.get(`${cred.backendURL}/api/get/ratings/data`);
                const { ratingsCount, averageRating, ratingDistribution } = res.data.ratingData;
                setRatingsCount(ratingsCount);
                setAverageRating(averageRating);
                setRatingDistribution(ratingDistribution);
            } catch (error) {
                console.error("Failed to load rating data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRatingData();
    }, []);

    const renderStars = () => {
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating - fullStars >= 0.25;
        const totalStars = 5;

        return Array.from({ length: totalStars }, (_, i) => {
            if (i < fullStars) {
                return <StarIcon key={i} size={20} color="#facc15" />;
            } else if (i === fullStars && hasHalfStar) {
                return (
                    <div key={i} className="relative w-5 h-5">
                        <StarIcon size={20} color="#e5e7eb" />
                        <div className="absolute top-0 left-0 overflow-hidden w-1/2 h-full">
                            <StarIcon size={20} color="#facc15" />
                        </div>
                    </div>
                );
            } else {
                return <StarIcon key={i} size={20} color="#e5e7eb" />;
            }
        });
    };

    const getPercentage = (count) => {
        if (ratingsCount === 0) return 0;
        return ((count / ratingsCount) * 100).toFixed(1);
    };

    if (loading) {
        return (
            <div className="w-full my-10 flex items-center justify-center gap-3">
                <svg className='idkgg' viewBox='25 25 50 50'>
                    <circle
                        className='gayxx'
                        r='20'
                        cy='50'
                        cx='50'
                    ></circle>
                </svg>

                <p>Loading Rating overview...</p>
            </div>
        );
    }

    return (
        <>
            <div className="w-full md:flex md:gap-3 mb-10">
                <div className="text-center mb-2 md:w-[350px]">
                    <h3 className="text-center text-2xl font-semibold mb-3"> Rating overview</h3>
                    <p className="text-4xl font-bold">
                        {averageRating.toFixed(1)}
                        <span className="text-lg font-medium text-dimmer-foreground">/5</span>
                    </p>
                    <div className="flex justify-center gap-1 mt-1">
                        {renderStars()}
                    </div>
                    <p className="text-sm text-dimmer-foreground mt-1">
                        {ratingsCount.toLocaleString()} ratings
                    </p>

                    <Dialog>
                        <DialogTrigger className="mt-4 py-2 px-6 border-2 border-muted rounded-md">
                            Write review
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader className="sr-only">
                                <DialogTitle>Write your review.</DialogTitle>
                                <DialogDescription>
                                    Fill up the details
                                </DialogDescription>
                            </DialogHeader>

                            {!isAuthenticated || !user ? (
                                <div className="flex flex-col items-center text-sm  py-8">
                                    <CircleX size={58} />
                                    <h2 className="text-xl font-bold mt-4">You are not logged in!</h2>
                                    <p className="text-muted-foreground"> You must be logged in to write a review.</p>

                                    <Button className="mt-8 font-bold" onClick={openLogin}>
                                        Login
                                    </Button>
                                </div>
                            ) : !user.orders || user.orders.length === 0 ? (
                                <div className="flex flex-col items-center text-sm  py-8">
                                    <CircleX size={58} />
                                    <h2 className="text-xl font-bold mt-4">You haven't made any order!</h2>
                                    <p className="text-muted-foreground"> You must order once to write a review.</p>

                                    <DialogClose className="mt-4 py-2 px-6 border-2 border-muted rounded-md">
                                        Close
                                    </DialogClose>
                                </div>
                            ) : (
                                <WriteReview />
                            )}
                        </DialogContent>
                    </Dialog>


                </div>

                <div className="space-y-4 mt-5 md:flex-1">
                    {Object.keys(ratingDistribution)
                        .sort((a, b) => b - a)
                        .map((star) => {
                            const count = ratingDistribution[star];
                            const percentage = getPercentage(count);
                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-dimmer-foreground w-10 flex">
                                        {star} ★
                                    </span>
                                    <div className="relative flex-1 h-3 bg-gray-200 rounded overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-yellow-400"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-dimmer-foreground w-10 text-right">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>



            <div>
                <ReviewList />
            </div>
        </>
    );
};

export default RatingOverview;
