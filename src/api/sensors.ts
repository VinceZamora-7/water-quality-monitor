import { apiGet } from './client';
import { ENV } from '../config/environment';
import { SensorData } from '../types/sensor';

export async function getLatestSensorData(): Promise<SensorData> {
  if (ENV.API_MODE === 'LOCAL') {
    return apiGet<SensorData>('/data');
  }

  return apiGet<SensorData>(
    `/api/v1/devices/${ENV.DEVICE_ID}/latest`
  );
}