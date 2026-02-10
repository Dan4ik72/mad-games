import { Game } from "@/lib/types";
import GameCard from "./GameCard";

interface SimilarGamesProps {
    games: Game[];
}

export default function SimilarGames({ games }: SimilarGamesProps) {
    if (games.length === 0) return null;

    return (
        <section className="mt-12 sm:mt-16">
            <h2 className="font-heading text-xl sm:text-2xl font-bold mb-6">
                <span className="gradient-text">Ещё игры</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {games.map((game, index) => (
                    <GameCard key={game.slug} game={game} index={index} />
                ))}
            </div>
        </section>
    );
}
