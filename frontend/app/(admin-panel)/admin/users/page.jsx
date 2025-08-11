"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import cred from "@/mine.config";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import { useRef } from "react";

const SORT_OPTIONS = [
    { value: "search", label: "Search" },
    { value: "recent", label: "Recent" },
    { value: "older", label: "Older" },
    { value: "most-orders", label: "Most Orders" }
];

const UserPage = () => {
    const [users, setUsers] = useState([]);
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

    const totalOrders = (user) => {
        return user.orders ? user.orders.length : (user.orderCount || 0);
    };

    const fetchUsers = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({
                sort,
                page,
                perPage,
                ...(sort === "search" && search ? { query: search } : {}),
            }).toString();
            // console.log(queryParams)
            const res = await axios.get(`/api/fetch?url=${cred.backendURL}/api/admin/get/users?${queryParams}`, { withCredentials: true });
            // console.log("Fetched Users:", res.data);
            if (res.data && res.data.users) {
                setUsers(res.data.users);
                setTotal(res.data.total);
                setHasNextPage(res.data.hasNextPage);
            } else {
                setUsers([]);
                setTotal(0);
                setHasNextPage(false);
                toast.error("Failed to load users");
            }
        } catch (err) {
            setError("Error fetching users");
            setUsers([]);
            setTotal(0);
            setHasNextPage(false);
            toast.error("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sort === "search" && !search) {
            setUsers([]);
            setTotal(0);
            setHasNextPage(false);
            setLoading(false);
            return;
        }
        fetchUsers();

    }, [sort, page, perPage, search]);

    useEffect(() => {
        if (sort !== "search") return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => debounceRef.current && clearTimeout(debounceRef.current);
    }, [searchInput, sort]);


    useEffect(() => {
        document.title = "User Management - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Manage and view all users in the Clean Bubble admin panel. Update user details, view orders, and manage notifications.");
        }
    }, []);


    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            <div className="flex flex-col gap-3 md:flex-row justify-between pb-4">
                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        {SORT_OPTIONS.map(opt => (
                            <Button
                                key={opt.value}
                                className={`px-4 text-foreground py-2 rounded-full border transition-all text-sm font-medium ${sort === opt.value ? "bg-muted hover:bg-muted" : "border-muted bg-transparent hover:bg-muted"}`}
                                onClick={() => { setSort(opt.value); setPage(1); setSearchInput(""); setSearch(""); }}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                </div>
                {sort === "search" && (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Input
                            type="text"
                            className=" w-full md:w-[260px]"
                            placeholder="Search by ID, name, or email..."
                            value={searchInput}
                            onChange={e => {
                                setSearchInput(e.target.value);
                                setLoading(true);
                            }}
                        />
                    </div>
                )}
            </div>




            {sort === "search" && !searchInput ? (
                <div className="flex justify-center items-center h-40 text-muted-foreground text-lg">
                    Search by ID, name, or email
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[150px] font-bold text-[16px]'>Name</TableHead>
                            <TableHead className='w-[200px] font-bold text-[16px]'>Email</TableHead>
                            <TableHead className='w-[100px] font-bold text-[16px]'>Total Orders</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (

                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">No users found.</TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow
                                    key={user._id || user.id}
                                    className="cursor-pointer hover:bg-muted transition"
                                    onClick={() => window.location.href = `/admin/edit/user/${user._id || user.id}`}
                                >
                                    <TableCell className='font-medium'>
                                        {user.fullName || user.name}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{totalOrders(user)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}


            <div className="mt-4 flex flex-col gap-3 md:flex-row justify-between items-center pt-4">
                <span className="text-sm text-muted-foreground">
                    {users.length} of {total} row(s) shown.
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
        </div>
    );
};

export default UserPage;