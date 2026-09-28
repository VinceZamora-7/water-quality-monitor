import {
  AlertThresholds,
  ThresholdResponse,
  ThresholdUpdateResponse,
} from '../types/sensor';

import {
  apiGet,
  apiPost,
} from './client';

import {
  getApiBaseUrl,
  ENV,
} from '../config/environment';

// ==========================================
// API PATHS
// ==========================================

const thresholdsPath =
  `/api/v1/devices/${ENV.DEVICE_ID}/thresholds`;

const resetThresholdsPath =
  `/api/v1/devices/${ENV.DEVICE_ID}/thresholds/reset`;

// ==========================================
// LOAD THRESHOLDS
// ==========================================

export async function getThresholds(): Promise<ThresholdResponse> {
  return apiGet<ThresholdResponse>(
    thresholdsPath
  );
}

// ==========================================
// UPDATE THRESHOLDS
// ==========================================

export async function updateThresholds(
  thresholds: AlertThresholds
): Promise<ThresholdUpdateResponse> {
  const baseUrl =
    getApiBaseUrl();

  const url =
    `${baseUrl}${thresholdsPath}`;

  const response =
    await fetch(
      url,
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            thresholds,
          }),
      }
    );

  if (!response.ok) {
    let message =
      'Unable to update thresholds.';

    try {
      const error =
        await response.json();

      if (error?.message) {
        message =
          error.message;
      }
    } catch {
      // Ignore invalid JSON error response.
    }

    throw new Error(
      message
    );
  }

  return response.json();
}

// ==========================================
// RESTORE DEFAULTS
// ==========================================

export async function resetThresholds(): Promise<ThresholdUpdateResponse> {
  return apiPost<
    ThresholdUpdateResponse
  >(
    resetThresholdsPath,
    {}
  );
}