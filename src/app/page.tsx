import { getAllGames } from "@/lib/games";
import GameGrid from "@/components/GameGrid";

export default function HomePage() {
  const games = getAllGames();

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero section */}
      <div className="text-center mb-12 sm:mb-16 animate-fade-in">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black mb-4">
          <span className="gradient-text">Играй бесплатно</span>
          <br />
          <span className="text-text">прямо в браузере</span>
        </h1>
        <p className="text-text-muted text-base sm:text-lg max-w-xl mx-auto">
          Коллекция лучших онлайн-игр. Без установки, без регистрации — просто
          нажми и играй.
        </p>
      </div>

      {/* Games grid */}
      <GameGrid games={games} title="🎮 Все игры" />
    </div>
  );
}
