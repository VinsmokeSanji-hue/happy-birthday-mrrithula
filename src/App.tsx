import React, { useState } from 'react';
import { ScreenType } from './types';
import { LandingScreen } from './components/LandingScreen';
import { FlowerWhirlpool } from './components/FlowerWhirlpool';
import { ScrapbookScreen } from './components/ScrapbookScreen';
import { LetterScreen } from './components/LetterScreen';
import { CakeScreen } from './components/CakeScreen';
import { FinalScreen } from './components/FinalScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('landing');
  const [showWhirlpool, setShowWhirlpool] = useState(false);

  const handleLandingYes = () => {
    // Start whirlpool on top of the landing screen
    setShowWhirlpool(true);
  };

  const handleWhirlpoolStartSplit = () => {
    // When the floral vortex splits into left/right curtains, reveal the scrapbook screen
    setActiveScreen('scrapbook');
  };

  const handleWhirlpoolComplete = () => {
    setShowWhirlpool(false);
  };

  const handleScrapbookNext = () => {
    setActiveScreen('letter');
  };

  const handleLetterNext = () => {
    setActiveScreen('cake');
  };

  const handleCakeNext = () => {
    setActiveScreen('final');
  };

  const handleRestart = () => {
    setShowWhirlpool(false);
    setActiveScreen('landing');
  };

  return (
    <div className="relative w-full min-h-[100dvh] h-full overflow-hidden bg-[#faf6f0]">
      {/* Active Screen Rendering (Only ONE screen is active and rendered at a time) */}
      {activeScreen === 'landing' && (
        <LandingScreen onYes={handleLandingYes} />
      )}

      {/* Flower Whirlpool Transition (Overlay during Landing -> Scrapbook transition) */}
      {showWhirlpool && (
        <FlowerWhirlpool
          onStartSplit={handleWhirlpoolStartSplit}
          onComplete={handleWhirlpoolComplete}
        />
      )}

      {activeScreen === 'scrapbook' && (
        <ScrapbookScreen onNext={handleScrapbookNext} />
      )}

      {activeScreen === 'letter' && (
        <LetterScreen onNext={handleLetterNext} />
      )}

      {activeScreen === 'cake' && (
        <CakeScreen onNext={handleCakeNext} />
      )}

      {activeScreen === 'final' && (
        <FinalScreen onRestart={handleRestart} />
      )}
    </div>
  );
}
