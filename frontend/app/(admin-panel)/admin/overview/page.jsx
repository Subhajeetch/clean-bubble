'use client'

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowUpRight,
    ArrowDownRight,
    Users,
    ShoppingCart,
    Star,
    Package,
} from "lucide-react";

import cred from "@/mine.config";

import axios from "axios";

const PERIODS = [
    { label: "1 Day", value: "1d" },
    { label: "3 Days", value: "3d" },
    { label: "7 Days", value: "7d" },
    { label: "2 Weeks", value: "2w" },
    { label: "1 Month", value: "1m" },
    { label: "Lifetime", value: "all" },
];


const getOrderStatusColor = (status) => {
    switch (status) {
        case 'ordered':
            return 'text-[rgba(185,225,80,1)]';
        case 'confirmed':
            return 'text-[rgba(100,180,230,1)]';
        case 'shipped':
            return 'text-[rgba(240,180,50,1)]';
        case 'delivered':
            return 'text-[rgba(90,160,90,1)]';
        case 'cancelled':
            return 'text-[rgba(220,80,80,1)]';
        default:
            return 'text-[rgba(0,0,0,0.05)]';
    }
};


export default function AdminOverviewPage() {
    const [period, setPeriod] = useState("7d");
    const [loading, setLoading] = useState(false);
    const [overviewData, setOverviewData] = useState(null);

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/fetch?url=${cred.backendURL}/api/get/overview`, {
                    withCredentials: true,
                });
                // console.log(res)
                setOverviewData(res.data.stats);
            } catch (error) {
                console.error("Failed to load overview data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOverviewData();
    }, []);

    useEffect(() => {
        document.title = "Admin Overview - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Quick stats and insights for your Clean Bubble store. View orders, revenue, users, and more.");
        }
    }, []);

    const stats = overviewData?.[period];

    if (loading || !stats) {
        return <div className='flex gap-3 justify-center items-center h-screen'>
            <svg className='idkgg' viewBox='25 25 50 50'>
                <circle
                    className='gayxx'
                    r='20'
                    cy='50'
                    cx='50'
                ></circle>
            </svg>

            <span>Loading...</span>
        </div>;
    }


    return (
        <div className="">
            <section className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-1">
                        Admin Overview
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Quick stats and insights for your Clean Bubble store.
                    </p>
                </div>

            </section>

            {/* Period Selector */}
            <div className="flex flex-wrap gap-2 mb-8">
                {PERIODS.map((p) => (
                    <Button
                        key={p.value}
                        variant={period === p.value ? "default" : "outline"}
                        className={`rounded-full px-4 py-1 text-sm font-semibold transition
                            ${period === p.value
                                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow"
                                : "border border-muted bg-background text-foreground hover:bg-muted/50"}
                        `}
                        onClick={() => setPeriod(p.value)}
                    >
                        {p.label}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {/* Orders */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-[#141d3d85] via-[#0c153549] to-[#0d013d59]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold text-indigo-700">Orders</CardTitle>
                        <ShoppingCart className="text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.totalOrders}</div>
                        <div
                            className={`flex items-center gap-2 mt-2 text-sm ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            <ArrowUpRight
                                size={16}
                                className={stats.ordersChange < 0 ? 'transform rotate-180' : ''}
                            />
                            {`${stats.ordersChange >= 0 ? '+' : ''}${Math.round(stats.ordersChange * 100)}% this period`}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">
                            {stats.ordersToday} orders today
                        </div>
                    </CardContent>
                </Card>
                {/* Revenue */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-[#3b081d83] via-[#5e073c46] to-[#86005e1c]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold text-pink-700">Revenue</CardTitle>
                        <ArrowUpRight className="text-pink-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">Rs. {stats.totalRevenue.toLocaleString()}</div>
                        <div
                            className={`flex items-center gap-2 mt-2 text-sm ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            <ArrowUpRight
                                size={16}
                                className={stats.revenueChange < 0 ? 'transform rotate-180' : ''}
                            />
                            {`${stats.revenueChange >= 0 ? '+' : ''}${Math.round(stats.revenueChange * 100)}% this period`}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">
                            Rs. {stats.revenueToday} today
                        </div>
                    </CardContent>
                </Card>
                {/* Users */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-[#135e4549] via-[#074d243b] to-[#023b213f]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold text-green-700">Users</CardTitle>
                        <Users className="text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.newUsers}</div>

                        <div
                            className={`flex items-center gap-2 mt-2 text-sm ${stats.newUsersPercentage > 0
                                ? 'text-green-600'
                                : stats.newUsersPercentage < 0
                                    ? 'text-red-600'
                                    : 'text-muted-foreground'
                                }`}
                        >
                            {stats.newUsersPercentage > 0 ? (
                                <ArrowUpRight size={16} />
                            ) : stats.newUsersPercentage < 0 ? (
                                <ArrowUpRight size={16} className="rotate-180" />
                            ) : (
                                <span className="w-4 h-4" /> // placeholder to keep layout aligned
                            )}
                            {`${stats.newUsersPercentage > 0 ? '+' : ''}${(stats.newUsersPercentage * 100).toFixed()}%`}{" "}
                            from previous period
                        </div>
                    </CardContent>
                </Card>

                {/* Rating */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-[#75650648] via-[#6660083d] to-[#4b4a032f]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold text-yellow-500">Avg. Rating</CardTitle>
                        <Star className="text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.avgRating.toFixed(2)} / 5</div>
                        <div
                            className={`flex items-center gap-2 mt-2 text-sm ${stats.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {stats.ratingChange >= 0 ? (
                                <ArrowUpRight size={16} />
                            ) : (
                                <ArrowDownRight size={16} />
                            )}
                            {`${stats.ratingChange >= 0 ? '+' : ''}${Math.round(stats.ratingChange * 100)}% change in rating`}
                        </div>

                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stock */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-[#46034d73] via-[#9405c025] to-[#7c0abe2a]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold text-purple-700">Stock Left</CardTitle>
                        <Package className="text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.stock}</div>
                        <div className={`flex items-center gap-2 mt-2 w-fit rounded-full px-3 py-0.5 ${stats.stock > 0 ? "bg-[#00be295d]" : "bg-[#ad10102c]"}`}>
                            <div className={`h-2 w-2 rounded-full ${stats.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                            <p className={`text-sm font-semibold`}>
                                {stats.stock > 0 ? "In stock" : "Out of stock"}
                            </p>
                        </div>

                    </CardContent>
                </Card>
                {/* Recent Orders */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-[#10073a57] via-[#141d3d3d] to-[#0313471f]">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recentOrders && stats.recentOrders.length > 0 ? (
                            <ul className="divide-y divide-muted text-sm">
                                {stats.recentOrders.map((order) => (
                                    <li key={order.id} className="py-2 flex justify-between">
                                        <span>{order.id.toUpperCase()}</span>
                                        <span className={`${getOrderStatusColor(order.status)} font-semibold capitalize`}>
                                            {order.status}
                                        </span>
                                        <span>Rs. {order.price.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                No orders in this period
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}