"use client";

import { Game } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

interface GameCardProps {
    game: Game;
    index?: number;
}

export default function GameCard({ game, index = 0 }: GameCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <Link
            href={`/game/${game.slug}`}
            className="group block animate-slide-up"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`relative aspect-video rounded-2xl overflow-hidden transition-all duration-200 border-2 ${isHovered
                        ? "border-accent shadow-[0_8px_40px_rgba(124,58,237,0.2)] scale-[1.03]"
                        : "border-transparent"
                    }`}
            >
                {/* Cover image */}
                <Image
                    src={game.coverUrl}
                    alt={game.title}
                    fill
                    className={`object-cover transition-opacity duration-150 ${isHovered && game.previewVideoUrl ? "opacity-0" : "opacity-100"
                        }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Preview video */}
                {game.previewVideoUrl && (
                    <video
                        ref={videoRef}
                        src={game.previewVideoUrl}
                        muted
                        loop
                        playsInline
                        preload="none"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ${isHovered ? "opacity-100" : "opacity-0"
                            }`}
                    />
                )}

                {/* Title — small, bottom-left corner */}
                <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-xs font-medium text-white/90 truncate drop-shadow-lg">
                        {game.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
