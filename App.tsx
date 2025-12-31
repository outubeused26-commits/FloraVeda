import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import PlantDetails from './components/PlantDetails';
import ChatInterface from './components/ChatInterface';
import { analyzePlantImage, createPlantChat } from './services/geminiService';
import { AppState, PlantInfo } from './types';
import { Chat } from '@google/genai';
import { HomeIcon } from './components/Icons';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [plantData, setPlantData] = useState<PlantInfo | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const handleImageSelected = async (base64: string, previewUrl: string, userCountry: string, userPlantName: string) => {
    setImagePreview(previewUrl);
    setCountry(userCountry);
    setAppState(AppState.ANALYZING);
    setErrorMsg('');

    try {
      // 1. Analyze the image with inputs
      const data = await analyzePlantImage(base64, userCountry, userPlantName);
      
      // 2. CHECK VERIFICATION
      if (!data.isMatch) {
        // Special logic requested by user
        setErrorMsg("i am so sorry there are many plants with the image i am updating the image and recheck its");
        setAppState(AppState.ERROR);
        return;
      }

      setPlantData(data);

      // 3. Initialize chat with context
      const chat = createPlantChat(data, userCountry);
      setChatSession(chat);

      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      setErrorMsg("We encountered an error processing your request. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.UPLOAD);
    setImagePreview('');
    setPlantData(null);
    setChatSession(null);
    setErrorMsg('');
    setCountry('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onReset={handleReset} />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 pb-24 relative">
        
        {/* VIEW: UPLOAD */}
        {appState === AppState.UPLOAD && (
          <ImageUpload onImageSelected={handleImageSelected} />
        )}

        {/* VIEW: ANALYZING (LOADING) */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-jungle-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="w-32 h-32 rounded-full border-t-4 border-l-4 border-jungle-400 animate-spin relative z-10"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                 <span className="text-4xl">🔍</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-display font-bold text-white tracking-wide">
                Analyzing Flora...
              </h2>
              <p className="text-jungle-200/80 max-w-md mx-auto">
                Comparing your image against our botanical database for {country}.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: ERROR / MISMATCH */}
        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto">
            <div className="glass-panel p-10 rounded-3xl border border-red-500/30 mb-8 shadow-2xl bg-red-900/10 backdrop-blur-xl">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🥀</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-4">Identification Failed</h3>
              <p className="text-red-100 font-medium text-lg leading-relaxed">{errorMsg}</p>
              <p className="text-white/60 text-sm mt-4">Please try again, and provide the Plant Name if you know it.</p>
            </div>
            <button 
              onClick={handleReset}
              className="px-10 py-4 bg-white text-jungle-900 rounded-full hover:bg-jungle-50 transition-colors font-bold shadow-xl flex items-center space-x-2"
            >
              <span>Update Image & Recheck</span>
            </button>
          </div>
        )}

        {/* VIEW: RESULTS */}
        {appState === AppState.RESULTS && plantData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Column: Plant Details (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <PlantDetails plant={plantData} imagePreviewUrl={imagePreview} />
            </div>

            {/* Right Column: Chat (4 cols) - Sticky on Desktop */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24">
                <ChatInterface chatSession={chatSession} />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Home Button (Mobile/Tablet optimized) - Hidden on Desktop */}
      {appState !== AppState.UPLOAD && (
        <button
          onClick={handleReset}
          className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-jungle-600/90 hover:bg-jungle-500 text-white p-4 rounded-full shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Go Home"
        >
          <HomeIcon className="w-6 h-6" />
        </button>
      )}

      <footer className="py-8 text-center text-white/30 text-sm pb-24">
        <p>&copy; {new Date().getFullYear()} FloraVeda AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}

export default App;