
import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { getGameById, getAllGames } from '../../lib/data';
import type { Game } from '../../types';

declare global {
    interface Window {
        og_load: () => void;
    }
}

interface GameDetailPageProps {
    game: Game;
}

const GameDetailPage: React.FC<GameDetailPageProps> = ({ game }) => {
    const router = useRouter();

    const handleUnlock = useCallback(() => {
        if (game) {
            window.open(game.downloadUrl, '_blank');
        }
    }, [game]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data && event.data.event === 'unlockContent') {
            handleUnlock();
          }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [handleUnlock]);
    
    useEffect(() => {
        if (!router.isFallback) {
            window.scrollTo(0, 0);
        }
    }, [router.isFallback]);

    const handleDownloadClick = () => {
        if (typeof window.og_load === 'function') {
            window.og_load();
        } else {
            console.error("OGAds script not loaded or og_load function not available.");
            alert("The download service is currently unavailable. Please try again later.");
        }
    };

    const AdPlaceholder: React.FC<{ className?: string, text: string }> = ({ className, text }) => (
      <div className={`bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm font-semibold">{text}</span>
      </div>
    );

    if (router.isFallback) {
        return (
             <div className="text-center p-10">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-lg text-gray-300">Loading Game...</p>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{game.title} | Crazy Games Clone</title>
                <meta name="description" content={game.description} />
            </Head>
            <div className="max-w-7xl mx-auto">
                <div className="mb-4">
                    <Link href="/" className="text-sm text-purple-400 hover:underline">&lt; Back to Games</Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                            <div className="aspect-video bg-black relative">
                                {game.videoUrl ? <video src={game.videoUrl} controls autoPlay muted className="w-full h-full object-contain"></video> : <Image src={game.gallery[0] || game.imageUrl} alt={game.title} fill sizes="100vw" className="object-cover" />}
                            </div>
                            <div className="p-6">
                                <h1 className="text-4xl font-extrabold text-white mb-3">{game.title}</h1>
                                <div className="flex flex-wrap gap-2 mb-6">{game.tags?.map(tag => <span key={tag} className="text-xs font-semibold bg-gray-700 text-gray-300 px-2.5 py-1 rounded-full">{tag}</span>)}</div>
                                <p className="text-gray-300 leading-relaxed">{game.description}</p>
                                <button onClick={handleDownloadClick} className="mt-8 inline-block w-full sm:w-auto text-center bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-colors duration-300 transform hover:scale-105">Download Now</button>
                            </div>
                        </div>
                        <AdPlaceholder className="h-24 mt-8" text="Horizontal Ad (728x90)" />
                    </div>
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Screenshots</h3>
                        <div className="grid grid-cols-2 gap-4">{game.gallery.map((img, index) => (
                            <div key={index} className="relative rounded-lg object-cover aspect-video overflow-hidden">
                                <Image src={img} alt={`${game.title} screenshot ${index + 1}`} fill sizes="50vw" className="object-cover" />
                            </div>
                        ))}</div>
                        <AdPlaceholder className="w-full h-96" text="Vertical Ad (300x600)" />
                    </div>
                </div>
            </div>
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const games = await getAllGames();
    const paths = games.map(game => ({
        params: { id: game.id.toString() },
    }));
    return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params!;
    const game = await getGameById(Number(id));
    if (!game) {
        return { notFound: true };
    }
    return {
        props: { game },
        revalidate: 60, // In seconds
    };
};

export default GameDetailPage;
