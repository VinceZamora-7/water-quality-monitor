import { apiPost } from './client';
import { ENV } from '../config/environment';

import {
  AIAnalysisResponse,
} from '../types/sensor';

export async function analyzeWaterQuality():
  Promise<AIAnalysisResponse> {

  return apiPost<AIAnalysisResponse>(
    '/api/v1/ai/analyze',

    {
      device_id: ENV.DEVICE_ID,
    },

    60000
  );
}