import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SmartDevice, SmartScene, GridTelemetry, RoomType } from '../types';

interface SmartPowerContextType {
  devices: SmartDevice[];
  scenes: SmartScene[];
  currentRoom: RoomType;
  setCurrentRoom: (room: RoomType) => void;
  telemetry: GridTelemetry;
  powerHistory: number[];
  toggleDevice: (id: string) => void;
  addDevice: (name: string, room: string, watts?: number) => void;
  removeDevice: (id: string) => void;
  homeName: string;
  setHomeName: (name: string) => void;
  // Modals visibility
  homeModalVisible: boolean;
  setHomeModalVisible: (v: boolean) => void;
  addDeviceModalVisible: boolean;
  setAddDeviceModalVisible: (v: boolean) => void;
  qrModalVisible: boolean;
  setQrModalVisible: (v: boolean) => void;
  energyModalVisible: boolean;
  setEnergyModalVisible: (v: boolean) => void;
}

const INITIAL_DEVICES: SmartDevice[] = [
  {
    id: 'dev-76f3fc',
    name: 'Device76f3fc',
    room: 'Livingroom',
    statusText: 'Hors-ligne',
    isOn: false,
    activeWatts: 140,
    type: 'switch',
    isOnline: false,
  },
  {
    id: 'dev-pow-elite',
    name: 'Sonoff POW Élite 16A',
    room: 'Livingroom',
    statusText: 'En ligne',
    isOn: true,
    activeWatts: 1850,
    type: 'breaker',
    isOnline: true,
  },
  {
    id: 'dev-s31-bed',
    name: 'Prise Connectée S31',
    room: 'Bedroom',
    statusText: 'En ligne',
    isOn: true,
    activeWatts: 75,
    type: 'plug',
    isOnline: true,
  },
];

const INITIAL_SCENES: SmartScene[] = [
  {
    id: 'sc-1',
    name: 'Délestage Heures Pleines',
    desc: 'Coupe automatiquement les gros appareils si la charge dépasse 4 500 W',
    enabled: true,
    ruleType: 'AUTOMATION',
  },
  {
    id: 'sc-2',
    name: 'Mode Nuit Éco',
    desc: 'Extinction de toutes les prises en veille à 23h00',
    enabled: false,
    ruleType: 'SCHEDULE',
  },
];

const SmartPowerContext = createContext<SmartPowerContextType | undefined>(undefined);

export const SmartPowerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<SmartDevice[]>(INITIAL_DEVICES);
  const [scenes, setScenes] = useState<SmartScene[]>(INITIAL_SCENES);
  const [currentRoom, setCurrentRoom] = useState<RoomType>('all');
  const [homeName, setHomeName] = useState<string>('My Home');
  const [accumulatedKwh, setAccumulatedKwh] = useState<number>(14.85);
  const [powerHistory, setPowerHistory] = useState<number[]>([]);

  // Modal states
  const [homeModalVisible, setHomeModalVisible] = useState(false);
  const [addDeviceModalVisible, setAddDeviceModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [energyModalVisible, setEnergyModalVisible] = useState(false);

  // Load from local storage
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('spower_rn_devices');
        if (stored) setDevices(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Save on change
  const saveDevices = async (newDevs: SmartDevice[]) => {
    setDevices(newDevs);
    try {
      await AsyncStorage.setItem('spower_rn_devices', JSON.stringify(newDevs));
    } catch (e) {}
  };

  // Toggle device
  const toggleDevice = (id: string) => {
    const updated = devices.map(d => {
      if (d.id === id) {
        const nextState = !d.isOn;
        return {
          ...d,
          isOn: nextState,
          statusText: nextState ? 'En ligne' : 'Hors-ligne',
          isOnline: nextState,
        };
      }
      return d;
    });
    saveDevices(updated);
  };

  // Add new device
  const addDevice = (name: string, room: string, watts: number = 250) => {
    const newDev: SmartDevice = {
      id: `dev-${Math.random().toString(16).substring(2, 8)}`,
      name,
      room,
      statusText: 'En ligne',
      isOn: true,
      activeWatts: watts,
      type: 'switch',
      isOnline: true,
    };
    saveDevices([...devices, newDev]);
  };

  // Remove device
  const removeDevice = (id: string) => {
    saveDevices(devices.filter(d => d.id !== id));
  };

  // Telemetry loop (every 1s, zero cloud API)
  const activeDevices = devices.filter(d => d.isOn);
  const currentWatts = activeDevices.reduce((sum, d) => sum + d.activeWatts, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAccumulatedKwh(prev => prev + (currentWatts / (3600 * 1000)));
      setPowerHistory(prev => {
        const next = [...prev, currentWatts];
        return next.length > 60 ? next.slice(1) : next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentWatts]);

  const telemetry: GridTelemetry = {
    watts: currentWatts,
    voltage: 230.2,
    current: parseFloat((currentWatts / (230.2 * 0.98)).toFixed(1)),
    kwh: parseFloat(accumulatedKwh.toFixed(2)),
    cost: parseFloat((accumulatedKwh * 0.16).toFixed(2)),
    powerFactor: 0.98,
  };

  return (
    <SmartPowerContext.Provider
      value={{
        devices,
        scenes,
        currentRoom,
        setCurrentRoom,
        telemetry,
        powerHistory,
        toggleDevice,
        addDevice,
        removeDevice,
        homeName,
        setHomeName,
        homeModalVisible,
        setHomeModalVisible,
        addDeviceModalVisible,
        setAddDeviceModalVisible,
        qrModalVisible,
        setQrModalVisible,
        energyModalVisible,
        setEnergyModalVisible,
      }}
    >
      {children}
    </SmartPowerContext.Provider>
  );
};

export const useSmartPower = () => {
  const context = useContext(SmartPowerContext);
  if (!context) throw new Error('useSmartPower must be used within a SmartPowerProvider');
  return context;
};
