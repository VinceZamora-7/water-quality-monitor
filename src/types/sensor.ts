export type WaterStatus =
  | 'CLEAR'
  | 'CLOUDY'
  | 'DIRTY'
  | 'INITIALIZING'
  | 'UNKNOWN';

export type AlarmSeverity =
  | 'NORMAL'
  | 'CAUTION'
  | 'CRITICAL';

export interface WaterAlarm {
  active: boolean;
  severity: AlarmSeverity;
  reason: string;
  reasons?: string[];
}

export interface SensorData {
  ph: number;
  tds: number;
  ntu: number;
  temp: number;
  status: WaterStatus | string;
  alarm?: WaterAlarm;
  timestamp?: string;
}

export interface SensorReading
  extends SensorData {
  id?: number;
  deviceId?: string;
}

export interface DeviceStatus {
  deviceId: string;
  online: boolean;
  lastSeen?: string;
}

// ==========================================
// THRESHOLDS
// ==========================================

export interface PhThresholds {
  normalMin: number;
  normalMax: number;
  criticalMin: number;
  criticalMax: number;
}

export interface DualThreshold {
  caution: number;
  critical: number;
}

export interface AlertThresholds {
  ph: PhThresholds;
  tds: DualThreshold;
  turbidity: DualThreshold;
  temperature: DualThreshold;
}

export interface ThresholdResponse {
  deviceId: string;
  thresholds: AlertThresholds;
}

export interface ThresholdUpdateResponse {
  message: string;
  deviceId: string;
  thresholds: AlertThresholds;
}

// ==========================================
// AI
// ==========================================

export type UsageSafetyStatus =
  | 'SUITABLE'
  | 'CAUTION'
  | 'NOT_RECOMMENDED'
  | 'INSUFFICIENT_DATA';

export type WaterUsageTitle =
  | 'Human Consumption'
  | 'Animals'
  | 'Irrigation'
  | 'General Cleaning';

export interface WaterUsageItem {
  title: WaterUsageTitle;
  status: UsageSafetyStatus;
  description: string;
}

export interface WaterUsageAnalysis {
  overall_status: UsageSafetyStatus;
  summary: string;
  usage_summary: WaterUsageItem[];
  recommendation: string;
}

export interface AIAnalysisReading {
  ph: number;
  tds: number;
  ntu: number;
  temp: number;
  status: string;
  timestamp: string;
}

export interface AIAnalysisResponse {
  deviceId: string;
  reading: AIAnalysisReading;
  analysis: WaterUsageAnalysis;
}