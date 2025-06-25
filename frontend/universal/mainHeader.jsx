import Link from "next/link";
import { Menu } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LoginORprofileButton from "./LoginORprofileButton";


// cart
import Cart from "./Cart";


// order success ui
import OrderSuccessUI from "./OrderSuccessUI";

// notification ui
import Notifications from "./Notifications";


export default function MainHeader() {


    return (
        <header className="absolute z-50 w-full top-0 left-0 h-16 px-4">
            <div className="w-full h-full relative">
                <div className="absolute top-0 right-0 left-0 bottom-0 z-40 w-full h-16 flex items-center justify-between  max-w-[1200px] mx-auto">
                    <div className="flex items-center gap-6">

                        <DropdownMenu>
                            <DropdownMenuTrigger className="md:hidden"><Menu size={26} /></DropdownMenuTrigger>
                            <DropdownMenuContent className="ml-2">
                                <DropdownMenuLabel>Nevigation Menu</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="#" className="font-semibold">
                                        Our Story
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="#" className="font-semibold">
                                        Contact
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="#" className="font-semibold">
                                        Terms
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="#" className="font-semibold hidden md:block">
                            Our Story
                        </Link>
                        <Link href="#" className="font-semibold hidden md:block">
                            Contact
                        </Link>
                        <Link href="#" className="font-semibold hidden md:block">
                            Terms
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Cart />

                        <LoginORprofileButton />

                        <OrderSuccessUI />

                        <Notifications />
                    </div>
                </div>


                <div className="flex items-center justify-center relative h-1">
                    <Link href="/" className="w-60 h-60 md:w-80 md:h-80 rounded-full border-2 border-muted  flex items-center justify-center absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                        <div className="relative z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center cursor-not-allowed">
                            <img
                                src="/clean-bubble-logo.png"
                                alt="Clean Bubble Logo"
                                className="w-16 h-16 mt-22"
                            />
                        </div>
                    </Link>
                </div>

            </div>
        </header>
    );
}
