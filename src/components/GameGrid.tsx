import { Game } from "@/lib/types";
import GameCard from "./GameCard";

interface GameGridProps {
    games: Game[];
    title?: string;
}

export default function GameGrid({ games, title }: GameGridProps) {
    return (
        <section>
            {title && (
                <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                    <span className="gradient-text">{title}</span>
                </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {games.map((game, index) => (
                    <GameCard key={game.slug} game={game} index={index} />
                ))}
            </div>
        </section>
    );
}
