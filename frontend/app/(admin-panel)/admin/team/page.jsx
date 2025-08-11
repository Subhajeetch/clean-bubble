"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import cred from "@/mine.config";
import useAuthStore from "@/AuthStore/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Crown,
    Shield,
    Phone,
    Mail,
    Plus,
    ChevronDown,
    CircleArrowRight
} from "lucide-react";

export default function AdminTeamPage() {
    const { user: authUser, isLoading: authLoading } = useAuthStore();
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // Add action loading state
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);

    // Dialog states
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmData, setConfirmData] = useState(null);

    // Add team form
    const [addTab, setAddTab] = useState("email");
    const [emailInput, setEmailInput] = useState("");
    const [userIdInput, setUserIdInput] = useState("");

    // Countdown for confirmation
    const [countdown, setCountdown] = useState(10);
    const [canConfirm, setCanConfirm] = useState(false);

    useEffect(() => {
        fetchTeamMembers();
    }, [page, perPage]);

    // Countdown effect
    useEffect(() => {
        let interval;
        if (openConfirmDialog && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        setCanConfirm(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [openConfirmDialog, countdown]);

    useEffect(() => {
        document.title = "Team Management - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Manage your admin team members in the Clean Bubble admin panel. Add or remove admins, and view team details.");
        }
    }, []);

    // Reset countdown when dialog closes
    useEffect(() => {
        if (!openConfirmDialog) {
            setCountdown(10);
            setCanConfirm(false);
        }
    }, [openConfirmDialog]);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/fetch?url=${cred.backendURL}/api/admin/get/team?page=${page}&perPage=${perPage}`, {
                withCredentials: true,
            });

            setTeamMembers(res.data.teamMembers || []);
            setTotal(res.data.total || 0);
            setHasNextPage(res.data.hasNextPage || false);
        } catch (err) {
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (memberId) => {
        if (actionLoading) return; // Prevent selection during action
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleRemoveAdmin = () => {
        if (actionLoading) return;
        setConfirmAction("remove");
        setConfirmData({ userIds: selectedMembers });
        setOpenConfirmDialog(true);
    };

    const handleAddToTeam = async () => {
        if (actionLoading) return;
        const identifier = addTab === "email" ? emailInput.trim() : userIdInput.trim();

        if (!identifier) {
            toast.error(`Please enter a valid ${addTab}`);
            return;
        }

        setConfirmAction("add");
        setConfirmData({
            type: addTab,
            identifier,
            message: addTab === "email" ? `Add user with email: ${identifier}` : `Add user with ID: ${identifier}`
        });
        setOpenAddDialog(false);
        setOpenConfirmDialog(true);
    };

    const executeAction = async () => {
        if (actionLoading) return;

        try {
            setActionLoading(true);

            if (confirmAction === "remove") {
                console.log("Removing admins:", confirmData.userIds);
                await axios.patch(`/api/fetch?url=${cred.backendURL}/api/admin/team/remove-admin`, {
                    userIds: confirmData.userIds
                }, { withCredentials: true });

                toast.success("Admin privileges removed successfully");
                setSelectedMembers([]);
                handleReload();
            } else if (confirmAction === "add") {
                await axios.patch(`/api/fetch?url=${cred.backendURL}/api/admin/team/add-admin`, {
                    type: confirmData.type,
                    identifier: confirmData.identifier
                }, { withCredentials: true });

                toast.success("User added to team successfully");
                setEmailInput("");
                setUserIdInput("");
            }

            // Close dialog first, then refresh data after a short delay
            setOpenConfirmDialog(false);
            setConfirmAction(null);
            setConfirmData(null);

            // Add a small delay before fetching to ensure state cleanup
            setTimeout(() => {
                fetchTeamMembers();
            }, 100);

        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
            // Still close dialog on error
            setOpenConfirmDialog(false);
            setConfirmAction(null);
            setConfirmData(null);
        } finally {
            // Add delay before resetting action loading to prevent rapid clicks
            setTimeout(() => {
                setActionLoading(false);
            }, 500);
        }
    };

    // Clean up function to reset all states
    const resetAllStates = () => {
        setOpenAddDialog(false);
        setOpenConfirmDialog(false);
        setConfirmAction(null);
        setConfirmData(null);
        setCountdown(10);
        setCanConfirm(false);
        setActionLoading(false);
    };

    const getInitials = (name) => {
        return name.charAt(0).toUpperCase();
    };

    const handleReload = () => {
        window.location.reload();
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    if (loading || authLoading) {
        return <div className="text-center py-10">Loading team...</div>;
    }

    return (
        <div>
            <div className="flex flex-col justify-between gap-6 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Team Management</h1>
                    <p className="text-muted-foreground">Manage your admin team members</p>
                </div>

                {authUser?.isOwner && (
                    <div className="flex gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={selectedMembers.length === 0 || actionLoading}>
                                    Actions <ChevronDown size={16} className="ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={handleRemoveAdmin} disabled={actionLoading}>
                                    Remove Admin
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Dialog open={openAddDialog} onOpenChange={(open) => {
                            if (!actionLoading) {
                                setOpenAddDialog(open);
                                if (!open) {
                                    // Reset form when closing
                                    setEmailInput("");
                                    setUserIdInput("");
                                    setAddTab("email");
                                }
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button disabled={actionLoading}>
                                    <Plus size={16} className="mr-2" />
                                    Add to Team
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Team Member</DialogTitle>
                                    <DialogDescription>
                                        Add a new admin to your team by email or user ID
                                    </DialogDescription>
                                </DialogHeader>

                                <Tabs value={addTab} onValueChange={setAddTab}>
                                    <TabsList className="grid w-full grid-cols-2 mb-4 p-0">
                                        <TabsTrigger value="email" className="data-[state=active]:text-background data-[state=active]:border-2 data-[state=active]:bg-foreground rounded-md">By Email</TabsTrigger>
                                        <TabsTrigger value="userid" className="data-[state=active]:text-background data-[state=active]:border-2 data-[state=active]:bg-foreground rounded-md">By User ID</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="email" className="space-y-4">
                                        <div>
                                            <Label className="ml-1">Email Address</Label>
                                            <Input
                                                type="email"
                                                placeholder="user@example.com"
                                                value={emailInput}
                                                onChange={(e) => setEmailInput(e.target.value)}
                                                disabled={actionLoading}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="userid" className="space-y-4">
                                        <div>
                                            <Label className="ml-1">User ID</Label>
                                            <Input
                                                placeholder="60f7b3b3b3b3b3b3b3b3b3b3"
                                                value={userIdInput}
                                                onChange={(e) => setUserIdInput(e.target.value)}
                                                disabled={actionLoading}
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <Button
                                    className="w-full mt-4"
                                    onClick={handleAddToTeam}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? "Processing..." : "Add to Admin"}
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                        No team members found.
                    </div>
                ) : (
                    teamMembers.map((member) => (
                        <div key={member._id} className="bg-card border rounded-lg p-4 space-y-3 relative">
                            {/* Checkbox in top-right corner - only visible to owners */}
                            {authUser?.isOwner && !member.isOwner && (
                                <div className="absolute top-4 right-4">
                                    <Checkbox
                                        checked={selectedMembers.includes(member._id)}
                                        onCheckedChange={() => toggleSelect(member._id)}
                                        disabled={actionLoading}
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-3 pr-8">
                                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-semibold text-lg">
                                        {getInitials(member.fullName)}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold capitalize">{member.fullName}</h3>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        {member.isOwner && (
                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                <Crown size={12} className="mr-1" />
                                                Owner
                                            </Badge>
                                        )}
                                        {member.accountType === 'admin' && (
                                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                <Shield size={12} className="mr-1" />
                                                Admin
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-start">
                                    <div>

                                        <div className="flex items-center gap-2 text-muted-foreground w-full">
                                            <Mail size={14} />
                                            <span className="break-all line-clamp-1">{member.email}</span>
                                        </div>

                                        {member.phone && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone size={14} />
                                                <span>{member.phone}</span>
                                            </div>
                                        )}

                                    </div>
                                    <div className="bg-foreground rounded-md text-background h-10 w-10 flex items-center justify-center cursor-pointer">
                                        <Link
                                            href={`/admin/edit/user/${member._id}`}
                                            className="flex items-center justify-center h-full w-full"
                                        >
                                            <CircleArrowRight size={26} />
                                        </Link>

                                    </div>
                                </div>

                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Orders: {member.totalOrders}</span>
                                    <span>Reviews: {member.totalReviews}</span>
                                    <span>{member.status}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 md:flex-row justify-between items-center pt-6 mt-6 border-t">
                <span className="text-sm text-muted-foreground">
                    {teamMembers.length} of {total} team members shown.
                </span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Per Page:</span>
                        <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }} disabled={actionLoading}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 30, 50].map((n) => (
                                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Page:</span>
                        <Select value={String(page)} onValueChange={(v) => setPage(Number(v))} disabled={actionLoading}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirmDialog} onOpenChange={(open) => {
                if (!actionLoading && !open) {
                    resetAllStates();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {confirmAction === "add" ? "Add Admin" : "Remove Admin"}
                        </DialogTitle>
                        <DialogDescription>
                            {confirmAction === "add"
                                ? "This user will have full admin privileges and can manage users, orders, and reviews."
                                : "This will remove admin privileges from the selected users."
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-muted border-2 rounded-lg p-4 mb-4">
                        <p className="text-orange-800 font-semibold">⚠️ Warning</p>
                        <p className="text-orange-700 text-sm">
                            {confirmAction === "add"
                                ? "This user can do everything an admin can do. Make sure you trust them."
                                : "Selected users will lose their admin privileges immediately."
                            }
                        </p>
                        {confirmData?.message && (
                            <p className="text-orange-700 text-sm mt-2">
                                {confirmData.message}
                            </p>
                        )}
                    </div>

                    <Button
                        variant={confirmAction === "add" ? "default" : "destructive"}
                        className="w-full"
                        onClick={executeAction}
                        disabled={!canConfirm || actionLoading}
                    >
                        {actionLoading
                            ? "Processing..."
                            : canConfirm
                                ? (confirmAction === "add" ? "Add Admin" : "Remove Admin")
                                : `Please wait ${countdown}s`
                        }
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
