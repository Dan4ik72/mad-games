import gamesData from "@/data/games.json";
import { Game } from "./types";

const games: Game[] = gamesData;

export function getAllGames(): Game[] {
    return games.filter((g) => g.isPublished);
}

export function getGameBySlug(slug: string): Game | undefined {
    return games.find((g) => g.slug === slug && g.isPublished);
}

export function getSimilarGames(currentSlug: string): Game[] {
    return games.filter((g) => g.slug !== currentSlug && g.isPublished);
}
