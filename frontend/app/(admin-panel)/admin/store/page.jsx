"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import cred from "@/mine.config";
import { Pencil } from "lucide-react";

export default function StoreConfigPage() {
    const [config, setConfig] = useState({
        price: "",
        discountPercent: "",
        bulkDiscountPercent: "",
        bulkQuantityThreshold: "",
        stock: "",
        lastUpdated: ""
    });

    const [initialConfig, setInitialConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [editingFields, setEditingFields] = useState({});

    useEffect(() => {
        async function fetchConfig() {
            setLoading(true);
            try {
                const res = await axios.get(`${cred.backendURL}/api/admin/get/store/config`, { withCredentials: true });
                const data = res.data.config;
                //  console.log("Store Config Data:", data);
                if (data && typeof data.price !== "undefined") {
                    const final = {
                        price: data.price,
                        discountPercent: data.discountPercent,
                        bulkDiscountPercent: data.bulkDiscountPercent,
                        bulkQuantityThreshold: data.bulkQuantityThreshold,
                        stock: data.stock,
                        lastUpdated: data.updatedAt || new Date().toISOString()
                    };
                    setConfig(final);
                    setInitialConfig(final);
                } else {
                    toast.error("Failed to load config");
                }
            } catch (err) {
                toast.error("Error fetching config");
            } finally {
                setLoading(false);
            }
        }
        fetchConfig();
    }, []);

    useEffect(() => {
        document.title = "Store Configuration - Clean Bubble";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Configure the store settings below. Ensure that the values are correct before updating.");
        }
    }, []);

    const isChanged = initialConfig && Object.keys(config).some(
        key => String(config[key]) !== String(initialConfig[key])
    );


    const handleEditToggle = (key) => {
        setEditingFields(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!isChanged) {
            toast.info("No changes to update");
            return;
        }
        setUpdating(true);
        try {
            const res = await axios.put(`${cred.backendURL}/api/admin/update/store/config`,
                {
                    price: Number(config.price),
                    discountPercent: Number(config.discountPercent),
                    bulkDiscountPercent: Number(config.bulkDiscountPercent),
                    bulkQuantityThreshold: Number(config.bulkQuantityThreshold),
                    stock: Number(config.stock)
                },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            //console.log("Update Response:", res);
            const data = res.data;
            if (data.success) {
                const updatedAt = data.updatedAt || new Date().toISOString();

                const updatedConfig = {
                    ...config,
                    lastUpdated: updatedAt,
                };

                setConfig(updatedConfig);
                setInitialConfig(updatedConfig);
                setEditingFields({});
                toast.success("Store updated successfully!");
            } else {
                toast.error(data.message || "Failed to update config");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating config");
        } finally {
            setUpdating(false);
        }
    };

    const configFields = [
        {
            key: "price",
            label: "Product Price (PKR)",
            description: "The price of the product in Pakistani Rupees.",
        },
        {
            key: "discountPercent",
            label: "Discount (%)",
            description: "The percentage discount applied to the product price.",
        },
        {
            key: "bulkDiscountPercent",
            label: "Bulk Discount (%)",
            description: "The discount percentage applied when the bulk quantity threshold is met."
        },
        {
            key: "bulkQuantityThreshold",
            label: "Bulk Quantity Threshold",
            description: "The minimum quantity required to apply the bulk discount."
        },
        {
            key: "stock",
            label: "Stock",
            description: "The number of items available in stock."
        }
    ];


    const formatValue = (key, value) => {
        if (key === "price") return `Rs. ${Number(value).toFixed(2)}`;
        if (key === "discountPercent" || key === "bulkDiscountPercent") return `${Number(value)}%`;
        return value;
    };

    // from chat gpt
    const formatLastUpdated = (timestamp) => {
        if (!timestamp) return "Not available";

        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "long" }); // e.g. July
        const year = date.getFullYear();
        const time = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }); // e.g. 01:12 PM

        return `${day} ${month}, ${year} - ${time}`;
    };



    return (
        <div className="space-y-4">

            <div className="mb-8">
                <h2 className="text-3xl font-bold">Store Configuration</h2>
                <p className="text-muted-foreground">
                    Configure the store settings below. Ensure that the values are correct before updating.
                </p>
            </div>
            {loading ? (
                <p className="text-muted-foreground animate-pulse text-lg">Loading...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                        {configFields.map(({ key, label, description }) => (
                            <div
                                key={key}
                                className="flex flex-col gap-2 p-3 rounded-md bg-muted"
                            >

                                <div className="flex items-center justify-between w-full gap-4">
                                    <label className="font-bold text-foreground w-1/2">{label}</label>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleEditToggle(key)}
                                        className="hover:bg-accent"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </div>


                                <div className="flex">
                                    {editingFields[key] ? (
                                        <Input
                                            type="number"
                                            name={key}
                                            value={config[key]}
                                            onChange={handleChange}
                                            className="w-full"
                                        />
                                    ) : (
                                        <span className="text-2xl font-semibold">{formatValue(key, config[key])}</span>
                                    )}

                                </div>

                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="flex flex-col justify-center items-center gap-0.5 w-full">
                        <Button
                            onClick={handleUpdate}
                            disabled={!isChanged || updating}
                            className="w-full max-w-90 mt-4 font-semibold text-md"
                        >
                            {updating ? "Updating..." : "Update Store"}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            Last Updated: {formatLastUpdated(config.lastUpdated)}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
