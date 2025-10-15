import React, { useState, useRef, useEffect } from 'react';
import { WeatherData } from '../types';
import HourlyForecast from './HourlyForecast';

// This component is repurposed as Dashboard

const OVERLAY_IMAGES = {
    'Temperature': "url('https://images.unsplash.com/photo-1581229929983-f5255a587597?q=80&w=2070&auto=format&fit=crop')",
    'Precipitation': "url('https://images.unsplash.com/photo-1594247552593-3532186a8559?q=80&w=2070&auto=format&fit=crop')",
    'Wind speed': "url('https://images.unsplash.com/photo-1611270219575-587410b64b8a?q=80&w=2070&auto=format&fit=crop')",
    'Events': 'none',
};
type OverlayType = keyof typeof OVERLAY_IMAGES;

type ActiveControlType = 'zoomin' | 'zoomout' | 'panup' | 'pandown' | 'panleft' | 'panright';

const MapInteractionControls = ({ 
    onZoom, 
    onPan, 
    activeControl, 
    setActiveControl 
}: { 
    onZoom: (direction: 'in' | 'out') => void; 
    onPan: (direction: 'up' | 'down' | 'left' | 'right') => void;
    activeControl: ActiveControlType | null;
    setActiveControl: (control: ActiveControlType | null) => void;
}) => {
    const intervalRef = useRef<number | null>(null);

    const startContinuousAction = (action: () => void) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        action(); // Perform action immediately on click
        intervalRef.current = window.setInterval(action, 100); // Repeat every 100ms
    };

    const stopContinuousAction = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setActiveControl(null);
    };

    const handleMouseDown = (control: ActiveControlType, action: () => void) => {
        setActiveControl(control);
        startContinuousAction(action);
    };
    
    useEffect(() => {
        // Cleanup interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const getControlClasses = (control: ActiveControlType) => 
        `p-2 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-150 ${activeControl === control ? 'bg-black/50 dark:bg-white/50 scale-90' : ''}`;

    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center space-y-4">
            {/* Zoom Controls */}
            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg flex flex-col">
                <button 
                    onMouseDown={() => handleMouseDown('zoomin', () => onZoom('in'))} 
                    onMouseUp={stopContinuousAction}
                    onMouseLeave={stopContinuousAction}
                    className={`${getControlClasses('zoomin')} rounded-t-lg font-bold text-lg`}
                    aria-label="Zoom In"
                >+</button>
                <div className="h-px bg-black/20 dark:bg-white/20"></div>
                <button 
                    onMouseDown={() => handleMouseDown('zoomout', () => onZoom('out'))} 
                    onMouseUp={stopContinuousAction}
                    onMouseLeave={stopContinuousAction}
                    className={`${getControlClasses('zoomout')} rounded-b-lg font-bold text-lg`}
                    aria-label="Zoom Out"
                >-</button>
            </div>

            {/* Pan Controls */}
            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full p-1 grid grid-cols-3 grid-rows-3 gap-px w-20 h-20 text-lg">
                <div/>
                <button onMouseDown={() => handleMouseDown('panup', () => onPan('up'))} onMouseUp={stopContinuousAction} onMouseLeave={stopContinuousAction} className={`${getControlClasses('panup')} rounded-full flex items-center justify-center`} aria-label="Pan Up">↑</button>
                <div/>
                <button onMouseDown={() => handleMouseDown('panleft', () => onPan('left'))} onMouseUp={stopContinuousAction} onMouseLeave={stopContinuousAction} className={`${getControlClasses('panleft')} rounded-full flex items-center justify-center`} aria-label="Pan Left">←</button>
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-500 text-xs font-sans">PAN</div>
                <button onMouseDown={() => handleMouseDown('panright', () => onPan('right'))} onMouseUp={stopContinuousAction} onMouseLeave={stopContinuousAction} className={`${getControlClasses('panright')} rounded-full flex items-center justify-center`} aria-label="Pan Right">→</button>
                <div/>
                <button onMouseDown={() => handleMouseDown('pandown', () => onPan('down'))} onMouseUp={stopContinuousAction} onMouseLeave={stopContinuousAction} className={`${getControlClasses('pandown')} rounded-full flex items-center justify-center`} aria-label="Pan Down">↓</button>
                <div/>
            </div>
        </div>
    );
};


