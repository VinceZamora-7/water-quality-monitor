import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  description?: string;
}

export default function SensorCard({
  title,
  value,
  unit,
  description,
}: SensorCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.valueRow}>
        <Text style={styles.value}>
          {value}
        </Text>

        <Text style={styles.unit}>
          {unit}
        </Text>
      </View>

      {description && (
        <Text
          style={styles.description}
          numberOfLines={1}
        >
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',

    minHeight: 112,

    backgroundColor: '#101722',

    borderWidth: 1,
    borderColor: '#253247',

    borderRadius: 16,

    padding: 15,

    justifyContent: 'space-between',
  },

  title: {
    color: '#8290A5',

    fontSize: 10,

    fontWeight: '800',

    letterSpacing: 0.7,
  },

  valueRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    marginVertical: 8,
  },

  value: {
    color: '#F8FAFC',

    fontSize: 29,

    fontWeight: '900',
  },

  unit: {
    color: '#38BDF8',

    fontSize: 12,

    fontWeight: '800',

    marginLeft: 6,

    marginBottom: 5,
  },

  description: {
    color: '#64748B',

    fontSize: 11,
  },
});
