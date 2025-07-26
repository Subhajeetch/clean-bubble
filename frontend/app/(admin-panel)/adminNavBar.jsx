'use client';

import { useState, useEffect, useRef } from "react";
import { Home, BadgeInfo, Package, Users, LogOut, Store, X, Star, UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbBrandWindowsFilled } from "react-icons/tb";

const NAV_LINKS = [
    { label: "Overview", icon: <Home />, href: "/admin/overview" },
    { label: "Orders", icon: <Package />, href: "/admin/orders" },
    { label: "Store", icon: <Store />, href: "/admin/store" },
    { label: "Users", icon: <Users />, href: "/admin/users" },
    { label: "Reviews", icon: <Star />, href: "/admin/reviews" },
    { label: "Team", icon: <UserCog />, href: "/admin/team" }
];

function currentIcon(pathname) {
    if (pathname.startsWith("/admin/order/")) return <Package />;
    const found = NAV_LINKS.find((link) => link.href === pathname);
    return found ? found.icon : <BadgeInfo />;
}

export default function AdminNavBar() {
    const [open, setOpen] = useState(false);
    const [pathname, setPathname] = useState("");
    const path = usePathname();
    const navRef = useRef(null);

    useEffect(() => {
        setPathname(path);
    }, [path]);

    const handleCloseNavBar = () => {
        setOpen(false);
    };

    // lock scroll when nav is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // close nav when clicking outside
    useEffect(() => {
        if (!open) return;
        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                handleCloseNavBar();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);


    const currentPage =
        NAV_LINKS.find((link) => link.href === pathname)?.label ||
        (pathname.startsWith("/admin/order/") ? "Order Info" : pathname.startsWith("/admin/edit/user/") ? "User Info" : pathname.startsWith("/admin/edit/review") ? "Review Info" : pathname.replace("/admin/", "").replace(/^\w/, c => c.toUpperCase())) ||
        "Dashboard";

    return (
        <nav
            ref={navRef}
            className={`
                fixed bottom-8 left-1/2 z-50
                transition-all duration-300
                ${open ? "w-[94%] md:w-[466px] lg:w-[780px] md:h-[304px] lg:h-[200px] h-[406px] p-3 " : "h-17 w-60"}
                -translate-x-1/2
                rounded-3xl shadow-2xl overflow-hidden
                flex flex-col items-center
                bg-[#33333349] backdrop-blur-md border border-white/30
                hover:shadow-3xl
            `}
            style={{
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(8px)",
            }}
        >
            <button
                className={`
                    absolute top-3 right-3 p-2 rounded-full bg-[#e9e9e9c7] hover:bg-white/80 transition
                    text-black
                `}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close navigation" : "Open navigation"}
            >
                {open ? <X size={26} /> : <TbBrandWindowsFilled size={26} />}
            </button>
            <div className="flex flex-col w-full mt-4 flex-1">
                {open ? (
                    <>
                        <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {NAV_LINKS.map((link) => (
                                <li key={link.label}
                                    onClick={handleCloseNavBar}
                                >
                                    <Link
                                        href={link.href}
                                        className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg text-lg font-medium transition
                                        ${pathname === link.href
                                                ? "bg-indigo-600/90 text-white shadow"
                                                : "text-foreground hover:bg-[#57575760]"}
                                    `}
                                    >
                                        <span className={pathname === link.href ? "text-white" : "text-indigo-600"}>{link.icon}</span>
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}

                        </ul>
                        <div className="pt-4 border-t border-white/30 mt-2">
                            <button className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-red-600 hover:bg-[#57575760] transition w-full">
                                <LogOut className="text-red-600" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <div
                            className="flex items-center gap-3 pt-0.5 px-4 pr-20 rounded-lg text-lg font-medium text-foreground"
                        >
                            <span className="text-indigo-600">{currentIcon(pathname)}</span>
                            <span>{currentPage}</span>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}