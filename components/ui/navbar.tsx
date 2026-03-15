"use client";

import Link from "next/link";

import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
        if (window.innerWidth >= 768) {
            setMobileOpen(false);
        }
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-white shadow">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <Link href="/" className="hover:text-blue-600">
                    3D Prints
                </Link>
                <div className="hidden md:flex space-x-6">
                    <Link href="/" className="block hover:text-blue-600">Home</Link>
                    <Link href="/prints" className="hover:text-blue-600">Prints</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        className="md:hidden"
                        onClick={() => setMobileOpen((prev) => !prev)} >
                        { mobileOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </div>
            { mobileOpen && (
                <nav className="md:hidden bg-white shadow-md">
                    <ul className="flex flex-col p-4 space-y-2">
                        <li>
                            <Link href="/" className="block hover:text-blue-600">Home</Link>
                        </li>
                        <li>
                            <Link href="/prints" className="hover:text-blue-600">Prints</Link>
                        </li>
                    </ul>
                </nav>
            ) }
        </nav>
    );
};