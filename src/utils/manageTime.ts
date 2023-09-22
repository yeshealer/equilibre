import moment from 'moment';

export function isPastTimestamp(timestamp: number): boolean {
    return moment() > moment(timestamp * 1000);
}

export function getDurationDays(timestamp: number): number {
    const lockDuration = moment.duration(moment(timestamp * 1000).diff(moment()));
    const lockDays = Math.floor(lockDuration.asDays());

    return lockDays;
}