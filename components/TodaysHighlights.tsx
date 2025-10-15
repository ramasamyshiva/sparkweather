import React, { useState } from 'react';

// This component is repurposed as RightSidebar

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${active ? 'bg-gray-700 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
        {label}
    </button>
);

// FIX: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const EventCard = ({ time, title, description, icon }: { time: string, title: string, description: string, icon: React.ReactNode }) => (
    <div className="bg-gray-200 dark:bg-gray-900 rounded-lg p-4 flex items-start space-x-4 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors">
        <div className="bg-gray-300 dark:bg-gray-800 p-2 rounded-full mt-1">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-500">{time}</p>
            <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    </div>
);

const RightSidebar = () => {
    const [activeTab, setActiveTab] = useState('Trigger Events');
    
    const events = [
        { time: "08:00", title: "Temperature falls below -10°C at Adelaide", description: "Temperature Alert", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm0 2h10v6H5V6z" clipRule="evenodd" /><path d="M15 15H5a1 1 0 110-2h10a1 1 0 110 2z" /></svg> },
        { time: "12:00", title: "Moderate Rain", description: "Precipitation Alert", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 11.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> },
        { time: "15:00", title: "Strong high temperature", description: "Temperature Alert", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm0 2h10v6H5V6z" clipRule="evenodd" /><path d="M15 15H5a1 1 0 110-2h10a1 1 0 110 2z" /></svg> },
        { time: "16:18", title: "Weather Forecast For Birmingham", description: "New Report", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg> },
    ];
    
    return (
        <aside className="w-80 bg-white dark:bg-black text-gray-900 dark:text-white p-4 flex flex-col space-y-6 flex-shrink-0">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="font-semibold">27 November 2024</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 12.586V8a6 6 0 00-6-6zM10 16a2 2 0 110-4 2 2 0 010 4z" /></svg></button>
                    <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="User avatar" className="w-8 h-8 rounded-full" />
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-200 dark:bg-gray-900 rounded-lg p-1 flex space-x-1">
                <TabButton label="Views" active={activeTab === 'Views'} onClick={() => setActiveTab('Views')} />
                <TabButton label="Alerts" active={activeTab === 'Alerts'} onClick={() => setActiveTab('Alerts')} />
                <TabButton label="Trigger Events" active={activeTab === 'Trigger Events'} onClick={() => setActiveTab('Trigger Events')} />
            </div>

            {/* Events List */}
            <div className="flex-1 space-y-3 overflow-y-auto">
                {events.map((event, index) => <EventCard key={index} {...event} />)}
            </div>
        </aside>
    );
};

export default RightSidebar;