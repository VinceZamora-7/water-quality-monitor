import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertThresholds } from '../types/sensor';

type Props = {
  thresholds: AlertThresholds;
  loading?: boolean;
  onManage?: () => void;
};

const rows = (thresholds: AlertThresholds) => [
  { label: 'pH', value: `${thresholds.ph.normalMin}–${thresholds.ph.normalMax}`, note: 'normal' },
  { label: 'TDS', value: `${thresholds.tds.caution} / ${thresholds.tds.critical}`, note: 'ppm' },
  { label: 'Turbidity', value: `${thresholds.turbidity.caution} / ${thresholds.turbidity.critical}`, note: 'NTU' },
  { label: 'Temperature', value: `${thresholds.temperature.caution} / ${thresholds.temperature.critical}`, note: '°C' },
];

export default function AlertThresholdCard({ thresholds, loading = false, onManage }: Props) {
  return (
    <View style={styles.card}>
      {loading ? (
        <ActivityIndicator color="#38BDF8" style={styles.loader} />
      ) : (
        rows(thresholds).map((row, index) => (
          <View key={row.label} style={[styles.row, index > 0 && styles.divider]}>
            <Text style={styles.label}>{row.label}</Text>
            <View style={styles.valueWrap}>
              <Text style={styles.value}>{row.value}</Text>
              <Text style={styles.note}>{row.note}</Text>
            </View>
          </View>
        ))
      )}

      {onManage ? (
        <Pressable onPress={onManage} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Edit thresholds</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#101722', borderColor: '#1E293B', borderWidth: 1, borderRadius: 16, padding: 16 },
  loader: { marginVertical: 32 },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#243044' },
  label: { color: '#94A3B8', fontSize: 13 },
  valueWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  value: { color: '#F1F5F9', fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  note: { color: '#64748B', fontSize: 10 },
  button: { marginTop: 12, minHeight: 44, borderRadius: 12, backgroundColor: '#172334', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#7DD3FC', fontSize: 13, fontWeight: '700' },
  pressed: { opacity: 0.65 },
});
