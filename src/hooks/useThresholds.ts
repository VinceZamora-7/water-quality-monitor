import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  AlertThresholds,
} from '../types/sensor';

import {
  getThresholds,
  resetThresholds,
  updateThresholds,
} from '../api/thresholds';

// ==========================================
// DEFAULT FALLBACK
// ==========================================

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  ph: {
    normalMin: 6.5,
    normalMax: 9.5,
    criticalMin: 6.0,
    criticalMax: 12.0,
  },

  tds: {
    caution: 500,
    critical: 800,
  },

  turbidity: {
    caution: 200,
    critical: 300,
  },

  temperature: {
    caution: 35,
    critical: 45,
  },
};

// ==========================================
// HOOK
// ==========================================

export function useThresholds() {
  const [
    thresholds,
    setThresholds,
  ] =
    useState<AlertThresholds>(
      DEFAULT_THRESHOLDS
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<string | null>(
      null
    );

  // ========================================
  // LOAD
  // ========================================

  const loadThresholds =
    useCallback(
      async () => {
        try {
          setIsLoading(true);

          setError(null);

          const response =
            await getThresholds();

          setThresholds(
            response.thresholds
          );
        } catch (err) {
          console.error(
            'loadThresholds error:',
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load thresholds.'
          );
        } finally {
          setIsLoading(false);
        }
      },
      []
    );

  // ========================================
  // SAVE
  // ========================================

  const saveThresholds =
    useCallback(
      async (
        values: AlertThresholds
      ) => {
        try {
          setIsSaving(true);

          setError(null);

          setSuccessMessage(
            null
          );

          const response =
            await updateThresholds(
              values
            );

          setThresholds(
            response.thresholds
          );

          setSuccessMessage(
            'Thresholds updated successfully.'
          );

          return true;
        } catch (err) {
          console.error(
            'saveThresholds error:',
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to save thresholds.'
          );

          return false;
        } finally {
          setIsSaving(false);
        }
      },
      []
    );

  // ========================================
  // RESET
  // ========================================

  const restoreDefaults =
    useCallback(
      async () => {
        try {
          setIsSaving(true);

          setError(null);

          setSuccessMessage(
            null
          );

          const response =
            await resetThresholds();

          setThresholds(
            response.thresholds
          );

          setSuccessMessage(
            'Default thresholds restored.'
          );

          return true;
        } catch (err) {
          console.error(
            'restoreDefaults error:',
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to restore default thresholds.'
          );

          return false;
        } finally {
          setIsSaving(false);
        }
      },
      []
    );

  // ========================================
  // CLEAR FEEDBACK
  // ========================================

  const clearMessages =
    useCallback(() => {
      setError(null);

      setSuccessMessage(
        null
      );
    }, []);

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    loadThresholds();
  }, [
    loadThresholds,
  ]);

  // ========================================
  // RETURN
  // ========================================

  return {
    thresholds,

    setThresholds,

    isLoading,

    isSaving,

    error,

    successMessage,

    loadThresholds,

    saveThresholds,

    restoreDefaults,

    clearMessages,
  };
}