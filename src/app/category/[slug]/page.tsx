import { getGamesByCategory } from "@/lib/games";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import GameGrid from "@/components/GameGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return categories.map((cat) => ({
        slug: cat.slug,
    }));
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (!category) {
        return { title: "Категория не найдена — MAD GAMES" };
    }

    return {
        title: `${category.name} — Играй онлайн бесплатно`,
        description: category.description,
        alternates: {
            canonical: `/category/${slug}`,
        },
        openGraph: {
            title: `${category.name} — MAD GAMES`,
            description: category.description,
            url: `/category/${slug}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${category.name} — MAD GAMES`,
            description: category.description,
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const games = getGamesByCategory(slug);

    // Schema.org CollectionPage JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.h1,
        description: category.description,
        url: `https://mad-games.ru/category/${slug}`,
        isPartOf: {
            "@type": "WebSite",
            name: "MAD GAMES",
            url: "https://mad-games.ru",
        },
    };

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumbs */}
            <Breadcrumbs
                items={[
                    { label: "Главная", href: "/" },
                    { label: category.name },
                ]}
            />

            {/* Hero section */}
            <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                    <span className="gradient-text">{category.h1}</span>
                </h1>
                <p className="text-text-muted text-base sm:text-lg max-w-xl mx-auto">
                    {category.description}
                </p>
            </div>

            {/* Games grid */}
            {games.length > 0 ? (
                <GameGrid games={games} title={`🎮 ${category.name}`} />
            ) : (
                <div className="text-center py-16">
                    <p className="text-text-muted text-lg">
                        В этой категории пока нет игр. Скоро добавим!
                    </p>
                </div>
            )}
        </div>
    );
}
