interface FooterProps {
    className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
    return (
        <footer className={`relative z-10 mt-20 ${className}`}>
            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <span className="font-heading text-lg font-bold gradient-text">
                        MAD GAMES
                    </span>

                    {/* Copyright */}
                    <p className="text-sm text-text-muted">
                        © {new Date().getFullYear()} MAD GAMES. Все права защищены.
                    </p>
                </div>
            </div>
        </footer>
    );
}
