export type RoomType = 'all' | 'Livingroom' | 'Bedroom' | 'Kitchen' | 'Garage' | 'Other';

export interface SmartDevice {
  id: string;
  name: string;
  room: string;
  statusText: string;
  isOn: boolean;
  activeWatts: number;
  standbyWatts?: number;
  type: 'switch' | 'breaker' | 'plug' | 'climate' | 'light';
  protocol?: string;
  isOnline: boolean;
}

export interface SmartScene {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  ruleType: string;
}

export interface GridTelemetry {
  watts: number;
  voltage: number;
  current: number;
  kwh: number;
  cost: number;
  powerFactor: number;
}
