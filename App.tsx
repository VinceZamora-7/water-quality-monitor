import React, {
  useState,
} from 'react';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import DashboardScreen
  from './src/screens/DashboardScreen';

import SettingsScreen
  from './src/screens/SettingsScreen';

type AppScreen =
  | 'dashboard'
  | 'settings';

export default function App() {
  const [
    currentScreen,
    setCurrentScreen,
  ] =
    useState<AppScreen>(
      'dashboard'
    );

  if (
    currentScreen ===
    'settings'
  ) {
    return (
      <SafeAreaProvider>
        <SettingsScreen
          onBack={() =>
            setCurrentScreen(
              'dashboard'
            )
          }
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <DashboardScreen
        onOpenSettings={() =>
          setCurrentScreen(
            'settings'
          )
        }
      />
    </SafeAreaProvider>
  );
}