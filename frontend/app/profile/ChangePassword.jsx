"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import cred from "@/mine.config";

import {
    Cat,
    Eye,
    EyeOff,
    CircleCheck,
    BadgeInfo
} from "lucide-react";
import confetti from "canvas-confetti";

const ChangePassword = () => {

    const initialValues = {
        prePassword: "",
        newPassword: "",
        confirmNewPassword: ""
    };

    const [formData, setFormData] = useState(initialValues);
    const [cannotUpdate, setCannotUpdate] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [changedPass, setChangedPass] = useState(false);


    // pass strength and is vailed checker
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


    useEffect(() => {
        const { newPassword } = formData;

        setOneLowerCase(/[a-z]/.test(newPassword));
        setOneUpperCase(/[A-Z]/.test(newPassword));
        setOneNumber(/\d/.test(newPassword));
        setOneSpecial(/[!@#$%^&*]/.test(newPassword));
        setSevenCher(newPassword.length >= 7);
    }, [formData.newPassword]);

    useEffect(() => {
        const { newPassword } = formData;

        // Allowed characters: uppercase, lowercase, numbers, and special chars !@#$%^&*
        const allowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*]+$/;

        setNoRandomCher(allowedCharsRegex.test(newPassword));
    }, [formData.newPassword]);

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


    useEffect(() => {
        const isInvalid =
            !validatePassword(formData.newPassword) ||
            formData.newPassword !== formData.confirmNewPassword ||
            formData.prePassword === "" ||
            formData.newPassword === "" ||
            formData.confirmNewPassword === "";

        setCannotUpdate(isInvalid);
    }, [formData]);

    const validatePassword = password => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{7,}$/.test(
            password
        );
    };




    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsUpdating(true)
            const response = await axios.post(`/api/fetch?url=${cred.backendURL}/api/change/password`, {
                prePassword: formData.prePassword,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmNewPassword
            }, {
                withCredentials: true
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setIsUpdating(false);
                setChangedPass(true);

                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

            }

        } catch (error) {
            setIsUpdating(false)
            console.log("error updating profile", error);
            if (error.response.data.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Unable to update profile, try again!");
            }
        }
    };

    return (
        changedPass ? (
            <div className="flex flex-col gap-2 items-center justify-center">

                <DialogHeader className='sr-only'>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Change your profile password!
                    </DialogDescription>
                </DialogHeader>

                <Cat size={88} className="animate-shake-twice" />

                <h2 className="text-2xl font-bold text-center">Changed!</h2>
                <p className="text-center">
                    You have successfully changed your account password.
                </p>

                <DialogClose className='mt-8 bg-foreground p-2 px-4 text-background rounded-md w-full font-bold'>Done</DialogClose>

            </div>
        ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <DialogHeader className='sr-only'>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Change your profile password!
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <label htmlFor="prePassword" className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>Previous Password</label>
                    <Input
                        name="prePassword"
                        type={showPass ? "password" : "text"}
                        placeholder="Previous Password"
                        value={formData.prePassword}
                        onChange={handleChange}
                        required
                        className="outline-none rounded-md border-none"
                    />

                    <div
                        onClick={() => {
                            setShowPass(prev => !prev);
                        }}
                        className='absolute right-2 top-[33px] cursor-pointer'
                    >
                        {showPass ? <Eye /> : <EyeOff />}
                    </div>
                </div>

                <div className='relative'>
                    <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5' htmlFor="newPassword">
                        New Password
                    </label>
                    <Input
                        type={showPass ? "password" : "text"}
                        name="newPassword"
                        className='outline-none rounded-md border-none'
                        value={formData.newPassword}
                        placeholder='New Password'
                        onChange={handleChange}
                        onFocus={() => setPassIns(true)}
                        onBlur={() => setPassIns(false)}
                        required
                    />

                    <div
                        onClick={() => {
                            setShowPass(prev => !prev);
                        }}
                        className='absolute right-2 top-[33px] cursor-pointer'
                    >
                        {showPass ? <Eye /> : <EyeOff />}
                    </div>

                    {passIns && (
                        <div className='absolute p-2 rounded-lg top-[-86px] right-2 h-[118px] bg-[#484848] flex flex-col gap-1'>
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
                <div>
                    <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5' htmlFor="confirmNewPassword">
                        Confirm New Password
                    </label>
                    <Input
                        type={showPass ? "password" : "text"}
                        name="confirmNewPassword"
                        className='outline-none rounded-md border-none'
                        value={formData.confirmNewPassword}
                        placeholder='Confirm New password'
                        onChange={handleChange}
                        required
                    />
                </div>



                <div className="mt-2 flex gap-4">
                    <DialogClose className="flex-1 border-2 border-muted rounded-md">
                        Cancel
                    </DialogClose>
                    <Button className="flex-1" disabled={cannotUpdate}>
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>
                </div>



                <p className="mt-6 text-dimmer-foreground text-xs">
                    <BadgeInfo className="inline-block mr-1" style={{ width: 14, height: 14 }} />
                    Dev Note: This is not a secure way to update the password! For better security, we should use an email provider (which may be costly) to send a link generated on the backend to the user's email. The user can then update the password by clicking the link, since only they have access to their email. It's just a small project so we doing this instead!
                </p>
            </form>
        ))
}


export default ChangePassword;