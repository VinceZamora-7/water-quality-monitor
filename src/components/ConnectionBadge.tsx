import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface ConnectionBadgeProps {
  connected: boolean;
}

export default function ConnectionBadge({
  connected,
}: ConnectionBadgeProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: connected
              ? '#22C55E'
              : '#EF4444',
          },
        ]}
      />

      <Text
        style={[
          styles.text,
          {
            color: connected
              ? '#86EFAC'
              : '#FCA5A5',
          },
        ]}
      >
        {connected ? 'Online' : 'Offline'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#111A27',

    borderRadius: 999,

    paddingHorizontal: 10,

    paddingVertical: 7,
  },

  dot: {
    width: 7,
    height: 7,

    borderRadius: 999,

    marginRight: 7,
  },

  text: {
    fontSize: 10,

    fontWeight: '800',
  },
});
