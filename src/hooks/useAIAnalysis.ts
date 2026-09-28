import {
  useCallback,
  useState,
} from 'react';

import {
  analyzeWaterQuality,
} from '../api/ai';

import {
  AIAnalysisResponse,
} from '../types/sensor';

export function useAIAnalysis() {
  const [analysis, setAnalysis] =
    useState<AIAnalysisResponse | null>(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const analyze = useCallback(
    async () => {
      try {
        setIsAnalyzing(true);
        setError(null);

        const response =
          await analyzeWaterQuality();

        setAnalysis(response);

        return response;
      } catch (err) {
        console.error(
          'AI analysis error:',
          err
        );

        setError(
          'Aqua Audit AI could not assess the water right now.'
        );

        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  return {
    analysis,
    isAnalyzing,
    error,
    analyze,
  };
}