import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ENV } from '../config/environment';
import { useSensorData } from '../hooks/useSensorData';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { useThresholds } from '../hooks/useThresholds';
import AlarmStatusCard from '../components/AlarmStatusCard';
import AIAnalysisCard from '../components/AIAnalysisCard';
import AlertThresholdCard from '../components/AlertThresholdCard';
import ConnectionBadge from '../components/ConnectionBadge';
import SensorCard from '../components/SensorCard';

type Props = { onOpenSettings?: () => void };

function formatUpdated(date: Date | null) {
  return date ? `Updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for data';
}

export default function DashboardScreen({ onOpenSettings }: Props) {
  const { sensorData, isConnected, isLoading, refreshing, error, lastUpdated, refresh } = useSensorData();
  const { analysis, isAnalyzing, error: aiError, analyze } = useAIAnalysis();
  const { thresholds, isLoading: thresholdsLoading, loadThresholds } = useThresholds();
  const handleRefresh = useCallback(async () => { await Promise.all([refresh(), loadThresholds()]); }, [refresh, loadThresholds]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#38BDF8" colors={['#38BDF8']} />}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.brand}>AquaControl</Text>
            <Text style={styles.meta}>{ENV.DEVICE_ID} · {formatUpdated(lastUpdated)}</Text>
          </View>
          <View style={styles.actions}>
            <ConnectionBadge connected={isConnected} />
            {onOpenSettings ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Open settings" onPress={onOpenSettings}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
                <Text style={styles.icon}>⚙</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}
        {isLoading ? (
          <View style={styles.loading}><ActivityIndicator color="#38BDF8" /><Text style={styles.muted}>Loading readings…</Text></View>
        ) : (
          <>
            <AlarmStatusCard alarm={sensorData.alarm} isConnected={isConnected} />
            <Text style={styles.sectionTitle}>Measurements</Text>
            <View style={styles.grid}>
              <SensorCard title="pH" value={sensorData.ph.toFixed(2)} unit="" />
              <SensorCard title="TDS" value={sensorData.tds.toFixed(0)} unit="ppm" />
              <SensorCard title="Turbidity" value={sensorData.ntu.toFixed(0)} unit="NTU" />
              <SensorCard title="Temperature" value={sensorData.temp.toFixed(1)} unit="°C" />
            </View>
            <Text style={styles.sectionTitle}>Water assessment</Text>
            <AIAnalysisCard analysis={analysis?.analysis ?? null} loading={isAnalyzing} error={aiError} onAnalyze={analyze} />
            <Text style={styles.sectionTitle}>Alert thresholds</Text>
            <AlertThresholdCard thresholds={thresholds} loading={thresholdsLoading} onManage={onOpenSettings} />
            <Text style={styles.disclaimer}>Sensor readings are indicative and do not replace laboratory water testing.</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#080D16' },
  content: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 48, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 },
  headerText: { flex: 1 },
  brand: { color: '#F8FAFC', fontSize: 27, fontWeight: '800', letterSpacing: -0.6 },
  meta: { color: '#64748B', fontSize: 11, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#111A27', alignItems: 'center', justifyContent: 'center' },
  icon: { color: '#CBD5E1', fontSize: 17 },
  sectionTitle: { color: '#E2E8F0', fontSize: 16, fontWeight: '700', marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  loading: { minHeight: 360, alignItems: 'center', justifyContent: 'center', gap: 12 },
  muted: { color: '#64748B', fontSize: 13 },
  error: { backgroundColor: '#2A1216', borderRadius: 12, padding: 14 },
  errorText: { color: '#FCA5A5', fontSize: 12 },
  disclaimer: { color: '#475569', fontSize: 10, lineHeight: 16, textAlign: 'center', paddingHorizontal: 20, marginTop: 8 },
  pressed: { opacity: 0.65 },
});
