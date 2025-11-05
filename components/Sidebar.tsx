
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ICONS, POPULAR_GAME_CATEGORIES, POPULAR_BLOG_CATEGORIES, POPULAR_SHOP_CATEGORIES } from '../constants';

interface SidebarProps {
    isExpanded: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onMouseEnter, onMouseLeave, isMobileOpen, onMobileClose }) => {
  const router = useRouter();
  
  const navItems = [
    { href: '/', icon: ICONS.HOME, label: 'Home' },
    { href: '/blogs', icon: ICONS.BLOG, label: 'Blogs' },
    { href: '/shop', icon: ICONS.STORE, label: 'Shop' },
  ];

  const { popularLinks, parentPath } = useMemo(() => {
    const path = router.pathname;
    if (path.startsWith('/blogs')) {
      return { popularLinks: POPULAR_BLOG_CATEGORIES, parentPath: '/blogs' };
    }
    if (path.startsWith('/shop')) {
      return { popularLinks: POPULAR_SHOP_CATEGORIES, parentPath: '/shop' };
    }
    return { popularLinks: POPULAR_GAME_CATEGORIES, parentPath: '/' };
  }, [router.pathname]);

  const isFullyExpanded = isExpanded || isMobileOpen;

  return (
    <nav 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 flex flex-col py-4 z-[60]
                   transition-all duration-300 ease-in-out
                   ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
                   md:translate-x-0 
                   ${isExpanded ? 'md:w-64' : 'md:w-20'}
                   ${isFullyExpanded ? 'items-start' : 'items-center'}`}
    >
      <div className={`flex items-center text-purple-500 mb-6 w-full ${isFullyExpanded ? 'pl-6' : 'justify-center'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span className={`text-xl font-bold text-white whitespace-nowrap transition-all duration-200 ${isFullyExpanded ? 'ml-3 opacity-100' : 'w-0 opacity-0'}`}>
            CrazyGames
        </span>
      </div>

      <ul className="w-full px-4 space-y-2">
        {navItems.map(item => {
          const isActive = item.href === '/' ? router.pathname === '/' : router.pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onMobileClose}
                className={
                  `flex items-center p-3 rounded-lg transition-all duration-200
                   ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                   ${isFullyExpanded ? 'w-full' : 'w-12 h-12 justify-center'}`
                }
                title={isFullyExpanded ? '' : item.label}
              >
                {React.cloneElement(item.icon, { className: 'h-6 w-6 flex-shrink-0' })}
                <span className={`whitespace-nowrap transition-all duration-200 ${isFullyExpanded ? 'ml-4 opacity-100' : 'w-0 opacity-0'}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-4 w-full">
        <div className={`w-full px-4 mb-2 ${isFullyExpanded ? 'pl-7' : 'text-center'}`}>
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-200 ${isFullyExpanded ? 'opacity-100' : 'opacity-0'}`}>
                Popular
            </h3>
        </div>
        <ul className="w-full px-4 space-y-2">
            {popularLinks.map(item => {
                const href = {
                  pathname: parentPath === '/' ? '/' : parentPath,
                  query: { category: item.value },
                };
                const isActive = router.pathname === href.pathname && router.query.category === item.value;
                
                return (
                    <li key={item.value}>
                        <Link
                          href={href}
                          onClick={onMobileClose}
                          className={
                              `flex items-center p-3 rounded-lg transition-all duration-200
                              ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                              ${isFullyExpanded ? 'w-full' : 'w-12 h-12 justify-center'}`
                          }
                          title={isFullyExpanded ? '' : item.label}
                        >
                          {React.cloneElement(item.icon, { className: 'h-6 w-6 flex-shrink-0' })}
                          <span className={`whitespace-nowrap transition-all duration-200 ${isFullyExpanded ? 'ml-4 opacity-100' : 'w-0 opacity-0'}`}>
                              {item.label}
                          </span>
                        </Link>
                    </li>
                );
            })}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
