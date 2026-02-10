import { getAllGames, getGameBySlug, getSimilarGames } from "@/lib/games";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import GamePlayerWrapper from "./GamePlayerWrapper";
import SimilarGames from "@/components/SimilarGames";

interface GamePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const games = getAllGames();
    return games.map((game) => ({
        slug: game.slug,
    }));
}

export async function generateMetadata({
    params,
}: GamePageProps): Promise<Metadata> {
    const { slug } = await params;
    const game = getGameBySlug(slug);

    if (!game) {
        return { title: "Игра не найдена — MAD GAMES" };
    }

    return {
        title: `${game.title} — Играй онлайн | MAD GAMES`,
        description: game.description,
        openGraph: {
            title: `${game.title} — MAD GAMES`,
            description: game.description,
            images: [game.coverUrl],
        },
    };
}

export default async function GamePage({ params }: GamePageProps) {
    const { slug } = await params;
    const game = getGameBySlug(slug);

    if (!game) {
        notFound();
    }

    const similarGames = getSimilarGames(slug);

    return (
        <div className="pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Game player section */}
                <div className="flex justify-center mb-8">
                    <div className="w-full max-w-4xl">
                        <GamePlayerWrapper game={game} />
                    </div>
                </div>

                {/* Game info */}
                <div className="max-w-4xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
                        {game.title}
                    </h1>
                    <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                        {game.description}
                    </p>
                </div>

                {/* Similar games */}
                <div className="max-w-7xl mx-auto">
                    <SimilarGames games={similarGames} />
                </div>
            </div>
        </div>
    );
}
