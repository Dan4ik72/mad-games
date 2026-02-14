"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/categories";
import {
    Gamepad2,
    Coffee,
    Crosshair,
    Activity,
    Home,
    Menu,
    ChevronLeft,
    ChevronRight,
    LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Gamepad2,
    Coffee,
    Crosshair,
    Activity,
};

export default function Sidebar() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    // On desktop, we default to expanded, but for this implementation
    // and to match the requested "mobile behavior", we'll control it via CSS/state.
    // Actually, distinct behavior:
    // Mobile: collapsed (icons), expand on hover/click.
    // Desktop: let's keep it expanded by default or use the same logic.
    // User asked for specific mobile behavior. Let's make it responsive.

    const navItems = [
        { name: "Главная", href: "/", icon: Home },
        ...categories.map((cat) => ({
            name: cat.name,
            href: `/category/${cat.slug}`,
            icon: iconMap[cat.icon] || Gamepad2,
        })),
    ];

    return (
        <aside
            className={`fixed left-0 top-16 bottom-0 z-40 bg-background-secondary/95 backdrop-blur-md border-r border-border transition-all duration-300 ease-in-out
                ${isExpanded ? "w-64 shadow-2xl" : "w-14 md:w-64"}
                group
            `}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex flex-col h-full py-4">
                {/* Toggle button (visible on mobile only) */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="md:hidden absolute -right-3 top-6 bg-card border border-border rounded-full p-1 text-text-muted hover:text-text hover:border-accent transition-colors shadow-md z-50"
                >
                    {isExpanded ? (
                        <ChevronLeft size={14} />
                    ) : (
                        <ChevronRight size={14} />
                    )}
                </button>

                <nav className="flex-1 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsExpanded(false)} // Close on click (mobile)
                                className={`flex items-center gap-4 px-2 py-3 mx-2 rounded-xl transition-all duration-200 group-hover:justify-start
                                    ${isActive
                                        ? "bg-accent/10 text-accent"
                                        : "text-text-muted hover:text-text hover:bg-white/5"
                                    }
                                `}
                            >
                                <Icon
                                    size={24}
                                    className={`min-w-[24px] transition-colors ${isActive
                                        ? "text-accent"
                                        : "text-text-muted group-hover:text-text"
                                        }`}
                                />
                                <span
                                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 origin-left
                                        ${isExpanded
                                            ? "opacity-100 max-w-[200px] translate-x-0"
                                            : "opacity-0 max-w-0 -translate-x-4 md:opacity-100 md:max-w-[200px] md:translate-x-0"
                                        }
                                    `}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
