"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import cred from "@/mine.config";
import useAuthStore from "@/AuthStore/userStore";
import {
    Textarea
} from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    User,
    Trash2,
    Edit,
    CheckCircle,
    XCircle
} from "lucide-react";

import { StarIcon, OutlineStarIcon } from "@/universal/Icons";

const AdminReviewInfoPage = () => {
    const router = useRouter();
    const params = useParams();
    const reviewId = params?.id;
    const { user: authUser, isLoading: authLoading } = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState(null);
    const [form, setForm] = useState({});

    const [openRatingDialog, setOpenRatingDialog] = useState(false);
    const [openTextDialog, setOpenTextDialog] = useState(false);
    const [openReplyDialog, setOpenReplyDialog] = useState(false);
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [deleteCountdown, setDeleteCountdown] = useState(10);
    const [canDelete, setCanDelete] = useState(false);

    useEffect(() => {
        if (!reviewId) return;
        const fetchReview = async () => {
            try {
                const res = await axios.get(`/api/fetch?url=${cred.backendURL}/api/admin/get/review/${reviewId}`, {
                    withCredentials: true
                });
                setReview(res.data.review);
                setForm({
                    ...res.data.review,
                    adminReplyText: res.data.review.adminReply?.text || ""
                });
            } catch (err) {
                toast.error("Failed to load review");
                router.back();
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [reviewId]);


    useEffect(() => {
        let interval;
        if (openDeleteDialog && deleteCountdown > 0) {
            interval = setInterval(() => {
                setDeleteCountdown(prev => {
                    if (prev <= 1) {
                        setCanDelete(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [openDeleteDialog, deleteCountdown]);


    useEffect(() => {
        if (!openDeleteDialog) {
            setDeleteCountdown(10);
            setCanDelete(false);
        }
    }, [openDeleteDialog]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (type) => {
        try {
            const payload = {};

            if (type === "rating") {
                if (!form.rating || form.rating < 1 || form.rating > 5) {
                    toast.error("Please select a valid rating (1-5)");
                    return;
                }
                payload.rating = parseInt(form.rating);
            } else if (type === "text") {
                payload.text = form.text || "";
            } else if (type === "reply") {
                if (!form.adminReplyText?.trim()) {
                    // Remove admin reply
                    payload.adminReply = null;
                } else {
                    payload.adminReply = {
                        name: authUser?.fullName || "Admin",
                        text: form.adminReplyText.trim()
                    };
                }
            } else if (type === "verify") {
                payload.isVerified = form.isVerified;
            } else if (type === "delete") {
                payload.action = "delete";
            }

            const res = await axios.patch(
                `/api/fetch?url=${cred.backendURL}/api/admin/update/review/${review._id}`,
                payload,
                { withCredentials: true }
            );

            if (res.data.success) {
                if (type === "delete") {
                    toast.success("Review deleted successfully!");
                    router.back();
                    return;
                }

                toast.success("Review updated successfully!");
                setReview(res.data.review);
                setForm({
                    ...res.data.review,
                    adminReplyText: res.data.review.adminReply?.text || ""
                });
            } else {
                toast.error("Failed to update review.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "An error occurred while updating.");
        } finally {
            setOpenRatingDialog(false);
            setOpenTextDialog(false);
            setOpenReplyDialog(false);
            setOpenVerifyDialog(false);
            setOpenDeleteDialog(false);
        }
    };

    useEffect(() => {
        document.title = "Review Details - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "View and manage review details, ratings, and admin replies in the Clean Bubble admin panel.");
        }
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        const datePart = date.toLocaleDateString(undefined, options);

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

        return `${datePart} - ${hours}:${minutesStr} ${ampm}`;
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i}>
                {i < rating ? (
                    <StarIcon color="#facc15" size={24} />
                ) : (
                    <OutlineStarIcon size={24} />
                )}
            </span>
        ));
    };

    const copyToClipboard = (text, toastMsg) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(toastMsg || "Copied to clipboard");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy");
        });
    }

    if (loading || authLoading) {
        return <div className="text-center py-10">Loading review...</div>;
    }

    if (!review) {
        return <div className="text-center py-10">Review not found</div>;
    }

    return (
        <div className="">
            <h1 className="text-3xl font-bold">Review Details</h1>
            <p className="mb-5 text-dimmer-foreground">
                You are admin, you can edit the review!
            </p>

            <Card className="bg-card/90 border-none shadow-xl">
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">Review #{review._id.slice(-6).toUpperCase()}</CardTitle>
                        <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {review.isVerified ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle size={14} className="mr-1" />
                                Verified
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-gray-200">
                                <XCircle size={14} className="mr-1" />
                                Unverified
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Review Content */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <MessageSquare size={28} />
                            <h2 className="font-semibold text-xl">Review Content</h2>
                        </div>

                        <div className="pl-2 space-y-3">
                            <div>
                                <p className="font-semibold">Rating:</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {renderStars(review.rating)}
                                    <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold">Review Text:</p>
                                <p className="text-muted-foreground mt-1">
                                    {review.text || "No review text provided"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <User size={28} />
                            <h2 className="font-semibold text-xl">Customer Details</h2>
                        </div>

                        <div className="pl-2 space-y-2">
                            <p><span className="font-semibold">Name:</span> {review.name}</p>
                            {review.user && (
                                <>
                                    <p><span className="font-semibold">Email:</span> {review.user.email}</p>
                                    <p><span className="font-semibold">User ID:</span> {review.user._id}</p>
                                    <p><span className="font-semibold">Account Type:</span> {review.user.accountType}</p>
                                </>
                            )}
                            {review.order && (
                                <p><span className="font-semibold">Order ID:</span> #{review.order._id?.slice(-6).toUpperCase()}</p>
                            )}
                        </div>
                    </div>

                    {/* Admin Reply */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <MessageSquare size={28} />
                            <h2 className="font-semibold text-xl">Admin Reply</h2>
                        </div>

                        <div className="pl-2">
                            {review.adminReply ? (
                                <div className="bg-muted p-3 rounded-lg">
                                    <p className="font-semibold text-sm capitalize">{review.adminReply.name}</p>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {formatDate(review.adminReply.date)}
                                    </p>
                                    <p>{review.adminReply.text}</p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No admin reply yet</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 mt-6">
                            <Edit size={28} />
                            <h2 className="font-semibold text-xl">Actions</h2>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {/* Update Rating */}
                            <Dialog open={openRatingDialog} onOpenChange={setOpenRatingDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Update Rating</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className="mb-4">
                                        <DialogTitle>Update Rating</DialogTitle>
                                        <DialogDescription>
                                            Change the review rating from 1 to 5 stars.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Label>Rating</Label>
                                    <Select
                                        value={form.rating?.toString()}
                                        onValueChange={(value) => setForm({ ...form, rating: parseInt(value) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 Star</SelectItem>
                                            <SelectItem value="2">2 Stars</SelectItem>
                                            <SelectItem value="3">3 Stars</SelectItem>
                                            <SelectItem value="4">4 Stars</SelectItem>
                                            <SelectItem value="5">5 Stars</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button className="mt-4 w-full" onClick={() => handleUpdate("rating")}>
                                        Submit
                                    </Button>
                                </DialogContent>
                            </Dialog>

                            {/* Update Text */}
                            <Dialog open={openTextDialog} onOpenChange={setOpenTextDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Edit Text</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className="mb-4">
                                        <DialogTitle>Update Review Text</DialogTitle>
                                        <DialogDescription>
                                            Edit the review text content. Leave empty to remove text.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Label>Review Text</Label>
                                    <Textarea
                                        name="text"
                                        value={form.text || ""}
                                        onChange={handleChange}
                                        placeholder="Enter review text..."
                                        rows={4}
                                    />
                                    <Button className="mt-4 w-full" onClick={() => handleUpdate("text")}>
                                        Submit
                                    </Button>
                                </DialogContent>
                            </Dialog>

                            {/* Admin Reply */}
                            <Dialog open={openReplyDialog} onOpenChange={setOpenReplyDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        {review.adminReply ? "Edit Reply" : "Add Reply"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className="mb-4">
                                        <DialogTitle>
                                            {review.adminReply ? "Edit Admin Reply" : "Add Admin Reply"}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Reply to this customer's review. Leave empty to remove existing reply.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Label>Admin Reply</Label>
                                    <Textarea
                                        name="adminReplyText"
                                        value={form.adminReplyText || ""}
                                        onChange={handleChange}
                                        placeholder="Enter your reply..."
                                        rows={4}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Replying as: <span className="capitalize">{authUser?.fullName || "Admin"}</span>
                                    </p>
                                    <Button className="mt-4 w-full" onClick={() => handleUpdate("reply")}>
                                        Submit
                                    </Button>
                                </DialogContent>
                            </Dialog>

                            {/* Toggle Verification */}
                            <Dialog open={openVerifyDialog} onOpenChange={setOpenVerifyDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        {review.isVerified ? "Remove Verification" : "Verify Review"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className="mb-4">
                                        <DialogTitle>Update Verification Status</DialogTitle>
                                        <DialogDescription>
                                            Change whether this review is marked as verified or not.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Label>Verification Status</Label>
                                    <Select
                                        value={form.isVerified?.toString()}
                                        onValueChange={(value) => setForm({ ...form, isVerified: value === "true" })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select verification status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Verified</SelectItem>
                                            <SelectItem value="false">Unverified</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button className="mt-4 w-full" onClick={() => handleUpdate("verify")}>
                                        Submit
                                    </Button>
                                </DialogContent>
                            </Dialog>

                            {/* Delete Review */}
                            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 size={16} className="mr-2" />
                                        Delete Review
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className="mb-4">
                                        <DialogTitle>Delete Review</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. This will permanently delete the review and remove it from the database.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="bg-muted border-2 rounded-lg p-4 mb-4">
                                        <p className="text-red-800 font-semibold">⚠️ Warning</p>
                                        <p className="text-red-700 text-sm">
                                            This will permanently delete the review. This action cannot be undone.
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => handleUpdate("delete")}
                                        disabled={!canDelete}
                                    >
                                        {canDelete ? "Delete Review" : `Please wait ${deleteCountdown}s`}
                                    </Button>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" onClick={() => copyToClipboard(review._id, "Review ID copied to clipboard")}>
                                Copy Review ID
                            </Button>

                            <Button variant="outline" onClick={() => copyToClipboard(review.user?._id, "User ID copied to clipboard")}>
                                Copy User ID
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminReviewInfoPage;