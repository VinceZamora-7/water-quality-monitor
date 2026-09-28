import React from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  UsageSafetyStatus,
  WaterUsageAnalysis,
} from '../types/sensor';

// ==========================================
// PROPS
// ==========================================

type Props = {
  analysis: WaterUsageAnalysis | null;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void;
};

// ==========================================
// COMPONENT
// ==========================================

export default function AIAnalysisCard({
  analysis,
  loading,
  error,
  onAnalyze,
}: Props) {
  const getStatusStyle = (
    status: UsageSafetyStatus
  ) => {
    switch (status) {
      case 'SUITABLE':
        return {
          label: 'Suitable',
          text: '#6EE7B7',
          background: '#052E2B',
        };

      case 'CAUTION':
        return {
          label: 'Caution',
          text: '#FCD34D',
          background: '#422006',
        };

      case 'NOT_RECOMMENDED':
        return {
          label: 'Not Recommended',
          text: '#FCA5A5',
          background: '#450A0A',
        };

      case 'INSUFFICIENT_DATA':
      default:
        return {
          label: 'Insufficient Data',
          text: '#CBD5E1',
          background: '#1E293B',
        };
    }
  };

  const overall = analysis
    ? getStatusStyle(
        analysis.overall_status
      )
    : null;

  return (
    <View style={styles.container}>
      {/* ==================================
          EMPTY STATE
      ================================== */}

      {!analysis &&
        !loading &&
        !error && (
          <>
            <View style={styles.intro}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>
                  ✦
                </Text>
              </View>

              <View style={styles.introContent}>
                <Text style={styles.introTitle}>
                  Ready to Analyze
                </Text>

                <Text style={styles.introSubtitle}>
                  Powered by RIO AI
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              Assess how the current water
              may be used based on the latest
              sensor measurements.
            </Text>

            <Pressable
              onPress={onAnalyze}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Analyze Water Usage
              </Text>
            </Pressable>
          </>
        )}

      {/* ==================================
          LOADING
      ================================== */}

      {loading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator
            color="#38BDF8"
          />

          <View style={styles.loadingTextWrap}>
            <Text style={styles.loadingTitle}>
              Assessing water usage
            </Text>

            <Text style={styles.loadingText}>
              Reviewing the latest sensor
              measurements.
            </Text>
          </View>
        </View>
      )}

      {/* ==================================
          ERROR
      ================================== */}

      {error && !loading && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            Assessment unavailable
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            onPress={onAnalyze}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      )}

      {/* ==================================
          ANALYSIS RESULT
      ================================== */}

      {analysis && !loading && (
        <>
          {/* ------------------------------
              OVERALL ASSESSMENT
          ------------------------------ */}

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.label}>
                OVERALL ASSESSMENT
              </Text>

              {overall && (
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        overall.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          overall.text,
                      },
                    ]}
                  >
                    {overall.label}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.summary}>
              {analysis.summary}
            </Text>
          </View>

          {/* ------------------------------
              USAGE ASSESSMENT
          ------------------------------ */}

          <Text style={styles.sectionTitle}>
            Usage Assessment
          </Text>

          <Text
            style={
              styles.sectionDescription
            }
          >
            Recommended water uses based on
            the current measured parameters.
          </Text>

          {analysis.usage_summary.map(
            (item, index) => {
              const statusStyle =
                getStatusStyle(
                  item.status
                );

              return (
                <View
                  key={`${item.title}-${index}`}
                  style={styles.usageCard}
                >
                  <View
                    style={
                      styles.usageHeader
                    }
                  >
                    <Text
                      style={
                        styles.usageTitle
                      }
                    >
                      {item.title}
                    </Text>

                    <View
                      style={[
                        styles.smallBadge,
                        {
                          backgroundColor:
                            statusStyle.background,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.smallBadgeText,
                          {
                            color:
                              statusStyle.text,
                          },
                        ]}
                      >
                        {
                          statusStyle.label
                        }
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={
                      styles.usageDescription
                    }
                  >
                    {item.description}
                  </Text>
                </View>
              );
            }
          )}

          {/* ------------------------------
              RECOMMENDATION
          ------------------------------ */}

          <View
            style={
              styles.recommendationCard
            }
          >
            <Text
              style={
                styles.recommendationLabel
              }
            >
              RECOMMENDATION
            </Text>

            <Text
              style={
                styles.recommendationText
              }
            >
              {analysis.recommendation}
            </Text>
          </View>

          {/* ------------------------------
              AI SOURCE
          ------------------------------ */}

          <View style={styles.aiFooter}>
            <View style={styles.aiDot} />

            <Text style={styles.aiFooterText}>
              Assessment generated by RIO AI
            </Text>
          </View>

          {/* ------------------------------
              REFRESH
          ------------------------------ */}

          <Pressable
            onPress={onAnalyze}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={
                styles.secondaryText
              }
            >
              Refresh Assessment
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({
    container: {
      backgroundColor: '#111A2B',
      borderWidth: 1,
      borderColor: '#223049',
      borderRadius: 24,
      padding: 20,
    },

    // ======================================
    // EMPTY STATE
    // ======================================

    intro: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    icon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: '#082F49',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    iconText: {
      color: '#7DD3FC',
      fontSize: 20,
      fontWeight: '900',
    },

    introContent: {
      flex: 1,
    },

    introTitle: {
      color: '#F8FAFC',
      fontSize: 16,
      fontWeight: '900',
    },

    introSubtitle: {
      color: '#64748B',
      fontSize: 11,
      marginTop: 2,
    },

    description: {
      color: '#94A3B8',
      fontSize: 13,
      lineHeight: 20,
      marginTop: 18,
    },

    // ======================================
    // PRIMARY BUTTON
    // ======================================

    primaryButton: {
      backgroundColor: '#0284C7',
      borderRadius: 15,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 18,
    },

    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900',
    },

    // ======================================
    // LOADING
    // ======================================

    loadingCard: {
      backgroundColor: '#0A101D',
      borderRadius: 15,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },

    loadingTextWrap: {
      flex: 1,
      marginLeft: 12,
    },

    loadingTitle: {
      color: '#E2E8F0',
      fontSize: 13,
      fontWeight: '800',
    },

    loadingText: {
      color: '#64748B',
      fontSize: 11,
      lineHeight: 17,
      marginTop: 3,
    },

    // ======================================
    // SUMMARY
    // ======================================

    summaryCard: {
      backgroundColor: '#0A101D',
      borderRadius: 17,
      padding: 16,
    },

    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },

    label: {
      color: '#38BDF8',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.2,
    },

    statusBadge: {
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 999,
    },

    statusText: {
      fontSize: 9,
      fontWeight: '900',
    },

    summary: {
      color: '#CBD5E1',
      fontSize: 13,
      lineHeight: 20,
      marginTop: 13,
    },

    // ======================================
    // USAGE ASSESSMENT
    // ======================================

    sectionTitle: {
      color: '#F8FAFC',
      fontSize: 16,
      fontWeight: '900',
      marginTop: 24,
    },

    sectionDescription: {
      color: '#64748B',
      fontSize: 11,
      lineHeight: 17,
      marginTop: 4,
      marginBottom: 12,
    },

    usageCard: {
      backgroundColor: '#0A101D',
      borderRadius: 15,
      padding: 14,
      marginBottom: 10,
    },

    usageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },

    usageTitle: {
      color: '#F8FAFC',
      fontSize: 14,
      fontWeight: '900',
      flex: 1,
    },

    smallBadge: {
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 999,
    },

    smallBadgeText: {
      fontSize: 8,
      fontWeight: '900',
      textTransform: 'uppercase',
    },

    usageDescription: {
      color: '#94A3B8',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 9,
    },

    // ======================================
    // RECOMMENDATION
    // ======================================

    recommendationCard: {
      backgroundColor: '#082F49',
      borderRadius: 15,
      padding: 14,
      marginTop: 14,
    },

    recommendationLabel: {
      color: '#7DD3FC',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.1,
    },

    recommendationText: {
      color: '#BAE6FD',
      fontSize: 12,
      lineHeight: 19,
      marginTop: 7,
    },

    // ======================================
    // RIO AI FOOTER
    // ======================================

    aiFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 14,
    },

    aiDot: {
      width: 5,
      height: 5,
      borderRadius: 999,
      backgroundColor: '#38BDF8',
      marginRight: 7,
    },

    aiFooterText: {
      color: '#475569',
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.3,
    },

    // ======================================
    // SECONDARY BUTTON
    // ======================================

    secondaryButton: {
      backgroundColor: '#1E293B',
      paddingVertical: 13,
      borderRadius: 14,
      alignItems: 'center',
      marginTop: 14,
    },

    secondaryText: {
      color: '#BAE6FD',
      fontSize: 12,
      fontWeight: '900',
    },

    // ======================================
    // ERROR
    // ======================================

    errorCard: {
      backgroundColor: '#3F1717',
      borderRadius: 15,
      padding: 14,
    },

    errorTitle: {
      color: '#FCA5A5',
      fontWeight: '900',
      fontSize: 13,
    },

    errorText: {
      color: '#F87171',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 5,
    },

    retryButton: {
      alignSelf: 'flex-start',
      marginTop: 12,
      paddingVertical: 6,
      paddingHorizontal: 2,
    },

    retryText: {
      color: '#FECACA',
      fontWeight: '900',
      fontSize: 12,
    },

    // ======================================
    // COMMON
    // ======================================

    pressed: {
      opacity: 0.75,
    },
  });