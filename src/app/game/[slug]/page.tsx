import { getAllGames, getGameBySlug, getSimilarGames } from "@/lib/games";
import { getCategoryBySlug } from "@/lib/categories";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import GamePlayerWrapper from "./GamePlayerWrapper";
import SimilarGames from "@/components/SimilarGames";
import Breadcrumbs from "@/components/Breadcrumbs";

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
        title: `${game.title} — Играй онлайн`,
        description: game.shortDescription,
        alternates: {
            canonical: `/game/${slug}`,
        },
        openGraph: {
            title: `${game.title} — MAD GAMES`,
            description: game.shortDescription,
            url: `/game/${slug}`,
            images: [game.coverUrl],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${game.title} — MAD GAMES`,
            description: game.shortDescription,
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

    // Map category slugs to names for genre
    const genres = game.categories
        .map((slug) => getCategoryBySlug(slug)?.name)
        .filter(Boolean);

    // Schema.org JSON-LD for VideoGame
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.title,
        description: game.shortDescription,
        url: `https://mad-games.ru/game/${game.slug}`,
        image: `https://mad-games.ru${game.coverUrl}`,
        playMode: "SinglePlayer",
        gamePlatform: "Web Browser",
        applicationCategory: "Game",
        operatingSystem: "Any",
        genre: genres,
        datePublished: game.publishedAt,
        author: {
            "@type": "Organization",
            name: game.developer,
        },
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "RUB",
            availability: "https://schema.org/InStock",
        },
        publisher: {
            "@type": "Organization",
            name: "MAD GAMES",
            url: "https://mad-games.ru",
        },
    };

    return (
        <div className="pt-20 pb-16">
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="max-w-4xl mx-auto mb-4">
                    <Breadcrumbs
                        items={[
                            { label: "Главная", href: "/" },
                            { label: game.title },
                        ]}
                    />
                </div>

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
