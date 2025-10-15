import React from 'react';
import InfoCard from './InfoCard';

interface ErrorModalProps {
  message: string;
  onRetry: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onRetry }) => {
  const lowerCaseMessage = message.toLowerCase();
  const isApiKeyError = lowerCaseMessage.includes('api key');
  const isNetworkError = lowerCaseMessage.includes('network');
  const isLocationError = lowerCaseMessage.includes('location');

  const getErrorContent = () => {
    if (isApiKeyError) {
      return {
        title: "API Key Error",
        heading: "Please check your API key configuration:",
        suggestions: [
          "Ensure the Gemini API key is correctly set up in your environment.",
          "Verify that the key has not expired or been revoked.",
        ],
      };
    }
    if (isNetworkError) {
      return {
        title: "Connection Issue",
        heading: "Here are a few things to check:",
        suggestions: [
          "Is your internet connection stable?",
          "Try disabling any VPNs or firewalls that might be interfering.",
        ],
      };
    }
    if (isLocationError) {
      return {
        title: "Invalid Location",
        heading: "What to do next:",
        suggestions: [
          "Make sure you've entered a valid city name.",
          "Try being more specific, e.g., 'Paris, France' instead of 'Paris'.",
        ],
      };
    }
    return {
      title: "Oops! Something went wrong.",
      heading: "An unexpected error occurred. Here are some general tips:",
      suggestions: [
        "Please try your request again in a few moments.",
        "If the problem persists, check the console for more details.",
      ],
    };
  };

  const { title, heading, suggestions } = getErrorContent();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <InfoCard className="max-w-md w-full !border-red-500/50 transition-all duration-300 animate-fade-in-up">
        <div className="text-center">
          <svg xmlns="http://www.w.org/2000/svg" className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-2xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-red-300 bg-red-500/20 px-4 py-2 rounded-lg font-mono text-sm max-w-full overflow-x-auto">{message}</p>
          
          <div className="mt-6 text-left text-slate-400 space-y-2">
            <p className="font-semibold text-slate-200">{heading}</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <button 
              onClick={onRetry}
              className="w-full bg-orange-600 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Try Again
            </button>
          </div>
        </div>
      </InfoCard>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default React.memo(ErrorModal);