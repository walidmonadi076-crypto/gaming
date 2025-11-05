
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';
import type { Game } from '../types';
import { getAllGames } from '../lib/data';
import GameCard from '../components/GameCard';
import GameCarousel from '../components/GameCarousel';
import Image from 'next/image';

const Section: React.FC<{ title: string; children: React.ReactNode, viewMore?: boolean, onViewMore?: () => void }> = ({ title, children, viewMore = true, onViewMore }) => (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {viewMore && <button onClick={onViewMore} className="text-sm font-semibold text-purple-400 hover:text-purple-300">View more</button>}
      </div>
      {children}
    </section>
);

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
            isActive 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
);

interface HomeProps {
    searchQuery: string;
    searchActive: boolean;
    games: Game[];
}

const Home: React.FC<HomeProps> = ({ searchQuery, searchActive, games }) => {
  const router = useRouter();
  const { category: categoryFromUrl } = router.query;
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  
  useEffect(() => {
    setSelectedCategory(typeof categoryFromUrl === 'string' ? categoryFromUrl : 'All');
  }, [categoryFromUrl]);

  const handleCategorySelect = (cat: string) => {
    const newQuery = { ...router.query };
    if (cat === 'All' || cat === selectedCategory) {
        delete newQuery.category;
    } else {
        newQuery.category = cat;
    }
    router.push({ pathname: '/', query: newQuery }, undefined, { shallow: true });
  };

  const categories = useMemo(() => ['All', ...Array.from(new Set(games.map(g => g.category)))], [games]);
  const tags = useMemo(() => ['All', ...Array.from(new Set(games.flatMap(g => g.tags || [])))], [games]);
  const featuredTags = useMemo(() => ['Hot', 'Updated', 'Top'], []);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
        const matchesQuery = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const category = selectedCategory === 'All' ? null : selectedCategory;
        const tag = selectedTag === 'All' ? null : selectedTag;
        const matchesCategory = !category || game.category === category;

        if (tag === '__FEATURED__') {
            return matchesQuery && matchesCategory && !!game.tags?.some(t => featuredTags.includes(t));
        }

        const matchesTag = !tag || game.tags?.includes(tag);
        return matchesQuery && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag, games, featuredTags]);
  
  const playOnCometGames = useMemo(() => games.filter(g => g.tags?.includes('Play on Comet')), [games]);
  const featuredGames = useMemo(() => games.filter(g => g.tags?.some(tag => featuredTags.includes(tag))), [games, featuredTags]);
  const newGames = useMemo(() => games.filter(g => g.tags?.includes('New')), [games]);

  const areFiltersActive = searchQuery || (selectedCategory && selectedCategory !== 'All') || (selectedTag && selectedTag !== 'All');
  const showFilters = searchActive || areFiltersActive;

  const handleViewMore = (tag: string) => {
    setSelectedTag(tag);
    handleCategorySelect('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
        <div className={`bg-gray-800 rounded-2xl transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-96 opacity-100 p-4' : 'max-h-0 opacity-0 p-0'}`}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-400 mr-2 hidden sm:inline">Categories:</span>
              {categories.map(cat => (
                <FilterButton key={cat} label={cat} isActive={selectedCategory === cat} onClick={() => handleCategorySelect(cat)} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-400 mr-2 hidden sm:inline">Tags:</span>
              {tags.map(tag => (
                <FilterButton key={tag} label={tag} isActive={selectedTag === tag} onClick={() => setSelectedTag(tag)} />
              ))}
            </div>
          </div>
        </div>

        {areFiltersActive ? (
            <Section title={`Results (${filteredGames.length})`} viewMore={false}>
                {filteredGames.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-400">No games found. Try adjusting your search or filters.</p>
                    </div>
                )}
            </Section>
        ) : (
            <>
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-12">
                    <Image src="https://picsum.photos/seed/banner/1200/400" alt="Comet AI Browser" fill sizes="100vw" className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">Comet is an<br />AI browser</h2>
                        <p className="mt-2 text-base sm:text-lg text-gray-300">Play on Comet, an AI-Powered browser from Perplexity AI</p>
                        <button className="mt-6 bg-white text-black font-bold py-2 px-5 text-base sm:py-3 sm:px-6 sm:text-lg rounded-lg w-fit hover:bg-gray-200 transition-colors">Get Comet</button>
                    </div>
                </div>

              <Section title="Play on Comet" onViewMore={() => handleViewMore('Play on Comet')}>
                <GameCarousel games={playOnCometGames} cardVariant="vertical" />
              </Section>

              <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6 my-12">
                <div className="flex items-center space-x-4">
                    <div className="bg-yellow-400 p-2 rounded-lg relative"><span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-purple-800">1</span><svg className="w-8 h-8 text-yellow-900" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg></div>
                    <div><h3 className="text-lg sm:text-xl font-bold">Climb the new CrazyGames leaderboards</h3></div>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex-shrink-0">Explore games</button>
              </div>

              <Section title="Featured Games" onViewMore={() => handleViewMore('__FEATURED__')}>
                <GameCarousel games={featuredGames} cardVariant="default" />
              </Section>

              <Section title="New Games" onViewMore={() => handleViewMore('New')}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                   {newGames.map(game => (<GameCard key={game.id} game={game} />))}
                </div>
              </Section>
            </>
        )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
    const games = await getAllGames();
    return {
        props: {
            games,
        },
        revalidate: 60, // Re-generate page every 60 seconds if data changes
    };
};

export default Home;
