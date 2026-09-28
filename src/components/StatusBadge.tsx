import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalizedStatus =
    status?.toUpperCase() || 'UNKNOWN';

  const getColors = () => {
    switch (normalizedStatus) {
      case 'CLEAR':
        return {
          background: '#064e3b',
          text: '#34d399',
        };

      case 'CLOUDY':
        return {
          background: '#78350f',
          text: '#fbbf24',
        };

      case 'DIRTY':
        return {
          background: '#7f1d1d',
          text: '#f87171',
        };

      default:
        return {
          background: '#334155',
          text: '#94a3b8',
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
          },
        ]}
      >
        {normalizedStatus}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',

    paddingHorizontal: 14,

    paddingVertical: 7,

    borderRadius: 999,
  },

  text: {
    fontSize: 13,

    fontWeight: '800',

    letterSpacing: 0.7,
  },
});