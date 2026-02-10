"use client";

import Link from "next/link";
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
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-pink flex items-center justify-center shadow-lg group-hover:shadow-accent/30 transition-shadow duration-300">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5"
                            stroke="white"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="6,3 20,12 6,21" fill="white" stroke="none" />
                        </svg>
                    </div>
                    {/* Logo text */}
                    <span className="font-heading text-xl sm:text-2xl font-black tracking-tight gradient-text">
                        MAD GAMES
                    </span>
                </Link>

                {/* Future: navigation, search, etc. */}
                <nav className="hidden sm:flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm text-text-muted hover:text-text transition-colors duration-200"
                    >
                        Каталог
                    </Link>
                </nav>
            </div>
        </header>
    );
}
