import { useEffect, useState } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

const STATUS_STEPS = ["ordered", "confirmed", "shipped", "delivered"];

const OrderProgress = ({ currentStatus }) => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const targetIndex = STATUS_STEPS.indexOf(currentStatus);
        let step = 0;
        const interval = setInterval(() => {
            if (step <= targetIndex) {
                setActiveStep(step);
                step++;
            } else {
                clearInterval(interval);
            }
        }, 400);
        return () => clearInterval(interval);
    }, [currentStatus]);


    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'ordered':
                return {
                    indicator: 'rgba(185, 225, 80, 1)',      // dim lime-green
                    background: 'rgba(185, 225, 80, 0.2)',
                };
            case 'confirmed':
                return {
                    indicator: 'rgba(100, 180, 230, 1)',     // soft blue
                    background: 'rgba(100, 180, 230, 0.2)',
                };
            case 'shipped':
                return {
                    indicator: 'rgba(240, 180, 50, 1)',      // muted amber
                    background: 'rgba(240, 180, 50, 0.2)',
                };
            case 'delivered':
                return {
                    indicator: 'rgba(90, 160, 90, 1)',       // mellow green
                    background: 'rgba(90, 160, 90, 0.2)',
                };
            case 'cancelled':
                return {
                    indicator: 'rgba(220, 80, 80, 1)',       // soft red
                    background: 'rgba(220, 80, 80, 0.2)',
                };
            default:
                return {
                    indicator: '#bbb',                      // lighter gray
                    background: 'rgba(0,0,0,0.05)',
                };
        }
    };

    const statusColors = getOrderStatusColor(currentStatus);

    return (
        <div className="w-full md:px-4 py-6">
            <div className="relative">
                {/* Background bar */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 z-0 rounded-full mx-5" />

                {/* Progress bar */}
                <div className="flex justify-center w-full absolute top-4 z-10">
                    <div className="w-full mx-5">
                        <div
                            className="h-1 z-10 rounded-full transition-all duration-500"
                            style={{
                                width: `${(activeStep / (STATUS_STEPS.length - 1)) * 100}%`,
                                backgroundColor: statusColors.indicator
                            }}
                        />
                    </div>
                </div>


                {/* Steps */}
                <div className="flex justify-between relative z-20">
                    {STATUS_STEPS.map((step, idx) => {
                        const isActive = idx <= activeStep;
                        return (
                            <div key={step} className="flex flex-col items-center">
                                <div
                                    className={clsx(
                                        "w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all",
                                        !isActive && "bg-white border-gray-400 text-gray-400"
                                    )}
                                    style={
                                        isActive
                                            ? {
                                                backgroundColor: statusColors.indicator,
                                                borderColor: statusColors.indicator,
                                                color: "black",
                                            }
                                            : {}
                                    }
                                >
                                    {isActive ? <Check size={18} /> : idx + 1}
                                </div>

                                <p
                                    className={clsx(
                                        "md:text-sm text-xs mt-2 capitalize text-center font-medium",
                                        !isActive && "text-gray-400"
                                    )}
                                    style={isActive ? { color: statusColors.indicator } : {}}
                                >

                                    {step}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderProgress;
