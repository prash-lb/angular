export type TimelineKind = 'walk' | 'transport' | 'rer' | 'metro' | 'train' | 'bus' | 'waiting' | 'transfer' | 'other';

export interface TimelineStep {
  id: string;
  kind: TimelineKind;
  label: string;
  from: string;
  to: string;
  startTime: string;
  endTime: string;
  duration: string;
  description: string;
}