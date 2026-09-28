import React, { useEffect } from 'react';


import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({
  onFinish,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.logoWrapper}>
        <Image
          source={require('../../assets/logo-aquaaudit.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.subtitle}>
        Water Quality Controller
      </Text>

      <View style={styles.footer}>
        <View style={styles.dot} />

        <Text style={styles.footerText}>
          Monitoring smarter water
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A101D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 36,
    backgroundColor: '#111A2B',
    borderWidth: 1,
    borderColor: '#223049',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  logo: {
    width: 105,
    height: 105,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 6,
  },

  footer: {
    position: 'absolute',
    bottom: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#38BDF8',
    marginRight: 8,
  },

  footerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});