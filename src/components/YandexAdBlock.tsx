interface YandexAdBlockProps {
    width: number;
    height: number;
    className?: string;
}

export default function YandexAdBlock({
    width,
    height,
    className = "",
}: YandexAdBlockProps) {
    return (
        <div
            className={`flex items-center justify-center rounded-xl border border-border bg-card/50 ${className}`}
            style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}
        >
            <span className="text-xs text-text-muted/40 select-none">Ad</span>
        </div>
    );
}
