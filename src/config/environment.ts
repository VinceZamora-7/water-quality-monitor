export const ENV = {
  API_MODE: 'REMOTE' as 'LOCAL' | 'REMOTE',

  LOCAL_API_URL: 'http://192.168.4.1',

  REMOTE_API_URL: 'https://aquacontrol.rioph.com',

  DEVICE_ID: 'WQM-001',

};

export const getApiBaseUrl = () => {
  return ENV.API_MODE === 'REMOTE'
    ? ENV.REMOTE_API_URL
    : ENV.LOCAL_API_URL;
};