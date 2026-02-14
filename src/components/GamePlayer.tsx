"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import Image from "next/image";
import { reachGoal } from "@/components/YandexMetrika";

interface GamePlayerProps {
    buildFolder: string;
    buildName: string;
    title: string;
    coverUrl: string;
    previewVideoUrl?: string;
    slug?: string;
    orientation?: "landscape" | "portrait";
}

export default function GamePlayer({
    buildFolder,
    buildName,
    title,
    coverUrl,
    previewVideoUrl,
    slug,
    orientation,
}: GamePlayerProps) {
    const [started, setStarted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showRotateOverlay, setShowRotateOverlay] = useState(false);

    const { unityProvider, loadingProgression, isLoaded, requestFullscreen } =
        useUnityContext({
            loaderUrl: `${buildFolder}/${buildName}.loader.js`,
            dataUrl: `${buildFolder}/${buildName}.data`,
            frameworkUrl: `${buildFolder}/${buildName}.framework.js`,
            codeUrl: `${buildFolder}/${buildName}.wasm`,
        });

    const progressPercent = Math.round(loadingProgression * 100);

    // Check orientation for overlay
    useEffect(() => {
        if (!started || !orientation || !isLoaded) return;

        const checkOrientation = () => {
            // Only relevant for landscape games on mobile/tablet
            const isLandscape = window.innerWidth > window.innerHeight;
            // Show overlay if game is landscape but screen is portrait
            setShowRotateOverlay(orientation === "landscape" && !isLandscape);
        };

        checkOrientation();
        window.addEventListener("resize", checkOrientation);
        return () => window.removeEventListener("resize", checkOrientation);
    }, [started, orientation, isLoaded]);

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;

        const elem = containerRef.current as any;
        const requestFS =
            elem.requestFullscreen ||
            elem.webkitRequestFullscreen ||
            elem.mozRequestFullScreen ||
            elem.msRequestFullscreen;

        if (requestFS) {
            requestFS.call(elem).catch((e: any) => {
                console.error("Fullscreen failed:", e);
                // Fallback to Unity's if container fails (rare)
                try {
                    requestFullscreen(true);
                } catch (unityErr) {
                    console.error("Unity fallback failed:", unityErr);
                }
            });
        }
    }, [requestFullscreen]);

    const handlePlayClick = () => {
        setStarted(true);
        reachGoal("play_game", { slug: slug || title });

        // Mobile check
        const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

        if (isMobile) {
            // Auto-fullscreen on mobile with a slight delay to ensure DOM is ready
            setTimeout(() => {
                toggleFullscreen();

                // Orientation lock attempt
                if (orientation && screen.orientation && "lock" in screen.orientation) {
                    // @ts-expect-error - lock is not fully typed
                    screen.orientation.lock(orientation).catch(() => { });
                }
            }, 100);
        }
    };

    // Auto-play blurred background video
    useEffect(() => {
        if (!started && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, [started]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    return (
        <div className="w-full">
            {/* Player container */}
            <div
                ref={containerRef}
                className={`relative overflow-hidden bg-card group/player ${isFullscreen
                    ? "fixed inset-0 z-50 w-screen h-screen border-none rounded-none flex items-center justify-center bg-black"
                    : "rounded-2xl border border-border"
                    }`}
            >
                {/* Rotate Overlay */}
                {showRotateOverlay && (
                    <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                        <div className="w-16 h-16 mb-4 animate-spin-slow">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            Поверните устройство
                        </h3>
                        <p className="text-gray-300">
                            Для этой игры требуется горизонтальная ориентация
                        </p>
                    </div>
                )}

                {/* Pre-start state: blurred video bg + cover on hover + Play button */}
                {!started && (
                    <div
                        className="relative aspect-video cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handlePlayClick}
                    >
                        {/* Blurred background video */}
                        {previewVideoUrl && (
                            <video
                                ref={videoRef}
                                src={previewVideoUrl}
                                muted
                                loop
                                playsInline
                                autoPlay
                                className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
                            />
                        )}

                        {/* Dark overlay on video */}
                        <div className="absolute inset-0 bg-black/15" />

                        {/* Play button — always visible */}
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 hover:bg-accent animate-glow-pulse">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    className="w-8 h-8 ml-1"
                                >
                                    <polygon points="6,3 20,12 6,21" />
                                </svg>
                            </div>
                            <span className="text-white text-lg font-bold drop-shadow-lg">
                                Играть
                            </span>
                        </div>
                    </div>
                )}

                {/* Unity player — only rendered after clicking Play */}
                {started && (
                    <>
                        {/* Loading overlay */}
                        {!isLoaded && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/95 backdrop-blur-sm">
                                <p className="text-text-muted text-sm mb-4 font-medium">
                                    Загрузка {title}...
                                </p>

                                {/* Progress bar */}
                                <div className="w-64 h-2 bg-background-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300 animate-glow-pulse"
                                        style={{
                                            width: `${progressPercent}%`,
                                            background:
                                                "linear-gradient(90deg, var(--accent), var(--accent-pink))",
                                        }}
                                    />
                                </div>

                                <p className="mt-3 text-2xl font-bold gradient-text">
                                    {progressPercent}%
                                </p>
                            </div>
                        )}

                        {/* Unity canvas */}
                        <Unity
                            unityProvider={unityProvider}
                            className={`block ${isFullscreen ? "w-full h-full" : "w-full aspect-video"}`}
                            tabIndex={1}
                            style={{
                                background: "var(--background)",
                            }}
                        />

                        {/* Fullscreen button */}
                        {isLoaded && !isFullscreen && (
                            <button
                                onClick={toggleFullscreen}
                                className="absolute bottom-4 right-4 z-40 w-10 h-10 rounded-xl glass flex items-center justify-center text-text-muted hover:text-text hover:bg-accent/20 transition-all duration-200 group opacity-0 group-hover/player:opacity-100 md:opacity-100"
                                title="На весь экран"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                                >
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                                </svg>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
