'use client';

import { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import { toast } from "sonner";
import {
    DrawerDescription,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer";
import {
    CircleCheck,
    Eye,
    EyeOff,
    CircleArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/AuthStore/userStore.js";
import ForgotPass from "./ForgotPass/ForgotPass";

// mine config
import cred from "@/mine.config.js";

const AuthSection = () => {
    const { setUser } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({
        identifier: "",
        password: ""
    });
    const [signUpData, setSignUpData] = useState({
        fullName: "",
        email: "",
        phone: '',
        password: "",
        confirmPassword: ""
    });
    const [isSignUpValid, setIsSignUpValid] = useState(false);

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

    //login loader
    const [loginLoading, setLoginLoading] = useState(false);

    //signup loader
    const [signupLoading, setSignupLoading] = useState(false);

    useEffect(() => {
        const { password } = signUpData;

        setOneLowerCase(/[a-z]/.test(password));
        setOneUpperCase(/[A-Z]/.test(password));
        setOneNumber(/\d/.test(password));
        setOneSpecial(/[!@#$%^&*]/.test(password));
        setSevenCher(password.length >= 7);
    }, [signUpData.password]); // Runs whenever the password changes

    useEffect(() => {
        const { password } = signUpData;

        // Allowed characters: uppercase, lowercase, numbers, and special chars !@#$%^&*
        const allowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*]+$/;

        setNoRandomCher(allowedCharsRegex.test(password));
    }, [signUpData.password]);

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

    const validateEmail = email => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = password => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{7,}$/.test(
            password
        );
    };

    useEffect(() => {
        const isValid =
            signUpData.fullName.trim() !== "" &&
            validateEmail(signUpData.email) &&
            validatePassword(signUpData.password) &&
            signUpData.password === signUpData.confirmPassword;

        setIsSignUpValid(isValid);
    }, [signUpData]);

    const handleLoginSubmit = async e => {
        e.preventDefault();


        setLoginLoading(true);

        setTimeout(() => {
            setLoginLoading(false);
            console.log("LOGin data:", loginData);
        }, 2400);

        /*

        try {
            setLoginLoading(true);
            const response = await axios.post(
                "/api/mantox/auth/login",
                loginData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                localStorage.setItem("XMXYV2", "true");
                setUser(response.data.user);
                setLoginLoading(false);
                router.push("/home");
                toast.success(
                    `Welcome Back, ${response.data.user.displayName}`
                );
            } else {
                toast.warning(`${response.data.message}`);
            }
        } catch (error) {
            console.error("Error during login:", error);
            setLoginLoading(false);
            const errMsg =
                error.response?.data?.message ||
                "Oops... Something went wrong!";

            toast.warning(`${errMsg}`);
        }
            */
    };

    const handleSignUpSubmit = async e => {
        e.preventDefault();

        /*
        setSignupLoading(true);

        setTimeout(() => {
            setSignupLoading(false);
            console.log("Sign Up Data:", signUpData);
        }, 2400);

*/


        try {
            setSignupLoading(true);
            const response = await axios.post(
                `${cred.backendURL}/api/auth/signup`,
                signUpData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            if (response.data.success) {

                // setUser(response.data.user);
                //  router.push("/home");
                setSignupLoading(false);

                toast.success(`Welcome, ${response.data.user.fullName}!`);
            } else {
                toast.warning(`${response.data.message}`);
                setSignupLoading(false);
            }
        } catch (error) {
            if (error.response) {
                setSignupLoading(false);

                const errMsg =
                    error.response?.data?.message ||
                    "Oops... Something went wrong!";

                toast.warning(`${errMsg}`);

                console.log("Sign-up failed:", error.response.data.message);
            } else {
                console.error("Error during sign-up:", error);
            }
        }

    };

    return (
        <div className='p-6'>
            <DrawerHeader className='sr-only'>
                <DrawerTitle>login signup form</DrawerTitle>
                <DrawerDescription>
                    sign up and get started with animekun
                </DrawerDescription>
            </DrawerHeader>

            <div className='flex rounded-lg overflow-hidden mb-6'>
                <button
                    className={`flex-1 py-2 px-4 text-[17px] font-[700] transition-colors ${activeTab === "login"
                        ? "bg-foreground text-background"
                        : "bg-[#4c4c4c] text-[#979797] hover:bg-[#5e5d5d]"
                        }`}
                    onClick={() => setActiveTab("login")}
                >
                    Login
                </button>
                <button
                    className={`flex-1 py-2 px-4 text-[17px] font-[700]  transition-colors ${activeTab === "signup"
                        ? "bg-foreground text-background"
                        : "bg-[#4c4c4c] text-[#979797] hover:bg-[#5e5d5d]"
                        }`}
                    onClick={() => setActiveTab("signup")}
                >
                    Sign Up
                </button>
            </div>

            <div
                className={`transition-all duration-300 overflow-hidden ${activeTab === "login" ? "h-[260px]" : "h-[560px]"
                    }`}
            >
                {activeTab === "login" ? (
                    <form
                        onSubmit={handleLoginSubmit}
                        className='space-y-4 h-[260px]'
                    >
                        <div>
                            <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>
                                Email or Phone
                            </label>
                            <input
                                type='text'
                                className='w-full px-3 py-2 outline-none rounded-md bg-muted'
                                value={loginData.identifier}
                                placeholder='yourname@example.com'
                                onChange={e =>
                                    setLoginData({
                                        ...loginData,
                                        identifier: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                        <div className='relative'>
                            <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>
                                Password
                            </label>
                            <input
                                type={showPass ? "password" : "text"}
                                className='w-full px-3 py-2 outline-none rounded-md bg-muted pr-10'
                                value={loginData.password}
                                placeholder='paswo..'
                                onChange={e =>
                                    setLoginData({
                                        ...loginData,
                                        password: e.target.value
                                    })
                                }
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
                        </div>
                        <button
                            type='submit'
                            disabled={!loginData.identifier || !loginData.password}
                            className={`w-full font-bold py-2 rounded-md transition-colors flex gap-3 justify-center items-center
                                ${!loginData.identifier || !loginData.password
                                    ? "cursor-not-allowed bg-dimmer-foreground text-[#393939]"
                                    : "bg-foreground text-background cursor-pointer"
                                }
                                `}
                        >
                            {loginLoading ? (
                                <div className='flex gap-2 justify-center items-center'>
                                    <svg className='idk' viewBox='25 25 50 50'>
                                        <circle
                                            className='hmmxiox'
                                            r='20'
                                            cy='50'
                                            cx='50'
                                        ></circle>
                                    </svg>
                                    <span>Logging You In...</span>
                                </div>
                            ) : (
                                <div className='flex gap-2 justify-center items-center'>
                                    <CircleArrowRight />
                                    <span>Log In</span>
                                </div>
                            )}
                        </button>

                        <div className='flex justify-end'>
                            <ForgotPass />
                        </div>
                    </form>
                ) : (
                    <form
                        onSubmit={handleSignUpSubmit}
                        className='space-y-4 h-[560px]'
                    >
                        <div>
                            <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>
                                Full Name
                            </label>
                            <input
                                type='text'
                                className='w-full px-3 py-2 outline-none rounded-md bg-muted'
                                value={signUpData.fullName}
                                placeholder='Monkey D. Luffy'
                                onChange={e =>
                                    setSignUpData({
                                        ...signUpData,
                                        fullName: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>
                                Email
                            </label>
                            <input
                                type='email'
                                className='w-full px-3 py-2 outline-none rounded-md bg-muted'
                                value={signUpData.email}
                                placeholder='yourname@example.com'
                                onChange={e =>
                                    setSignUpData({
                                        ...signUpData,
                                        email: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>
                                Phone (Optional)
                            </label>
                            <div className="flex gap-4">
                                <div className="flex gap-1 items-center">
                                    <img src="/pk-flag.png" alt="Pakistan Flag" className="h-4" />
                                    <span>+92</span>
                                </div>
                                <input
                                    type='tel'
                                    className='w-full px-3 py-2 outline-none rounded-md bg-muted'
                                    value={signUpData.phone}
                                    placeholder='123-456-7890'
                                    onChange={e =>
                                        setSignUpData({
                                            ...signUpData,
                                            phone: e.target.value
                                        })
                                    }
                                />
                            </div>

                        </div>

                        <div className='relative'>
                            <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>
                                Password
                            </label>
                            <input
                                type={showPass ? "password" : "text"}
                                className='w-full px-3 pr-10 py-2 outline-none rounded-md bg-muted'
                                value={signUpData.password}
                                placeholder='pass..'
                                onChange={e =>
                                    setSignUpData({
                                        ...signUpData,
                                        password: e.target.value
                                    })
                                }
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
                            <label className='block text-foreground font-semibold mb-1 text-[14px] ml-0.5'>
                                Confirm Password
                            </label>
                            <input
                                type={showPass ? "password" : "text"}
                                className='w-full px-3 py-2 outline-none rounded-md bg-muted'
                                value={signUpData.confirmPassword}
                                placeholder='Confirm pass...'
                                onChange={e =>
                                    setSignUpData({
                                        ...signUpData,
                                        confirmPassword: e.target.value
                                    })
                                }
                                required
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={!isSignUpValid}
                            className={`w-full py-2 rounded-md font-bold transition-colors ${isSignUpValid
                                ? "bg-foreground text-background cursor-pointer"
                                : "bg-dimmer-foreground text-[#393939] cursor-not-allowed"
                                }`}
                        >
                            {signupLoading ? (
                                <div className='flex gap-2 justify-center items-center'>
                                    <svg className='idk' viewBox='25 25 50 50'>
                                        <circle
                                            className='hmmxiox'
                                            r='20'
                                            cy='50'
                                            cx='50'
                                        ></circle>
                                    </svg>
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                <div className='flex gap-2 justify-center items-center'>
                                    <CircleArrowRight />
                                    <span>Sign Up</span>
                                </div>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthSection;