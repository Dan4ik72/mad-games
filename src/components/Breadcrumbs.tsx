import Link from "next/link";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    // Schema.org BreadcrumbList JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href && {
                item: `https://mad-games.ru${item.href}`,
            }),
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav
                aria-label="Хлебные крошки"
                className="flex items-center gap-2 text-sm text-text-muted mb-4 flex-wrap"
            >
                {items.map((item, index) => (
                    <span key={index} className="flex items-center gap-2">
                        {index > 0 && (
                            <span className="text-text-muted/50">›</span>
                        )}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-accent-light transition-colors duration-200"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-text">{item.label}</span>
                        )}
                    </span>
                ))}
            </nav>
        </>
    );
}
