"use client";

import { Game } from "@/lib/types";
import GamePlayer from "@/components/GamePlayer";

interface GamePlayerWrapperProps {
    game: Game;
}

export default function GamePlayerWrapper({ game }: GamePlayerWrapperProps) {
    return (
        <GamePlayer
            buildFolder={game.buildFolder}
            buildName={game.buildName}
            title={game.title}
            coverUrl={game.coverUrl}
            previewVideoUrl={game.previewVideoUrl}
            slug={game.slug}
            orientation={game.orientation}
        />
    );
}
