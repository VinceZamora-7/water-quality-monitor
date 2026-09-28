import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getLatestSensorData,
} from '../api/sensors';

import {
  getSocket,
} from '../api/socket';

import {
  ENV,
} from '../config/environment';

import {
  SensorData,
  SensorReading,
} from '../types/sensor';

// ==========================================
// INITIAL STATE
// ==========================================

const initialSensorData: SensorData = {
  ph: 0,
  tds: 0,
  ntu: 0,
  temp: 0,
  status: 'INITIALIZING',

  alarm: {
    active: false,
    severity: 'NORMAL',
    reason:
      'Waiting for water-quality data.',
    reasons: [],
  },
};

// ==========================================
// SENSOR DATA HOOK
// ==========================================

export function useSensorData() {
  const [
    sensorData,
    setSensorData,
  ] = useState<SensorData>(
    initialSensorData
  );

  const [
    isConnected,
    setIsConnected,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState<Date | null>(
    null
  );

  const mountedRef =
    useRef(true);

  // ========================================
  // NORMALIZE READING
  // ========================================

  const normalizeReading =
    useCallback(
      (
        reading: SensorReading
      ): SensorData => {
        return {
          ph:
            Number(
              reading.ph
            ) || 0,

          tds:
            Number(
              reading.tds
            ) || 0,

          ntu:
            Number(
              reading.ntu
            ) || 0,

          temp:
            Number(
              reading.temp
            ) || 0,

          status:
            reading.status ??
            'UNKNOWN',

          alarm:
            reading.alarm ?? {
              active: false,
              severity:
                'NORMAL',
              reason:
                'No active water-quality alert.',
              reasons: [],
            },

          timestamp:
            reading.timestamp,
        };
      },
      []
    );

  // ========================================
  // INITIAL / MANUAL REST FETCH
  // ========================================

  const fetchData =
    useCallback(async () => {
      try {
        const data =
          await getLatestSensorData();

        if (
          !mountedRef.current
        ) {
          return;
        }

        const normalized =
          normalizeReading(
            data
          );

        setSensorData(
          normalized
        );

        setError(
          null
        );

        setLastUpdated(
          normalized.timestamp
            ? new Date(
                normalized.timestamp
              )
            : new Date()
        );
      } catch (err) {
        console.error(
          'Sensor API error:',
          err
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        setError(
          'Unable to retrieve sensor data.'
        );
      } finally {
        if (
          mountedRef.current
        ) {
          setIsLoading(
            false
          );
        }
      }
    }, [
      normalizeReading,
    ]);

  // ========================================
  // PULL TO REFRESH
  // ========================================

  const refresh =
    useCallback(async () => {
      setRefreshing(
        true
      );

      await fetchData();

      if (
        mountedRef.current
      ) {
        setRefreshing(
          false
        );
      }
    }, [
      fetchData,
    ]);

  // ========================================
  // SOCKET.IO
  // ========================================

  useEffect(() => {
    mountedRef.current =
      true;

    // Get most recent stored reading first.
    fetchData();

    const socket =
      getSocket();

    // --------------------------------------
    // CONNECTED
    // --------------------------------------

    const handleConnect =
      () => {
        console.log(
          'Socket connected:',
          socket.id
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        setIsConnected(
          true
        );

        setError(
          null
        );

        socket.emit(
          'device:subscribe',
          ENV.DEVICE_ID
        );
      };

    // --------------------------------------
    // DISCONNECTED
    // --------------------------------------

    const handleDisconnect =
      (
        reason: string
      ) => {
        console.log(
          'Socket disconnected:',
          reason
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        setIsConnected(
          false
        );
      };

    // --------------------------------------
    // CONNECTION ERROR
    // --------------------------------------

    const handleConnectError =
      (
        socketError: Error
      ) => {
        console.error(
          'Socket connection error:',
          socketError.message
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        setIsConnected(
          false
        );

        setError(
          'Live connection unavailable.'
        );
      };

    // --------------------------------------
    // LIVE SENSOR READING
    // --------------------------------------

    const handleReading =
      (
        reading: SensorReading
      ) => {
        console.log(
          'Live sensor reading:',
          reading
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        const normalized =
          normalizeReading(
            reading
          );

        setSensorData(
          normalized
        );

        setLastUpdated(
          normalized.timestamp
            ? new Date(
                normalized.timestamp
              )
            : new Date()
        );

        setIsConnected(
          true
        );

        setIsLoading(
          false
        );

        setError(
          null
        );
      };

    // --------------------------------------
    // LISTENERS
    // --------------------------------------

    socket.on(
      'connect',
      handleConnect
    );

    socket.on(
      'disconnect',
      handleDisconnect
    );

    socket.on(
      'connect_error',
      handleConnectError
    );

    socket.on(
      'sensor:reading',
      handleReading
    );

    // --------------------------------------
    // CONNECT
    // --------------------------------------

    if (
      !socket.connected
    ) {
      socket.connect();
    } else {
      handleConnect();
    }

    // ======================================
    // CLEANUP
    // ======================================

    return () => {
      mountedRef.current =
        false;

      if (
        socket.connected
      ) {
        socket.emit(
          'device:unsubscribe',
          ENV.DEVICE_ID
        );
      }

      socket.off(
        'connect',
        handleConnect
      );

      socket.off(
        'disconnect',
        handleDisconnect
      );

      socket.off(
        'connect_error',
        handleConnectError
      );

      socket.off(
        'sensor:reading',
        handleReading
      );

      socket.disconnect();
    };
  }, [
    fetchData,
    normalizeReading,
  ]);

  // ========================================
  // RETURN
  // ========================================

  return {
    sensorData,

    isConnected,

    isLoading,

    refreshing,

    error,

    lastUpdated,

    refresh,

    fetchData,
  };
}