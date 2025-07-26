"use client"
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import cred from "@/mine.config";

import { BadgeCheck } from "lucide-react";

import { StarIcon, OutlineStarIcon } from "@/universal/Icons";

const SORT_OPTIONS = [
    { value: "search", label: "Search" },
    { value: "recent", label: "Recent" },
    { value: "older", label: "Older" },
    { value: "5-stars", label: "5 Stars" },
    { value: "4-stars", label: "4 Stars" },
    { value: "3-stars", label: "3 Stars" },
    { value: "2-stars", label: "2 Stars" },
    { value: "1-stars", label: "1 Stars" }
];

export default function AdminReviewsPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState("recent");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);

    const debounceRef = useRef();


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };


    const goToReview = (reviewId) => {
        router.push(`/admin/edit/review/${reviewId}`);
    };

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({
                sort,
                page,
                perPage,
                ...(sort === "search" && search ? { query: search } : {}),
            }).toString();

            const res = await axios.get(`${cred.backendURL}/api/admin/get/reviews?${queryParams}`, {
                withCredentials: true
            });

            // console.log("Fetched Reviews:", res.data);
            if (res.data && res.data.reviews) {
                setReviews(res.data.reviews);
                setTotal(res.data.total);
                setHasNextPage(res.data.hasNextPage);
            } else {
                setReviews([]);
                setTotal(0);
                setHasNextPage(false);
                toast.error("Failed to load reviews");
            }
        } catch (err) {
            setError("Error fetching reviews");
            setReviews([]);
            setTotal(0);
            setHasNextPage(false);
            toast.error("Error fetching reviews");
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (sort === "search" && !search) {
            setReviews([]);
            setTotal(0);
            setHasNextPage(false);
            setLoading(false);
            return;
        }
        fetchReviews();
    }, [sort, page, perPage, search]);


    useEffect(() => {
        document.title = "Review Management - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Manage and view all reviews in the Clean Bubble admin panel. Filter by rating, search by review ID, user name, or email.");
        }
    }, []);


    useEffect(() => {
        if (sort !== "search") return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => debounceRef.current && clearTimeout(debounceRef.current);
    }, [searchInput, sort]);


    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Review Management</h1>

            {/* Sorting and Search UI */}
            <div className="flex flex-col gap-3 lg:flex-row justify-between pb-4">
                <div className="flex items-center gap-2">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
                        <div className="flex gap-2 min-w-max">
                            {SORT_OPTIONS.map(opt => (
                                <Button
                                    key={opt.value}
                                    className={`px-4 text-foreground py-2 rounded-full border transition-all text-sm font-medium whitespace-nowrap ${sort === opt.value ? "bg-muted hover:bg-muted" : "border-muted bg-transparent hover:bg-muted"}`}
                                    onClick={() => {
                                        setSort(opt.value);
                                        setPage(1);
                                        setSearchInput("");
                                        setSearch("");
                                    }}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                {sort === "search" && (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Input
                            type="text"
                            className="w-full md:w-[280px]"
                            placeholder="Search by review ID, user name, email, or text..."
                            value={searchInput}
                            onChange={e => {
                                setSearchInput(e.target.value);
                                setLoading(true);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Reviews Content */}
            {sort === "search" && !searchInput ? (
                <div className="flex justify-center items-center h-40 text-muted-foreground text-lg">
                    Search by review ID, user name, email, or review text
                </div>
            ) : loading ? (
                <div className='flex gap-3 justify-center items-center h-64'>
                    <svg className='idkgg' viewBox='25 25 50 50'>
                        <circle className='gayxx' r='20' cy='50' cx='50'></circle>
                    </svg>
                    <span>Loading...</span>
                </div>
            ) : error ? (
                <div className='flex gap-3 justify-center items-center h-64'>
                    <span className='text-red-500'>{error}</span>
                </div>
            ) : (
                <>
                    {/* Reviews List */}
                    <div className="border-2 rounded-xl overflow-hidden">
                        {reviews.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">No reviews found.</div>
                        ) : (
                            reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="border-b-2 p-4 flex flex-col gap-2 cursor-pointer hover:bg-muted/80 transition-colors"
                                    onClick={() => goToReview(review._id)}
                                >
                                    <div className="flex gap-2 items-center">
                                        <div className="h-10 w-10 rounded-full bg-[#321069] flex justify-center items-center relative">
                                            <span className="font-semibold text-[22px] text-white">
                                                {review.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold flex items-center gap-0.5">
                                                {review.name.toUpperCase()}
                                                {review?.isVerified && (
                                                    <BadgeCheck size={16} />
                                                )}
                                            </p>
                                            <span className="text-[9px] text-muted-foreground">
                                                {formatDate(review.createdAt)}
                                            </span>
                                            {review.user && (
                                                <span className="text-[9px] text-muted-foreground">
                                                    {review.user.email}
                                                </span>
                                            )}
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
                                        {review.text && (
                                            <p className="text-sm text-muted-foreground">
                                                {review.text}
                                            </p>
                                        )}
                                        {review.adminReply && review.adminReply.text && (
                                            <div className="mt-2 p-2 bg-muted rounded border-l-2 border-primary">
                                                <p className="text-xs font-semibold text-primary">
                                                    Admin Reply:
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {review.adminReply.text}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-col gap-3 md:flex-row justify-between items-center pt-4">
                        <span className="text-sm text-muted-foreground">
                            {reviews.length} of {total} row(s) shown.
                        </span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Per Page:</span>
                                <Select value={String(perPage)} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
                                    <SelectTrigger className="w-[80px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        {[3, 5, 10, 15, 20, 30, 50].map(n => (
                                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Page:</span>
                                <Select value={String(page)} onValueChange={v => setPage(Number(v))}>
                                    <SelectTrigger className="w-[80px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