const Dashboard = ({ weatherData, onOpenApiModal, onLocationChange }: { weatherData: WeatherData; onOpenApiModal: () => void; onLocationChange: (newLocation: string) => void; }) => {
    const { location, current, hourly } = weatherData;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 50, y: 50 });
    const [activeOverlay, setActiveOverlay] = useState<OverlayType>('Precipitation');
    const [activeControl, setActiveControl] = useState<ActiveControlType | null>(null);
    const [searchAnnouncement, setSearchAnnouncement] = useState('');
    // FIX: Changed useRef to correctly handle a potentially undefined value to resolve a TypeScript error.
    const prevLocationRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        // Announce when location data changes after an initial load.
        if (prevLocationRef.current && prevLocationRef.current !== weatherData.location) {
             setSearchAnnouncement(`Weather data has been updated for ${weatherData.location}.`);
        }
        prevLocationRef.current = weatherData.location;
    }, [weatherData.location]);


    // States for seamless cross-fade transition
    const [isOverlay1Active, setIsOverlay1Active] = useState(true);
    const [overlay1Style, setOverlay1Style] = useState<React.CSSProperties>({
        backgroundImage: OVERLAY_IMAGES['Precipitation'],
        opacity: 1,
        transition: 'opacity 700ms ease-in-out',
    });
    const [overlay2Style, setOverlay2Style] = useState<React.CSSProperties>({
        backgroundImage: 'none',
        opacity: 0,
        transition: 'opacity 700ms ease-in-out',
    });
    
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onLocationChange(searchQuery.trim());
            setSearchQuery(''); // Clear input after search
        }
    };

    const handleOverlayChange = (newOverlay: OverlayType) => {
        if (newOverlay === activeOverlay) return;

        const newImage = OVERLAY_IMAGES[newOverlay];
        // Define opacity based on the overlay type for visual effect
        const newOpacity = newOverlay === 'Events' ? 0 : newOverlay === 'Precipitation' ? 1 : 0.5;

        if (isOverlay1Active) {
            // Overlay 1 is visible, fade it out and fade in Overlay 2
            setOverlay2Style(prev => ({ ...prev, backgroundImage: newImage, opacity: newOpacity }));
            setOverlay1Style(prev => ({ ...prev, opacity: 0 }));
        } else {
            // Overlay 2 is visible, fade it out and fade in Overlay 1
            setOverlay1Style(prev => ({ ...prev, backgroundImage: newImage, opacity: newOpacity }));
            setOverlay2Style(prev => ({ ...prev, opacity: 0 }));
        }
        
        setIsOverlay1Active(prev => !prev);
        setActiveOverlay(newOverlay);
    };

    const handleZoom = (direction: 'in' | 'out') => {
        const zoomStep = 0.1;
        if (direction === 'in') {
            setZoom(prev => Math.min(prev + zoomStep, 3)); // Max zoom 3x
        } else {
            setZoom(prev => Math.max(prev - zoomStep, 1)); // Min zoom 1x
        }
    };
    
    const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
        const panStep = 2.5;
        setPan(prev => {
            let { x, y } = prev;
            if (direction === 'up') y = Math.max(y - panStep, 0);
            if (direction === 'down') y = Math.min(y + panStep, 100);
            if (direction === 'left') x = Math.max(x - panStep, 0);
            if (direction === 'right') x = Math.min(x + panStep, 100);
            return { x, y };
        });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Live region for screen reader announcements */}
            <div className="sr-only" role="status" aria-live="polite">
                {searchAnnouncement}
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate">Dashboard: <span className="text-gray-500 dark:text-gray-400">{location.split(',')[0]}</span></h1>
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a city..."
                        className="bg-gray-200 dark:bg-gray-800 border border-transparent rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all w-48"
                        aria-label="Search for a city to get its weather forecast"
                    />
                    <button 
                        type="submit" 
                        className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 text-sm hover:bg-orange-600 transition-colors"
                        aria-label="Search for the entered city"
                    >
                        Search
                    </button>
                </form>
            </div>
            
            <div className="flex-1 bg-gray-200 dark:bg-gray-900 rounded-2xl p-2 flex flex-col relative overflow-hidden">
                 {/* Map Container with transform for zoom/pan */}
                <div 
                    className="absolute inset-0 transition-transform duration-300 ease-out"
                    style={{ 
                        transform: `scale(${zoom})`,
                        backgroundPosition: `${pan.x}% ${pan.y}%`
                    }}
                >
                    {/* Base Map Background */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center rounded-2xl"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611416521382-84a14389659b?q=80&w=2070&auto=format&fit=crop')" }}
                    ></div>
                    {/* Visual Overlay Layer 1 */}
                    <div
                        className="absolute inset-0 bg-cover bg-center rounded-2xl"
                        style={overlay1Style}
                    ></div>
                    {/* Visual Overlay Layer 2 */}
                    <div
                        className="absolute inset-0 bg-cover bg-center rounded-2xl"
                        style={overlay2Style}
                    ></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-gray-200 via-gray-200/50 to-transparent dark:from-gray-900 dark:via-gray-900/50"></div>

                <MapInteractionControls 
                    onZoom={handleZoom} 
                    onPan={handlePan} 
                    activeControl={activeControl}
                    setActiveControl={setActiveControl}
                />

                {/* Map Controls */}
                <div className="relative flex justify-between items-center p-4 z-10">
                    <div className="flex space-x-1 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg p-1">
                        {(Object.keys(OVERLAY_IMAGES) as OverlayType[]).map((item) => (
                            <button 
                                key={item} 
                                onClick={() => handleOverlayChange(item)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeOverlay === item ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-800 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'}`}>
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                       <button onClick={onOpenApiModal} className="p-2 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-sm hover:bg-black/20 dark:hover:bg-white/20 transition-colors" aria-label="Show Raw API Data">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                       </button>
                       <button className="p-2 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-sm hover:bg-black/20 dark:hover:bg-white/20 transition-colors" aria-label="Add Location">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                       </button>
                    </div>
                </div>

                {/* Main content on map */}
                <div className="flex-1 flex items-center justify-center relative z-10">
                    {/* Data Overlay Card */}
                    <div className="bg-black/10 dark:bg-black/30 backdrop-blur-md p-6 rounded-xl border border-gray-500 dark:border-gray-700 text-gray-900 dark:text-white text-center">
                        <p className="text-8xl font-thin tracking-tighter">{current.temp}°C</p>
                        <p className="text-gray-600 dark:text-gray-400 -mt-2">{current.condition}</p>
                        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-left">
                            <div className="flex items-center space-x-2"><span className="text-gray-500 dark:text-gray-500">Wind</span><strong>{current.wind.speed} km/h</strong></div>
                            <div className="flex items-center space-x-2"><span className="text-gray-500 dark:text-gray-500">Humidity</span><strong>{current.humidity}%</strong></div>
                            <div className="flex items-center space-x-2"><span className="text-gray-500 dark:text-gray-500">Direction</span><strong>{current.wind.direction}</strong></div>
                            <div className="flex items-center space-x-2"><span className="text-gray-500 dark:text-gray-500">Pressure</span><strong>{current.pressure} hPa</strong></div>
                        </div>
                    </div>
                </div>

                {/* Timeline and Scrubber */}
                <div className="relative p-4 z-10">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-500">
                        <span>11:00</span>
                        <span>12:00</span>
                        <span>13:00</span>
                        <span>14:00</span>
                        <span>15:00</span>
                        <span>16:00</span>
                        <span>17:00</span>
                    </div>
                    <div className="w-full h-1 bg-gray-400 dark:bg-gray-700 rounded-full mt-2 relative">
                        <div className="absolute h-1 bg-orange-500 rounded-full" style={{width: '30%'}}></div>
                        <div className="absolute h-3 w-3 -top-1 bg-gray-800 dark:bg-white rounded-full" style={{left: '30%'}}></div>
                    </div>
                    <HourlyForecast data={hourly} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
