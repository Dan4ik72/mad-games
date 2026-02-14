import gamesData from "@/data/games.json";
import { Game } from "./types";

const games: Game[] = gamesData as Game[];

export function getAllGames(): Game[] {
    return games.filter((g) => g.isPublished);
}

export function getGameBySlug(slug: string): Game | undefined {
    return games.find((g) => g.slug === slug && g.isPublished);
}

export function getGamesByCategory(categorySlug: string): Game[] {
    return games.filter(
        (g) => g.isPublished && g.categories.includes(categorySlug)
    );
}

export function getSimilarGames(currentSlug: string): Game[] {
    const current = games.find((g) => g.slug === currentSlug);
    return games
        .filter((g) => g.slug !== currentSlug && g.isPublished)
        .sort((a, b) => {
            const aMatch = a.categories.some((c) =>
                current?.categories.includes(c)
            );
            const bMatch = b.categories.some((c) =>
                current?.categories.includes(c)
            );
            return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
        });
}
