import { ILockDuration, IInputPercentage } from '@/interfaces';

export const LOCK_DURATIONS: ILockDuration[] = [
  {
    label: '1 week',
    value: 7,
  },
  {
    label: '1 month',
    value: 30,
  },
  {
    label: '1 year',
    value: 365,
  },
  {
    label: '4 years',
    value: 4 * 365,
  },
];
export const LOCK_SMALL_DURATIONS: ILockDuration[] = [
  {
    label: '1W',
    value: 7,
  },
  {
    label: '6M',
    value: 180,
  },
  {
    label: '1Y',
    value: 365,
  },
  {
    label: '4Y',
    value: 4 * 365,
  },
];

export const VALUE_PRECENTAGES: IInputPercentage[] = [
  { label: '25%', value: 25 },
  { label: '50%', value: 50 },
  { label: '75%', value: 75 },
  { label: '100%', value: 100 },
];
