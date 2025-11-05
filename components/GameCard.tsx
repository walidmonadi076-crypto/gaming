
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Game } from '../types';

interface GameCardProps {
  game: Game;
  variant?: 'default' | 'vertical' | 'featured';
}

const GameCard: React.FC<GameCardProps> = ({ game, variant = 'default' }) => {
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'new': return 'bg-blue-500';
      case 'hot': return 'bg-red-500';
      case 'top': return 'bg-yellow-500';
      case 'play on comet': return 'bg-purple-500';
      case 'updated': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }
  
  const getCardClasses = () => {
    switch(variant) {
      case 'vertical':
        return "aspect-[2/3] flex flex-col";
      case 'featured':
        return "aspect-[4/3]";
      case 'default':
      default:
        return "aspect-video";
    }
  };

  const getTitleClasses = () => {
    switch(variant) {
      case 'vertical':
        return 'text-lg';
      case 'featured':
        return 'text-lg md:text-xl';
      case 'default':
      default:
        return 'text-md md:text-lg';
    }
  };

  const isVertical = variant === 'vertical';

  return (
    <Link 
      href={`/game/${game.id}`}
      className="block bg-gray-800 rounded-2xl overflow-hidden group transform hover:-translate-y-1 transition-transform duration-200 cursor-pointer shadow-lg hover:shadow-purple-500/20"
    >
      <div className={`relative ${getCardClasses()}`}>
        <Image 
          src={game.imageUrl} 
          alt={game.title} 
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 group-hover:opacity-100 transition-opacity"></div>
        {game.tags && game.tags[0] && (
            <div className={`absolute top-2 left-2 text-xs font-bold text-white px-2 py-1 rounded-full ${getTagColor(game.tags[0])}`}>
              {game.tags[0]}
            </div>
        )}
        <div className={`absolute bottom-0 left-0 right-0 p-3 ${isVertical ? '' : 'sm:p-4'}`}>
          <h3 className={`font-bold text-white ${getTitleClasses()}`}>{game.title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
