"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${scrolled ? "glass-strong shadow-lg" : "glass-strong"
                }`}
            style={{
                backgroundColor: scrolled
                    ? "rgba(7, 8, 13, 0.95)"
                    : "rgba(7, 8, 13, 0.8)",
            }}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    {/* Logo icon */}
                    <div className="relative w-13 h-13 rounded-xl overflow-hidden shadow-lg group-hover:shadow-accent/30 transition-shadow duration-300">
                        <Image
                            src="/logo.png"
                            alt="MAD GAMES"
                            width={52}
                            height={52}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Logo text */}
                    <span className="font-heading text-xl sm:text-2xl font-black tracking-tight gradient-text">
                        MAD GAMES
                    </span>
                </Link>

                {/* Future: navigation, search, etc. */}
                {/* Navigation moved to Sidebar */}
                <div className="hidden sm:block"></div>
            </div>
        </header>
    );
}
