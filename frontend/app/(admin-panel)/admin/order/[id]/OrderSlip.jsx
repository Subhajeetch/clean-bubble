"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Button } from "@/components/ui/button";

import { FileText, Sparkles } from 'lucide-react';

const OrderSlip = ({ order }) => {
    const slipRef = useRef(null);
    const [slipImage, setSlipImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateSlipImage = async () => {
        if (!slipRef.current) return;
        setLoading(true);


        await new Promise((resolve) => setTimeout(resolve, 300));

        try {
            const dataUrl = await toPng(slipRef.current, {
                cacheBust: true,
                width: 800,
                height: 800,
            });
            setSlipImage(dataUrl);
        } catch (err) {
            console.error("Error generating slip:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (slipImage) {
            download(slipImage, `OrderSlip-${order._id.slice(-6)}.png`);
        }
    };

    const handleTryAgain = () => {
        setSlipImage(null);
        setTimeout(() => generateSlipImage(), 100);
    };

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


    const shipping = order?.shippingAddress?.[0];

    return (
        <div className="mt-10">
            <div className="flex gap-2 ml-6">
                <FileText size={28} />
                <h2 className="font-semibold text-xl">
                    Order Slip Preview
                </h2>
            </div>



            {!slipImage && (
                <div className="ml-6 mt-4">
                    <Button onClick={generateSlipImage} disabled={loading}>
                        <Sparkles />
                        {loading ? "Generating..." : "Generate Slip"}
                    </Button>
                </div>
            )}

            {slipImage && (
                <div className="flex flex-col p-6">
                    <img
                        src={slipImage}
                        alt="Packing Slip"
                        className="mt-4 rounded border shadow w-full max-w-[400px] h-auto"
                    />
                    <div className="flex gap-3 mt-4">
                        <Button onClick={handleDownload}>Download Slip</Button>
                        <Button variant="outline" onClick={handleTryAgain}>Try Again</Button>
                    </div>
                </div>
            )}

            {/* Hidden slip layout */}
            <div className="h-0 overflow-hidden">
                <div
                    ref={slipRef}
                    style={{
                        width: "800px",
                        height: "800px",
                        padding: "40px",
                        backgroundColor: "#fff",
                        color: "#000",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold">PACKING SLIP</h2>
                            <p className="mt-2">Clean Bubble<br />BZU Uni<br />Multan</p>
                        </div>
                        <div className="text-right text-sm">
                            <p>clean-bubble.vercel.com</p>
                            <p>cleanbubble4@gmail.com</p>
                            <p>+91-9000000000</p>
                        </div>
                    </div>

                    <div className="flex justify-between border-b pb-4 mb-4">
                        <div className="max-w-[250px]">
                            <p className="font-semibold">BILL TO</p>
                            <p>{order.name}</p>
                            <p>{shipping?.address}</p>
                            <p>{shipping?.city}, {shipping?.state} {shipping?.zip}</p>
                            <p>{order.phone}</p>
                        </div>
                        <div className="max-w-[250px]">
                            <p className="font-semibold">SHIP TO</p>
                            <p>{order.name}</p>
                            <p>{shipping?.address}</p>
                            <p>{shipping?.city}, {shipping?.state} {shipping?.zip}</p>
                            <p>{order.phone}</p>
                        </div>
                    </div>

                    <div className="flex justify-between mb-4">
                        <div>
                            <p className="font-semibold">ORDER #{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="mt-2">Shipping: Express</p>
                            <p>Items: {order.totalItems}</p>
                        </div>
                        <div>
                            <p className="font-semibold">NOTES</p>
                            <p className="text-xs">Please handle with care</p>
                        </div>
                    </div>

                    <table className="w-full border-t pt-4">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2">ITEM DESCRIPTION</th>
                                <th className="py-2">QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.products.map((product, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover border"
                                            />
                                            <div>
                                                <p className="font-semibold">{product.name} - {product.size}</p>
                                                <p className="text-xs text-muted-foreground">Rs. {product.price}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2">x {product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p className="text-xs text-center mt-8">
                        If you have any questions, feel free to reach out to our support.
                        <br />
                        <span className="font-semibold">Thank you for your order, {order.name}!</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSlip;