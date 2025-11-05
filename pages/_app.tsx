import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const enhancedPageProps = {
    ...pageProps,
    searchQuery,
    searchActive,
  };

  return (
    <div className={`bg-gray-900 text-white min-h-screen flex ${inter.variable} font-sans`}>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <Sidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchFocus={() => setSearchActive(true)}
          onSearchBlur={() => setTimeout(() => setSearchActive(false), 200)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Component {...enhancedPageProps} />
        </main>
      </div>
    </div>
  );
}

export default MyApp;
