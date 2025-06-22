import Link from "next/link";
import { ShoppingCart, Menu } from 'lucide-react';
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

export default function MainHeader() {
    return (
        <header className="absolute z-50 w-full top-0 left-0 h-16 px-4">
            <div className="w-full h-16 flex items-center justify-between  max-w-[1200px] mx-auto">
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

                    < LoginORprofileButton />
                </div>
            </div>
        </header>
    );
}
