export interface Category {
    slug: string;
    name: string;
    description: string;
    h1: string;
    icon: string;
}

export const categories: Category[] = [
    {
        slug: "arcade",
        name: "Аркады",
        h1: "Аркады — играй онлайн бесплатно",
        description:
            "Лучшие бесплатные аркады онлайн. Играй прямо в браузере без скачивания и регистрации!",
        icon: "Gamepad2",
    },
    {
        slug: "casual",
        name: "Казуальные",
        h1: "Казуальные игры — играй онлайн бесплатно",
        description:
            "Казуальные игры онлайн — простые, весёлые и затягивающие. Играй бесплатно в браузере!",
        icon: "Coffee",
    },
    {
        slug: "shooter",
        name: "Шутеры",
        h1: "Шутеры — играй онлайн бесплатно",
        description:
            "Бесплатные онлайн-шутеры — стреляй и побеждай прямо в браузере без скачивания!",
        icon: "Crosshair",
    },
    {
        slug: "simulator",
        name: "Симуляторы",
        h1: "Симуляторы — играй онлайн бесплатно",
        description:
            "Бесплатные онлайн-симуляторы — реалистичная физика и безумные эксперименты в браузере!",
        icon: "Activity",
    },
];

export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
}
