
import React, { useRef, useState, useEffect } from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameCarouselProps {
  games: Game[];
  cardVariant?: 'default' | 'vertical' | 'featured';
}

const GameCarousel: React.FC<GameCarouselProps> = ({ games, cardVariant = 'default' }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollable = el.scrollWidth > el.clientWidth + 1;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(scrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
        const handleResize = () => {
            setTimeout(checkScrollability, 150);
        };
        handleResize();
        el.addEventListener('scroll', checkScrollability, { passive: true });
        window.addEventListener('resize', handleResize);
        return () => {
            el.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', handleResize);
        };
    }
  }, [games]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const NavButton: React.FC<{ direction: 'left' | 'right', disabled: boolean }> = ({ direction, disabled }) => {
    const isLeft = direction === 'left';
    return (
      <button
        onClick={() => scroll(direction)}
        disabled={disabled}
        className={`absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gray-900/60 backdrop-blur-sm text-white
                    hover:bg-purple-600/80 disabled:opacity-0 disabled:cursor-not-allowed
                    transition-all duration-300 opacity-0 group-hover:opacity-100
                    flex items-center justify-center
                    ${isLeft ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}`}
        aria-label={isLeft ? "Scroll left" : "Scroll right"}
      >
        {isLeft ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        )}
      </button>
    );
  };
  
  const cardWidthClass = cardVariant === 'vertical' 
    ? "w-[45%] sm:w-[30%] md:w-1/4 lg:w-1/5"
    : "w-11/12 sm:w-[48%] lg:w-[32%]";

  return (
    <div className="relative group -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <NavButton direction="left" disabled={!canScrollLeft} />
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 py-1"
        style={{ scrollPadding: '1rem' }}
      >
        {games.map((game, index) => (
          <div key={game.id} className={`flex-shrink-0 snap-start 
            ${cardWidthClass} 
            ${index === 0 ? 'pl-4 sm:pl-6 lg:pl-8' : ''}
            ${index === games.length - 1 ? 'pr-4 sm:pr-6 lg:pr-8' : ''}
          `}>
            <GameCard game={game} variant={cardVariant} />
          </div>
        ))}
      </div>
      <NavButton direction="right" disabled={!canScrollRight} />
    </div>
  );
};

export default GameCarousel;