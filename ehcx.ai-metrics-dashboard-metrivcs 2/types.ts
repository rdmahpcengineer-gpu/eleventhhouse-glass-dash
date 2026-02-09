
// Import React to provide access to the React namespace for types like ReactNode
import React from 'react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
}

export interface CallData {
  time: string;
  inbound: number;
  outbound: number;
}

export interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: 'Available' | 'On Call' | 'Break' | 'Offline';
  avatar: string;
}

export interface ServiceLevelData {
  day: string;
  percentage: number;
}
