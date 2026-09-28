import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AlertThresholds } from '../types/sensor';
import { useThresholds } from '../hooks/useThresholds';

type Props = { onBack?: () => void };
type Values = ReturnType<typeof toValues>;

function toValues(t: AlertThresholds) {
  return {
    phCriticalMin: String(t.ph.criticalMin), phNormalMin: String(t.ph.normalMin),
    phNormalMax: String(t.ph.normalMax), phCriticalMax: String(t.ph.criticalMax),
    tdsCaution: String(t.tds.caution), tdsCritical: String(t.tds.critical),
    turbidityCaution: String(t.turbidity.caution), turbidityCritical: String(t.turbidity.critical),
    temperatureCaution: String(t.temperature.caution), temperatureCritical: String(t.temperature.critical),
  };
}

const groups: { title: string; unit?: string; fields: { key: keyof Values; label: string }[] }[] = [
  { title: 'pH', fields: [
    { key: 'phCriticalMin', label: 'Critical min' }, { key: 'phNormalMin', label: 'Normal min' },
    { key: 'phNormalMax', label: 'Normal max' }, { key: 'phCriticalMax', label: 'Critical max' },
  ] },
  { title: 'TDS', unit: 'ppm', fields: [{ key: 'tdsCaution', label: 'Caution' }, { key: 'tdsCritical', label: 'Critical' }] },
  { title: 'Turbidity', unit: 'NTU', fields: [{ key: 'turbidityCaution', label: 'Caution' }, { key: 'turbidityCritical', label: 'Critical' }] },
  { title: 'Temperature', unit: '°C', fields: [{ key: 'temperatureCaution', label: 'Caution' }, { key: 'temperatureCritical', label: 'Critical' }] },
];

