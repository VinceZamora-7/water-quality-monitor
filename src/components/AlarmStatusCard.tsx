import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  AlarmSeverity,
  WaterAlarm,
} from '../types/sensor';

// ==========================================
// PROPS
// ==========================================

interface Props {
  alarm?: WaterAlarm;
  isConnected?: boolean;
}

// ==========================================
// HELPERS
// ==========================================

function getSeverityConfig(
  severity: AlarmSeverity
) {
  switch (
    severity
  ) {
    case 'CRITICAL':
      return {
        label:
          'Critical Alert',

        statusText:
          'Physical alarm active',

        backgroundColor:
          '#2A1216',

        borderColor:
          '#7F1D1D',

        badgeBackground:
          '#7F1D1D',

        accentColor:
          '#F87171',

        descriptionColor:
          '#FCA5A5',
      };

    case 'CAUTION':
      return {
        label:
          'Caution',

        statusText:
          'Warning alarm active',

        backgroundColor:
          '#261E0D',

        borderColor:
          '#78350F',

        badgeBackground:
          '#78350F',

        accentColor:
          '#FBBF24',

        descriptionColor:
          '#FCD34D',
      };

    case 'NORMAL':
    default:
      return {
        label:
          'Normal',

        statusText:
          'No active alarm',

        backgroundColor:
          '#0C211C',

        borderColor:
          '#14532D',

        badgeBackground:
          '#14532D',

        accentColor:
          '#4ADE80',

        descriptionColor:
          '#86EFAC',
      };
  }
}

// ==========================================
// COMPONENT
// ==========================================

export default function AlarmStatusCard({
  alarm,
  isConnected = true,
}: Props) {
  const normalizedAlarm:
    WaterAlarm =
    alarm ?? {
      active: false,
      severity:
        'NORMAL',
      reason:
        'No active water-quality alert.',
      reasons: [],
    };

  const config =
    getSeverityConfig(
      normalizedAlarm.severity
    );

  if (
    !isConnected
  ) {
    return (
      <View
        style={[
          styles.container,
          styles.offlineContainer,
        ]}
      >
        <View
          style={
            styles.header
          }
        >
          <View>
            <Text
              style={
                styles.eyebrow
              }
            >
              WATER ALERT
            </Text>

            <Text
              style={
                styles.title
              }
            >
              Monitoring Offline
            </Text>
          </View>

          <View
            style={
              styles.offlineBadge
            }
          >
            <View
              style={
                styles.offlineDot
              }
            />

            <Text
              style={
                styles.offlineBadgeText
              }
            >
              OFFLINE
            </Text>
          </View>
        </View>

        <Text
          style={
            styles.offlineDescription
          }
        >
          AquaControl is not
          receiving live alarm
          updates. The device may
          continue operating using
          its last received alarm
          state.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            config.backgroundColor,

          borderColor:
            config.borderColor,
        },
      ]}
    >
      <View
        style={
          styles.header
        }
      >
        <View
          style={
            styles.headerText
          }
        >
          <Text
            style={
              styles.eyebrow
            }
          >
            WATER ALERT
          </Text>

          <Text
            style={
              styles.title
            }
          >
            {config.label}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                config.badgeBackground,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  config.accentColor,
              },
            ]}
          />

          <Text
            style={[
              styles.badgeText,
              {
                color:
                  config.accentColor,
              },
            ]}
          >
            {
              normalizedAlarm.severity
            }
          </Text>
        </View>
      </View>

      <View
        style={
          styles.divider
        }
      />

      <View
        style={
          styles.alarmStateRow
        }
      >
        <View
          style={[
            styles.alarmIndicator,
            {
              backgroundColor:
                normalizedAlarm.active
                  ? config.accentColor
                  : '#475569',
            },
          ]}
        />

        <Text
          style={
            styles.alarmStateText
          }
        >
          {
            config.statusText
          }
        </Text>
      </View>

      <Text
        style={[
          styles.reason,
          {
            color:
              config.descriptionColor,
          },
        ]}
      >
        {
          normalizedAlarm.reason
        }
      </Text>

      {normalizedAlarm.reasons &&
        normalizedAlarm.reasons
          .length > 1 && (
          <View
            style={
              styles.reasons
            }
          >
            {normalizedAlarm.reasons.map(
              (
                reason,
                index
              ) => (
                <View
                  key={`${reason}-${index}`}
                  style={
                    styles.reasonRow
                  }
                >
                  <Text
                    style={[
                      styles.bullet,
                      {
                        color:
                          config.accentColor,
                      },
                    ]}
                  >
                    •
                  </Text>

                  <Text
                    style={
                      styles.reasonItem
                    }
                  >
                    {reason}
                  </Text>
                </View>
              )
            )}
          </View>
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
      borderRadius: 20,

      borderWidth: 1,

      padding: 18,
    },

    offlineContainer: {
      backgroundColor:
        '#151A23',

      borderColor:
        '#334155',
    },

    header: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      justifyContent:
        'space-between',

      gap: 12,
    },

    headerText: {
      flex: 1,
    },

    eyebrow: {
      color:
        '#64748B',

      fontSize: 10,

      fontWeight:
        '800',

      letterSpacing:
        1.4,

      marginBottom: 5,
    },

    title: {
      color:
        '#F8FAFC',

      fontSize: 22,

      fontWeight:
        '800',
    },

    badge: {
      minHeight: 32,

      paddingHorizontal:
        11,

      borderRadius: 999,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 7,
    },

    statusDot: {
      width: 7,

      height: 7,

      borderRadius: 999,
    },

    badgeText: {
      fontSize: 10,

      fontWeight:
        '900',

      letterSpacing:
        0.8,
    },

    divider: {
      height: 1,

      backgroundColor:
        'rgba(255,255,255,0.06)',

      marginVertical: 15,
    },

    alarmStateRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom: 9,
    },

    alarmIndicator: {
      width: 8,

      height: 8,

      borderRadius: 999,

      marginRight: 8,
    },

    alarmStateText: {
      color:
        '#CBD5E1',

      fontSize: 12,

      fontWeight:
        '700',
    },

    reason: {
      fontSize: 14,

      lineHeight: 21,

      fontWeight:
        '500',
    },

    reasons: {
      marginTop: 12,

      gap: 6,
    },

    reasonRow: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',
    },

    bullet: {
      width: 18,

      fontSize: 15,

      fontWeight:
        '900',
    },

    reasonItem: {
      flex: 1,

      color:
        '#CBD5E1',

      fontSize: 12,

      lineHeight: 18,
    },

    offlineBadge: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#252B35',

      borderRadius: 999,

      paddingHorizontal:
        10,

      paddingVertical: 8,

      gap: 6,
    },

    offlineDot: {
      width: 7,

      height: 7,

      borderRadius: 999,

      backgroundColor:
        '#94A3B8',
    },

    offlineBadgeText: {
      color:
        '#CBD5E1',

      fontSize: 10,

      fontWeight:
        '900',

      letterSpacing:
        0.8,
    },

    offlineDescription: {
      color:
        '#94A3B8',

      fontSize: 13,

      lineHeight: 20,

      marginTop: 14,
    },
  });