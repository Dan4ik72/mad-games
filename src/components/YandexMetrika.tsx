"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const METRIKA_ID = 106789020;

declare global {
    interface Window {
        ym: (...args: unknown[]) => void;
    }
}

export default function YandexMetrika() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window.ym === "function") {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
            window.ym(METRIKA_ID, "hit", url);
        }
    }, [pathname, searchParams]);

    return null;
}

/**
 * Вспомогательная функция для отправки целей из любого компонента.
 * Использование: import { reachGoal } from "@/components/YandexMetrika";
 *                reachGoal("play_game", { slug: "escape-tsunami" });
 */
export function reachGoal(target: string, params?: Record<string, unknown>) {
    if (typeof window !== "undefined" && typeof window.ym === "function") {
        window.ym(METRIKA_ID, "reachGoal", target, params);
    }
}
