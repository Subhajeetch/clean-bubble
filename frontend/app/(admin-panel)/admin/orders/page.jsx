"use client"
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import cred from "@/mine.config";

const SORT_OPTIONS = [
    { value: "search", label: "Search" },
    { value: "recent", label: "Recent" },
    { value: "ordered", label: "Ordered" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
];

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshOrders, setRefreshOrders] = useState(false);

    // New sorting and search states
    const [sort, setSort] = useState("recent");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const debounceRef = useRef();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                sort,
                page,
                perPage,
                ...(sort === "search" && search ? { query: search } : {}),
            }).toString();

            const res = await axios.get(`/api/fetch?url=${cred.backendURL}/api/admin/get/orders?${queryParams}`, {
                withCredentials: true,
            });

            setOrders(res.data.orders || []);
            setTotal(res.data.total || 0);
            setHasNextPage(res.data.hasNextPage || false);
            setTotalPages(Math.max(1, Math.ceil((res.data.total || 0) / perPage)));
        } catch (err) {
            toast.error("Failed to load orders");
            setOrders([]);
            setTotal(0);
            setHasNextPage(false);
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders when dependencies change
    useEffect(() => {
        if (sort === "search" && !search) {
            setOrders([]);
            setTotal(0);
            setHasNextPage(false);
            setLoading(false);
            return;
        }
        fetchOrders();
    }, [sort, page, perPage, search, refreshOrders]);

    useEffect(() => {
        document.title = "View Orders - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Manage and view all orders in the Clean Bubble admin panel. Update order statuses and track user orders efficiently.");
        }
    }, []);

    // Debounce search input
    useEffect(() => {
        if (sort !== "search") return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => debounceRef.current && clearTimeout(debounceRef.current);
    }, [searchInput, sort]);

    const toggleSelect = (orderId) => {
        setSelectedOrders((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleBulkAction = async (status) => {
        try {
            const res = await axios.patch(
                `/api/fetch?url=${cred.backendURL}/api/admin/orders/update-status`,
                {
                    orderIds: selectedOrders,
                    status: status,
                },
                {
                    withCredentials: true,
                }
            );

            toast.success(res.data.message);
            setSelectedOrders([]);

            // Toggle the refresh trigger
            setRefreshOrders(prev => !prev);
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message || "Failed to update orders"
            );
        }
    };

    const goToOrder = (id) => {
        router.push(`/admin/order/${id}`);
    };

    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'ordered':
                return {
                    indicator: 'rgba(208, 255, 79, 1)',
                    background: 'rgba(202, 255, 55, 0.3)',
                };
            case 'confirmed':
                return {
                    indicator: 'rgba(79, 195, 247, 1)',
                    background: 'rgba(79, 195, 247, 0.3)',
                };
            case 'shipped':
                return {
                    indicator: 'rgba(255, 193, 7, 1)',
                    background: 'rgba(255, 193, 7, 0.3)',
                };
            case 'delivered':
                return {
                    indicator: 'rgba(76, 175, 80, 1)',
                    background: 'rgba(76, 175, 80, 0.3)',
                };
            case 'cancelled':
                return {
                    indicator: 'rgba(244, 67, 54, 1)',
                    background: 'rgba(244, 67, 54, 0.3)',
                };
            default:
                return {
                    indicator: '#ccc',
                    background: 'rgba(0,0,0,0.1)',
                };
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Orders</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button disabled={selectedOrders.length === 0}>
                            Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleBulkAction("ordered")}>Mark as Ordered</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("confirmed")}>Mark as Confirmed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("shipped")}>Mark as Shipped</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("delivered")}>Mark as Delivered</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction("cancelled")}>Mark as Cancelled</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

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
                                        setSelectedOrders([]);
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
                            className="w-full md:w-[260px]"
                            placeholder="Search by Order ID, user name, or email..."
                            value={searchInput}
                            onChange={e => {
                                setSearchInput(e.target.value);
                                setLoading(true);
                            }}
                        />
                    </div>
                )}
            </div>


            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8"></TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Placed At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sort === "search" && !searchInput ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground text-lg">
                                    Search by Order ID, user's name, or email
                                </TableCell>
                            </TableRow>
                        ) : loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-20 text-center">
                                    <div className="flex gap-3 justify-center items-center">
                                        <svg className="idkgg" viewBox="25 25 50 50">
                                            <circle className="gayxx" r="20" cy="50" cx="50"></circle>
                                        </svg>
                                        <span>Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow
                                    key={order._id}
                                    className="cursor-pointer hover:bg-muted"
                                    onClick={() => goToOrder(order._id)}
                                >
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedOrders.includes(order._id)}
                                            onCheckedChange={() => toggleSelect(order._id)}
                                        />
                                    </TableCell>
                                    <TableCell>#{order._id.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell className="capitalize">
                                        <span
                                            className="flex items-center w-fit gap-2 px-2 rounded-full"
                                            style={{
                                                backgroundColor: getOrderStatusColor(order.status).background,
                                                color: getOrderStatusColor(order.status).indicator
                                            }}
                                        >
                                            <div className="h-2 w-2 rounded-full"
                                                style={{
                                                    backgroundColor: getOrderStatusColor(order.status).indicator
                                                }}> </div>
                                            <span className="capitalize">{order.status}</span>
                                        </span>
                                    </TableCell>
                                    <TableCell>Rs. {order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-3 md:flex-row justify-between items-center pt-4">
                <span className="text-sm text-muted-foreground">
                    {orders.length} of {total} row(s) shown.
                </span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Per Page:</span>
                        <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                {[3, 5, 10, 15, 20, 30, 50].map((n) => (
                                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Page:</span>
                        <Select value={String(page)} onValueChange={(v) => setPage(Number(v))}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
