import React, { useState } from 'react';

// This component is repurposed as LeftSidebar

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-opacity-75
        ${
          active
            ? 'bg-orange-100 dark:bg-orange-900/30'
            : 'hover:bg-gray-100 dark:hover:bg-gray-900'
        }
      `}
    >
      {/* Indicator Bar */}
      <div
        className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-orange-500 transition-transform duration-300 ease-out ${
          active ? 'scale-y-100' : 'scale-y-0'
        }`}
      />

      {/* Icon */}
      <div
        className={`transition-colors ${
          active
            ? 'text-orange-500'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
        }`}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className={`font-medium transition-colors ${
          active
            ? 'font-semibold text-gray-900 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
        }`}
      >
        {label}
      </span>
    </button>
);


const LeftSidebar = ({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void; }) => {
    const [activeItem, setActiveItem] = useState('Home');

    const navItems = [
        { label: 'Home', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
        { label: 'Maps', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293A1 1 0 0016 6v10a1 1 0 00.293.707L20 20.414V7.586L17.707 5.293z" clipRule="evenodd" /></svg> },
        { label: 'Reports', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg> },
        { label: 'Tools', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg> },
        { label: 'User Guide', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg> },
        { label: 'Settings', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM17 8a1 1 0 10-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V8z" /></svg> },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-black text-gray-900 dark:text-white p-4 flex flex-col space-y-4 flex-shrink-0">
            <div className="flex items-center space-x-2 px-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                <h1 className="text-xl font-bold">SparkWeather</h1>
            </div>
            <div className="flex-1">
                <nav className="space-y-2">
                    {navItems.map(item => (
                      <NavItem 
                        key={item.label} 
                        {...item} 
                        active={activeItem === item.label}
                        onClick={() => setActiveItem(item.label)}
                      />
                    ))}
                </nav>
            </div>
            <div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-orange-600 hover:to-yellow-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span>New forecast</span>
                </button>
                <div className="flex justify-between items-center mt-4 bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Dark mode</span>
                    <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="theme-toggle"
                        className="sr-only peer"
                        checked={theme === 'dark'}
                        onChange={onToggleTheme}
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                    </label>
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;