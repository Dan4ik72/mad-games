export interface Game {
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    categories: string[];
    tags: string[];
    developer: string;
    publishedAt: string;
    coverUrl: string;
    previewVideoUrl: string;
    buildFolder: string;
    buildName: string;
    orientation?: "landscape" | "portrait";
    isPublished: boolean;
}
