import React from 'react';
import { LivePollingSlide } from '../components/ModuleA/LivePollingSlide';

export const Slide04_Poll1: React.FC = () => {
  return (
    <LivePollingSlide
      pollId="poll1"
      questionText="Jak se právě cítíte ve vztahu ke změně ŠVP?"
      isComparisonSlide={false}
    />
  );
};
