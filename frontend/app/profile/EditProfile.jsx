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
import useAuthStore from "@/AuthStore/userStore";
import { toast } from "sonner";
import axios from "axios";
import cred from "@/mine.config";

import { Cat } from "lucide-react";

import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const EditProfile = () => {
    const { user, setUser } = useAuthStore();

    // Store initial values for comparison
    const initialValues = {
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || ""
    };

    const [formData, setFormData] = useState(initialValues);
    const [cannotUpdate, setCannotUpdate] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileUpdated, setProfileUpdated] = useState(false);

    const router = useRouter();

    // Enable update only if formData is different from initialValues
    useEffect(() => {
        const changed =
            formData.fullName !== initialValues.fullName ||
            formData.email !== initialValues.email ||
            formData.phone !== initialValues.phone;
        setCannotUpdate(!changed);
    }, [formData, initialValues.fullName, initialValues.email, initialValues.phone]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsUpdating(true)
            const response = await axios.post(`/api/fetch?url=${cred.backendURL}/api/edit/profile`, {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone
            }, {
                withCredentials: true
            })

            if (response.data.success) {
                setUser(response.data.user);
                toast.success(response.data.message)
                setIsUpdating(false);
                setProfileUpdated(true)

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
        profileUpdated ? (
            <div className="flex flex-col gap-2 items-center justify-center">

                <DialogHeader className='sr-only'>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information.
                    </DialogDescription>
                </DialogHeader>

                <Cat size={88} className="animate-shake-twice" />

                <h2 className="text-2xl font-bold">Updated!</h2>
                <p>
                    You have successfully updated your account.
                </p>

                <DialogClose className='mt-8 bg-foreground p-2 px-4 text-background rounded-md w-full font-bold'>Done</DialogClose>

            </div>
        ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <label htmlFor="fullName" className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>Full Name</label>
                    <Input
                        name="fullName"
                        type="text"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        pattern="^[a-zA-Z\s]+$"
                        title="Please enter a valid name (letters and spaces only)"
                        className="outline-none rounded-md border-none"
                    />
                </div>

                <div>
                    <label htmlFor="email" className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>Email</label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="yourname@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="outline-none rounded-md border-none"
                    />
                </div>

                <div>
                    <label htmlFor="phone"
                        className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'
                    >Phone Number</label>
                    <div className="flex gap-4 ml-1">
                        <div className="flex gap-1 items-center">
                            <img src="/pk-flag.png" alt="Pakistan Flag" className="h-4" />
                            <span>+92</span>
                        </div>
                        <Input
                            name="phone"
                            type="tel"
                            placeholder="Phone (eg: XXXXXXXXXX)"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="^[0-9]{10}$"
                            title="Please enter a valid phone number in the format 3XXXXXXXXX"
                            className="outline-none rounded-md border-none"
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <DialogClose className="flex-1 border-2 border-muted rounded-md">
                        Cancel
                    </DialogClose>
                    <Button className="flex-1" disabled={cannotUpdate}>
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>
                </div>
            </form>

        ))
}


export default EditProfile;