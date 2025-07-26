import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import {
    CheckCircle,
    CircleCheck,
    Eye,
    EyeOff,
    CircleArrowRight
} from "lucide-react";

import { toast } from "sonner";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DialogClose } from "@/components/ui/dialog";

import cred from "@/mine.config";

const ForgotPasswordFlow = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [completedSteps, setCompletedSteps] = useState({});

    // Step 1 State
    const [email, setEmail] = useState("");

    // Step 2 State
    const [otp, setOtp] = useState("");

    // Step 3 State
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passIns, setPassIns] = useState(false);
    const [showPass, setShowPass] = useState(true);

    const [passStrength, setPassStrength] = useState(0);
    const [passStrengthText, setPassStrengthText] = useState("");

    //password checker
    const [oneUpperCase, setOneUpperCase] = useState(false);
    const [oneLowerCase, setOneLowerCase] = useState(false);
    const [oneNumber, setOneNumber] = useState(false);
    const [oneSpecial, setOneSpecial] = useState(false);
    const [sevenCher, setSevenCher] = useState(false);
    const [noRandomCher, setNoRandomCher] = useState(true);

    const steps = ["1", "2", "3", "4"];

    const markStepCompleted = step => {
        setCompletedSteps(prev => ({ ...prev, [step]: true }));
    };

    const handleStep1 = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${cred.backendURL}/api/fpass/verify-email`,
                {
                    email
                }
            );

            if (response.data.success) {
                markStepCompleted(1);
                setCurrentStep(2);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err?.message ||
                "Something went wrong, try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStep2 = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${cred.backendURL}/api/fpass/verify-otp`, {
                email,
                otp
            });

            if (response.data.success) {
                markStepCompleted(2);
                setCurrentStep(3);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err?.message ||
                "Something went wrong, try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStep3 = async () => {
        try {
            if (newPassword !== confirmPassword) {
                setError("Passwords do not match");
                toast.error("Passwords do not match");
                return;
            }

            setLoading(true);
            const response = await axios.post(`${cred.backendURL}/api/fpass/change-pass`, {
                email,
                newPassword,
                confirmNewPassword: confirmPassword
            });

            if (response.data.success) {
                markStepCompleted(3);
                setCurrentStep(4);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err?.message ||
                "Something went wrong, try again."
            );
        } finally {
            setLoading(false);
        }
    };

    //for step 3
    useEffect(() => {
        const password = newPassword;

        setOneLowerCase(/[a-z]/.test(password));
        setOneUpperCase(/[A-Z]/.test(password));
        setOneNumber(/\d/.test(password));
        setOneSpecial(/[!@#$%^&*]/.test(password));
        setSevenCher(password.length >= 7);

        const allowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*]+$/;
        setNoRandomCher(allowedCharsRegex.test(password));
    }, [newPassword]);

    //pass strength checker
    useEffect(() => {
        let strength = 0;

        if (oneLowerCase) strength++;
        if (oneUpperCase) strength++;
        if (oneNumber) strength++;
        if (oneSpecial) strength++;
        if (sevenCher) strength++;

        setPassStrength(strength);
    }, [oneLowerCase, oneUpperCase, oneNumber, oneSpecial, sevenCher]);

    useEffect(() => {
        let str = "";

        if (passStrength > 0) str = "Very Weak";
        if (passStrength > 1) str = "Weak";
        if (passStrength > 2) str = "Still a little weak";
        if (passStrength > 3) str = "Little bit more...";
        if (passStrength > 4) str = "Strong";

        setPassStrengthText(str);
    }, [passStrength]);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className=''>
                        <h2 className='mb-8 mt-3 text-[20px] text-center font-bold'>
                            Enter your email
                        </h2>
                        <p className='font-semibold ml-1 mb-2'>Email Address</p>
                        <Input
                            type='email'
                            placeholder='Enter your email address'
                            className='w-full mb-4 bg-backgroundtwo'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Button
                            onClick={handleStep1}
                            disabled={loading || !email || !isValidEmail(email)}
                            className='w-full text-background bg-foreground'
                        >
                            {loading ? (
                                <div className='flex gap-2 justify-center items-center'>
                                    <svg className='idk' viewBox='25 25 50 50'>
                                        <circle
                                            className='hmmx'
                                            r='20'
                                            cy='50'
                                            cx='50'
                                        ></circle>
                                    </svg>
                                    <span className='font-bold'>
                                        Verifying email...
                                    </span>
                                </div>
                            ) : (
                                <div className='flex gap-2 justify-center items-center'>
                                    <CircleArrowRight />{" "}
                                    <strong>Send OTP</strong>
                                </div>
                            )}
                        </Button>
                    </div>
                );
            case 2:
                return (
                    <div className='space-y-4'>
                        <h2 className='mb-8 mt-3 text-[20px] text-center font-bold'>
                            Verify OTP
                        </h2>
                        <p className='text-center'>
                            We have sent an OTP to <strong>{email}</strong>. If
                            you can't find the email, you might wanna check your{" "}
                            <strong className='underline'>Spam Folder</strong>.
                        </p>

                        <div className='flex justify-center'>
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={value => setOtp(value)}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot
                                        className='bg-backgroundtwo'
                                        index={0}
                                    />
                                    <InputOTPSlot
                                        className='bg-backgroundtwo'
                                        index={1}
                                    />
                                    <InputOTPSlot
                                        className='bg-backgroundtwo'
                                        index={2}
                                    />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot
                                        className='bg-backgroundtwo'
                                        index={3}
                                    />
                                    <InputOTPSlot
                                        className='bg-backgroundtwo'
                                        index={4}
                                    />
                                    <InputOTPSlot
                                        className='bg-backgroundtwo'
                                        index={5}
                                    />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <Button
                            onClick={handleStep2}
                            disabled={loading || !otp || otp.length !== 6}
                            className='w-full bg-foreground text-background'
                        >
                            {loading ? (
                                <div className='flex gap-2 justify-center items-center'>
                                    <svg className='idk' viewBox='25 25 50 50'>
                                        <circle
                                            className='hmmx'
                                            r='20'
                                            cy='50'
                                            cx='50'
                                        ></circle>
                                    </svg>
                                    <span className='font-bold'>
                                        Verifying...
                                    </span>
                                </div>
                            ) : (
                                <div className='flex gap-2 justify-center items-center'>
                                    <CircleArrowRight />{" "}
                                    <strong>Verify OTP</strong>
                                </div>
                            )}
                        </Button>
                    </div>
                );
            case 3:
                return (
                    <div className=''>
                        <h2 className='mb-8 mt-3 text-[20px] text-center font-bold'>
                            Change Your Password
                        </h2>

                        <div className='relative'>
                            <label className='block text-foreground font-semibold mb-1 text-[14px] ml-1'>
                                New Password
                            </label>
                            <div className='relative'>
                                <Input
                                    type={showPass ? "password" : "text"}
                                    className='w-full pr-10 bg-backgroundtwo'
                                    value={newPassword}
                                    placeholder='strong pass...'
                                    onChange={e => setNewPassword(e.target.value)}
                                    onFocus={() => setPassIns(true)}
                                    onBlur={() => setPassIns(false)}
                                    required
                                />

                                <div
                                    onClick={() => {
                                        setShowPass(prev => !prev);
                                    }}
                                    className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                >
                                    {showPass ? <Eye /> : <EyeOff />}
                                </div>
                            </div>

                            {passIns && (
                                <div className='absolute p-2 rounded-lg top-[-86px] right-2 h-[118px] bg-[#484848] flex flex-col gap-1 z-10'>
                                    <p
                                        className={`flex text-[9px] gap-1 ${oneUpperCase
                                            ? "text-foreground"
                                            : "text-[#888888]"
                                            }`}
                                    >
                                        <CircleCheck
                                            className={`
                                        ${oneUpperCase ? "text-[#08ff40]" : ""}
                                        `}
                                            size={14}
                                        />{" "}
                                        <span>
                                            Atleast 1 uppercase letter (eg: A,
                                            B)
                                        </span>
                                    </p>

                                    <p
                                        className={`flex text-[9px] gap-1
                                    ${oneLowerCase
                                                ? "text-foreground"
                                                : "text-[#888888]"
                                            }
                                    `}
                                    >
                                        <CircleCheck
                                            className={`
                                        ${oneLowerCase ? "text-[#08ff40]" : ""}
                                        `}
                                            size={14}
                                        />{" "}
                                        <span>
                                            Atleast 1 lowercase letter (eg: a,
                                            b)
                                        </span>
                                    </p>

                                    <p
                                        className={`flex text-[9px] gap-1
                                    ${oneNumber
                                                ? "text-foreground"
                                                : "text-[#888888]"
                                            }
                                    `}
                                    >
                                        <CircleCheck
                                            className={`
                                        ${oneNumber ? "text-[#08ff40]" : ""}
                                        `}
                                            size={14}
                                        />{" "}
                                        <span>Atleast 1 number (eg: 1, 2)</span>
                                    </p>

                                    <p
                                        className={`flex text-[9px] gap-1
                                    ${oneSpecial
                                                ? "text-foreground"
                                                : "text-[#888888]"
                                            }
                                    `}
                                    >
                                        <CircleCheck
                                            className={`
                                        ${oneSpecial ? "text-[#08ff40]" : ""}
                                        `}
                                            size={14}
                                        />{" "}
                                        <span>
                                            Atleast 1 special cherecter (eg: @,
                                            $)
                                        </span>
                                    </p>
                                    <p
                                        className={`flex text-[9px] gap-1
                                    ${sevenCher
                                                ? "text-foreground"
                                                : "text-[#888888]"
                                            }
                                    `}
                                    >
                                        <CircleCheck
                                            className={`
                                        ${sevenCher ? "text-[#08ff40]" : ""}
                                        `}
                                            size={14}
                                        />{" "}
                                        <span>
                                            Must contain at least 7 characters
                                        </span>
                                    </p>
                                    <p
                                        className={`flex text-[9px] gap-1
                                    ${noRandomCher
                                                ? "text-foreground"
                                                : "text-[#888888]"
                                            }
                                    `}
                                    >
                                        <CircleCheck
                                            className={`
                                        ${noRandomCher ? "text-[#08ff40]" : ""}
                                        `}
                                            size={14}
                                        />{" "}
                                        <span>
                                            No random cherecters (eg: :, ?)
                                        </span>
                                    </p>
                                </div>
                            )}

                            <div className='flex gap-1 mt-1 px-1.5'>
                                <div
                                    className={`h-2 rounded-full flex-1 ${passStrength > 0
                                        ? "bg-red-500"
                                        : "bg-[#484848]"
                                        }`}
                                ></div>
                                <div
                                    className={`h-2 rounded-full flex-1 ${passStrength > 1
                                        ? "bg-orange-400"
                                        : "bg-[#484848]"
                                        }`}
                                ></div>
                                <div
                                    className={`h-2 rounded-full flex-1 ${passStrength > 2
                                        ? "bg-yellow-300"
                                        : "bg-[#484848]"
                                        }`}
                                ></div>
                                <div
                                    className={`h-2 rounded-full flex-1 ${passStrength > 3
                                        ? "bg-blue-300"
                                        : "bg-[#484848]"
                                        }`}
                                ></div>
                                <div
                                    className={`h-2 rounded-full flex-1 ${passStrength > 4
                                        ? "bg-green-500"
                                        : "bg-[#484848]"
                                        }`}
                                ></div>
                            </div>
                            <p className='text-right mr-2 text-[12px] font-semibold'>
                                {passStrengthText}
                            </p>
                        </div>

                        <p className='font-semibold ml-1 mt-4 mb-2'>
                            Confirm New Password
                        </p>
                        <Input
                            type={showPass ? "password" : "text"}
                            placeholder='confirm password...'
                            className='w-full mb-4 bg-backgroundtwo'
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />

                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className='text-red-500 text-sm mb-2 ml-1'>
                                Passwords do not match
                            </p>
                        )}

                        <Button
                            onClick={handleStep3}
                            disabled={
                                loading ||
                                !newPassword ||
                                !confirmPassword ||
                                newPassword !== confirmPassword ||
                                passStrength < 5 ||
                                !noRandomCher
                            }
                            className='w-full bg-foreground text-background'
                        >
                            {loading ? (
                                <div className='flex gap-2 justify-center items-center'>
                                    <svg className='idk' viewBox='25 25 50 50'>
                                        <circle
                                            className='hmmx'
                                            r='20'
                                            cy='50'
                                            cx='50'
                                        ></circle>
                                    </svg>
                                    <span className='font-bold'>
                                        Changing password...
                                    </span>
                                </div>
                            ) : (
                                <div className='flex gap-2 justify-center items-center'>
                                    <CircleArrowRight />{" "}
                                    <strong>Change Password</strong>
                                </div>
                            )}
                        </Button>
                    </div>
                );
            case 4:
                return (
                    <div className='text-center space-y-4 py-14'>
                        <CheckCircle className='w-16 h-16 text-green-500 mx-auto' />
                        <h2 className='text-xl font-bold'>
                            Password Changed Successfully!
                        </h2>
                        <p className='text-gray-600'>
                            You can now login with your new password.
                        </p>

                        <DialogClose className="bg-foreground text-background px-6 py-2 rounded-md font-semibold">
                            Done
                        </DialogClose>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleNext = () => {
        if (currentStep < 4 && completedSteps[currentStep]) {
            setCurrentStep(prev => prev + 1);
        }
    };

    return (
        <div className='p-2 bg-background'>
            <div className='flex justify-between mb-8'>
                {steps.map((step, index) => (
                    <div
                        key={step}
                        className={`flex-1 text-center flex justify-center items-center border-b-2 pb-2 ${index + 1 === currentStep
                            ? "border-foreground font-bold"
                            : "border-muted"
                            }`}
                    >
                        <div className='bg-foreground rounded-full text-background px-2'>
                            {step}
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-between mb-4'>
                <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(p => p - 1)}
                    disabled={currentStep === 1 || loading}
                    className='text-foreground font-bold disabled:text-gray-400 disabled:font-[400]'
                >
                    Previous
                </Button>
                <span className='text-foreground'>
                    Step <strong>{currentStep}</strong> of {steps.length}
                </span>
                <Button
                    variant="ghost"
                    onClick={handleNext}
                    disabled={!completedSteps[currentStep] || loading || currentStep === 4}
                    className='text-foreground font-bold disabled:text-gray-400 disabled:font-[400]'
                >
                    Next
                </Button>
            </div>

            {renderStep()}
        </div>
    );
};

export default ForgotPasswordFlow;
