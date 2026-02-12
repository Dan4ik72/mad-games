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
}

export default function GamePlayer({
    buildFolder,
    buildName,
    title,
    coverUrl,
    previewVideoUrl,
    slug,
}: GamePlayerProps) {
    const [started, setStarted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { unityProvider, loadingProgression, isLoaded, requestFullscreen } =
        useUnityContext({
            loaderUrl: `${buildFolder}/${buildName}.loader.js`,
            dataUrl: `${buildFolder}/${buildName}.data`,
            frameworkUrl: `${buildFolder}/${buildName}.framework.js`,
            codeUrl: `${buildFolder}/${buildName}.wasm`,
        });

    const progressPercent = Math.round(loadingProgression * 100);

    const handleFullscreen = useCallback(() => {
        requestFullscreen(true);
    }, [requestFullscreen]);

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
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
                {/* Pre-start state: blurred video bg + cover on hover + Play button */}
                {!started && (
                    <div
                        className="relative aspect-video cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => {
                            setStarted(true);
                            reachGoal("play_game", { slug: slug || title });
                        }}
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
                            className="w-full aspect-video block"
                            tabIndex={1}
                            style={{
                                background: "var(--background)",
                            }}
                        />

                        {/* Fullscreen button */}
                        {isLoaded && !isFullscreen && (
                            <button
                                onClick={handleFullscreen}
                                className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-xl glass flex items-center justify-center text-text-muted hover:text-text hover:bg-accent/20 transition-all duration-200 group"
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
