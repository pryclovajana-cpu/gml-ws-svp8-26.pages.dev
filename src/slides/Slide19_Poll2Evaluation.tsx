import React from 'react';
import { LivePollingSlide } from '../components/ModuleA/LivePollingSlide';

export const Slide19_Poll2Evaluation: React.FC = () => {
  return (
    <LivePollingSlide
      pollId="poll2"
      questionText="Výstupní evaluace: Jaká je vaše důvěra v nové ŠVP 8G po dnešním workshopu?"
      isComparisonSlide={true}
    />
  );
};
