import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { StarIcon, OutlineStarIcon } from "@/universal/Icons";
import cred from "@/mine.config";
import { BadgeCheck, Cat, Shield, EllipsisVertical } from 'lucide-react'
import useAuthStore from "@/AuthStore/userStore";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const FILTERS = [
    { label: "Recent", value: "recent" },
    { label: "Older", value: "older" },
    { label: "5 Star", value: "5star" },
    { label: "4 Star", value: "4star" },
    { label: "3 Star", value: "3star" },
    { label: "2 Star", value: "2star" },
    { label: "1 Star", value: "1star" },
];

const ReviewList = () => {
    const [filter, setFilter] = useState("5star");
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useAuthStore();

    // For fade logic
    const filterScrollRef = useRef(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);

    const observer = useRef();

    // Add at the top, inside your component
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        const el = filterScrollRef.current;
        if (!el) return;

        const onMouseDown = (e) => {
            isDragging.current = true;
            el.classList.add("cursor-grabbing");
            startX.current = e.pageX - el.offsetLeft;
            scrollLeft.current = el.scrollLeft;
        };
        const onMouseLeave = () => {
            isDragging.current = false;
            el.classList.remove("cursor-grabbing");
        };
        const onMouseUp = () => {
            isDragging.current = false;
            el.classList.remove("cursor-grabbing");
        };
        const onMouseMove = (e) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX.current) * 1;
            el.scrollLeft = scrollLeft.current - walk;
        };

        el.addEventListener("mousedown", onMouseDown);
        el.addEventListener("mouseleave", onMouseLeave);
        el.addEventListener("mouseup", onMouseUp);
        el.addEventListener("mousemove", onMouseMove);

        return () => {
            el.removeEventListener("mousedown", onMouseDown);
            el.removeEventListener("mouseleave", onMouseLeave);
            el.removeEventListener("mouseup", onMouseUp);
            el.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    // Fetch reviews
    const fetchReviews = useCallback(async (reset = false) => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `${cred.backendURL}/api/get/reviews?filter=${filter}&page=${reset ? 1 : page}`
            );
            const newReviews = res.data.reviews || [];
            setHasMore(res.data.hasMore);

            if (reset) {
                setReviews(newReviews);
                setPage(2);
            } else {
                setReviews((prev) => [...prev, ...newReviews]);
                setPage((prev) => prev + 1);
            }
        } catch (err) {
            setError("Failed to load reviews.");
        } finally {
            setLoading(false);
        }
    }, [filter, page, loading]);

    // Fetch on filter change
    useEffect(() => {
        fetchReviews(true);
    }, [filter]);


    const lastReviewRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new window.IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchReviews();
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore, fetchReviews]
    );

    // Fade logic for filter scroll
    const handleFilterScroll = () => {
        const el = filterScrollRef.current;
        if (!el) return;
        setShowLeftFade(el.scrollLeft > 0);
        setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        handleFilterScroll(); // initial check
        const el = filterScrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", handleFilterScroll);
        window.addEventListener("resize", handleFilterScroll);
        return () => {
            el.removeEventListener("scroll", handleFilterScroll);
            window.removeEventListener("resize", handleFilterScroll);
        };
    }, []);

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


    const copyToClipboard = (text, toastMsg) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(toastMsg || "Copied to clipboard");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy");
        });
    }

    return (
        <div className="w-full">
            {/* Filter Buttons */}
            <div className="relative mb-6">
                {/* Left fade */}
                {showLeftFade && (
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-6 z-10 bg-gradient-to-r from-white/100 via-white/80 to-transparent dark:from-background/100 dark:via-background/80 dark:to-transparent" />
                )}
                {/* Right fade */}
                {showRightFade && (
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-6 z-10 bg-gradient-to-l from-white/100 via-white/80 to-transparent dark:from-background/100 dark:via-background/80 dark:to-transparent" />
                )}

                <div
                    ref={filterScrollRef}
                    className="flex flex-nowrap gap-2 overflow-x-auto px-1 scrollbar-hide cursor-grab"
                    style={{
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        touchAction: "pan-x",
                    }}
                >
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition whitespace-nowrap
                ${filter === f.value
                                    ? "bg-muted text-foreground"
                                    : "border border-muted bg-transparent text-foreground hover:bg-muted/50"}
            `}
                            onClick={() => {
                                setFilter(f.value);
                                setPage(1);
                                setHasMore(true);
                            }}
                            disabled={loading && filter === f.value}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 && !loading && (
                    <div className="text-center text-muted-foreground py-8">No reviews found.</div>
                )}
                {reviews.map((review, idx) => (
                    <div key={review._id}
                        ref={idx === reviews.length - 1 ? lastReviewRef : null}
                        className="bg-muted rounded-md p-4 flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                            <div className="h-10 w-10 rounded-full bg-[#321069] flex justify-center items-center relative">
                                <span className="font-semibold text-[22px]">{review.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <p className="font-bold flex items-center gap-0.5">
                                    {review.name.toUpperCase()}

                                    {review?.isVerified && (
                                        <BadgeCheck size={16} />
                                    )}

                                </p>
                                <span className="text-[9px] text-muted-foreground">{formatDate(review.createdAt)}</span>
                            </div>
                            {user && user.accountType === "admin" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="p-2 rounded-full bg-muted-foreground/10 border-0 outline-0">
                                        <EllipsisVertical size={20} className="cursor-pointer" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="mr-4">
                                        <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                            copyToClipboard(review._id, "Review ID copied to clipboard");
                                        }}>Copy Review ID</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                            copyToClipboard(review.user, "User ID copied to clipboard");
                                        }}>Copy User ID</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            )}
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

                            {/* Admin Reply */}
                            {review.adminReply && (
                                <div className="mt-3 bg-background rounded-lg p-3 border-l-4 border-primary">
                                    <div className="flex gap-2 items-center mb-2">
                                        <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center">
                                            <Shield size={16} className="text-primary-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-primary text-sm flex items-center gap-1">
                                                {review.adminReply.name}
                                                <Shield size={12} />
                                            </p>
                                            <span className="text-[9px] text-muted-foreground">
                                                {formatDate(review.adminReply.date)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-10">
                                        {review.adminReply.text}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center justify-center my-8">
                        <svg className='idkgg' viewBox='25 25 50 50'>
                            <circle
                                className='gayxx'
                                r='20'
                                cy='50'
                                cx='50'
                            ></circle>
                        </svg>
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-500 py-4">{error}</div>
                )}
                {!hasMore && reviews.length > 0 && (
                    <div className="flex flex-col items-center mt-10 mb-20">
                        <Cat className="animate-shake-twice" size={68} />
                        <p className="text-muted-foreground mt-2 text-xl font-semibold"> You are all caught up.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewList;