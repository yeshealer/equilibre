import BigNumber from 'bignumber.js';

export function formatCurrency(amount: number | string, decimals = 2) {
  if (!isNaN(amount as any)) {
    if (BigNumber(amount).gt(0) && BigNumber(amount).lt(0.01)) {
      return '< 0.01';
    }

    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals,
    });

    return formatter.format(amount as number);
  } else {
    return 0;
  }
}

export function displayNumber(
  number: number | string,
  compact?: boolean,
  fractionDigits: number = 2
) {
  if (isNaN(number as any)) {
    const value = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
      ...(compact ? { notation: 'compact', compactDisplay: 'short' } : {}),
    }).format(0 as number);
    return value;
  }
  if (
    BigNumber(number).gt(0) &&
    BigNumber(number).lt(0.1 * 10 ** -fractionDigits)
  ) {
    return '< 0.01';
  }

  const value = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    ...(compact ? { notation: 'compact', compactDisplay: 'short' } : {}),
  }).format(number as number);

  return value;
}

export function displayCurrency(
  number: number | string,
  compact?: boolean,
  decimals?: number
) {
  if (isNaN(number as any)) {
    const value = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...(compact ? { notation: 'compact', compactDisplay: 'short' } : {}),
    }).format(0 as number);
    return value.replace(/US/, '');
  }
  const value = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...(compact ? { notation: 'compact', compactDisplay: 'short' } : {}),
  }).format(number as number);

  return value.replace(/US/, '');
}

export function getVotingPower(lockAmount: number, lockDays: number): number {
  return (lockAmount * (lockDays + 1)) / (4 * 365);
}