export default function SettingsScreen({ onBack }: Props) {
  const { thresholds, isLoading, isSaving, error, successMessage, saveThresholds, restoreDefaults, clearMessages } = useThresholds();
  const [values, setValues] = useState(() => toValues(thresholds));
  useEffect(() => setValues(toValues(thresholds)), [thresholds]);

  const parsed = useMemo(() => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)])) as Record<keyof Values, number>, [values]);
  const validationError = useMemo(() => {
    if (Object.values(parsed).some(value => !Number.isFinite(value))) return 'Enter a valid number in every field.';
    if (!(parsed.phCriticalMin < parsed.phNormalMin && parsed.phNormalMin < parsed.phNormalMax && parsed.phNormalMax < parsed.phCriticalMax)) return 'pH values must increase from critical minimum to critical maximum.';
    if (parsed.tdsCaution < 0 || parsed.turbidityCaution < 0) return 'TDS and turbidity values cannot be negative.';
    if (parsed.tdsCaution >= parsed.tdsCritical || parsed.turbidityCaution >= parsed.turbidityCritical || parsed.temperatureCaution >= parsed.temperatureCritical) return 'Each caution value must be lower than its critical value.';
    return null;
  }, [parsed]);

  const update = (key: keyof Values, value: string) => {
    clearMessages();
    setValues(current => ({ ...current, [key]: value.replace(/[^0-9.-]/g, '') }));
  };

  const payload = (): AlertThresholds => ({
    ph: { criticalMin: parsed.phCriticalMin, normalMin: parsed.phNormalMin, normalMax: parsed.phNormalMax, criticalMax: parsed.phCriticalMax },
    tds: { caution: parsed.tdsCaution, critical: parsed.tdsCritical },
    turbidity: { caution: parsed.turbidityCaution, critical: parsed.turbidityCritical },
    temperature: { caution: parsed.temperatureCaution, critical: parsed.temperatureCritical },
  });

  const confirmRestore = () => Alert.alert('Restore defaults?', 'Your current thresholds will be replaced.', [
    { text: 'Cancel', style: 'cancel' }, { text: 'Restore', style: 'destructive', onPress: restoreDefaults },
  ]);

  if (isLoading) return (
    <SafeAreaView style={styles.safeArea}><StatusBar style="light" /><View style={styles.loading}><ActivityIndicator color="#38BDF8" /><Text style={styles.muted}>Loading settings…</Text></View></SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View><Text style={styles.title}>Alert thresholds</Text><Text style={styles.subtitle}>Set caution and critical limits.</Text></View>
            {onBack ? <Pressable onPress={onBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><Text style={styles.backText}>Done</Text></Pressable> : null}
          </View>

          {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}
          {successMessage ? <View style={styles.success}><Text style={styles.successText}>{successMessage}</Text></View> : null}

          {groups.map(group => (
            <View key={group.title} style={styles.group}>
              <View style={styles.groupHeader}><Text style={styles.groupTitle}>{group.title}</Text>{group.unit ? <Text style={styles.unit}>{group.unit}</Text> : null}</View>
              <View style={styles.fields}>
                {group.fields.map(field => (
                  <View key={field.key} style={styles.field}>
                    <Text style={styles.label}>{field.label}</Text>
                    <TextInput value={values[field.key]} onChangeText={value => update(field.key, value)} keyboardType="decimal-pad"
                      selectTextOnFocus style={styles.input} placeholder="0" placeholderTextColor="#475569" />
                  </View>
                ))}
              </View>
            </View>
          ))}

          {validationError ? <Text style={styles.validation}>{validationError}</Text> : null}
          <Pressable disabled={Boolean(validationError) || isSaving} onPress={() => saveThresholds(payload())}
            style={({ pressed }) => [styles.save, (validationError || isSaving) && styles.disabled, pressed && styles.pressed]}>
            {isSaving ? <ActivityIndicator color="#07111D" /> : <Text style={styles.saveText}>Save changes</Text>}
          </Pressable>
          <Pressable disabled={isSaving} onPress={confirmRestore} style={({ pressed }) => [styles.restore, pressed && styles.pressed]}><Text style={styles.restoreText}>Restore defaults</Text></Pressable>
          <Text style={styles.footnote}>Changes are stored on the server and apply to future readings.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#080D16' }, flex: { flex: 1 },
  content: { padding: 18, paddingBottom: 44, gap: 14 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }, muted: { color: '#64748B', fontSize: 13 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: '#F8FAFC', fontSize: 26, fontWeight: '800', letterSpacing: -0.4 }, subtitle: { color: '#64748B', fontSize: 12, marginTop: 4 },
  back: { minHeight: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#172334', alignItems: 'center', justifyContent: 'center' }, backText: { color: '#7DD3FC', fontSize: 13, fontWeight: '700' },
  group: { backgroundColor: '#101722', borderColor: '#1E293B', borderWidth: 1, borderRadius: 16, padding: 16 },
  groupHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginBottom: 14 }, groupTitle: { color: '#E2E8F0', fontSize: 15, fontWeight: '700' }, unit: { color: '#64748B', fontSize: 10 },
  fields: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5, rowGap: 12 }, field: { width: '50%', paddingHorizontal: 5 },
  label: { color: '#64748B', fontSize: 11, marginBottom: 7 }, input: { height: 46, color: '#F8FAFC', backgroundColor: '#0B111B', borderColor: '#263247', borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, fontSize: 15, fontWeight: '600' },
  error: { backgroundColor: '#2A1216', borderRadius: 12, padding: 13 }, errorText: { color: '#FCA5A5', fontSize: 12 },
  success: { backgroundColor: '#0C211C', borderRadius: 12, padding: 13 }, successText: { color: '#86EFAC', fontSize: 12 }, validation: { color: '#FBBF24', fontSize: 11, lineHeight: 16 },
  save: { minHeight: 50, backgroundColor: '#38BDF8', borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, saveText: { color: '#07111D', fontSize: 14, fontWeight: '800' }, disabled: { opacity: 0.4 },
  restore: { minHeight: 44, alignItems: 'center', justifyContent: 'center' }, restoreText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' }, footnote: { color: '#475569', fontSize: 10, lineHeight: 15, textAlign: 'center' }, pressed: { opacity: 0.65 },
});
