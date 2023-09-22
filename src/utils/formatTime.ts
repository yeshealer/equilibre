import moment from 'moment';

export function formatTimestamp(timestamp: number, formatString: string = "YYYY-MM-DD"): string {
    return moment(timestamp * 1000).format(formatString);
}

export const getDurationDaysFromNow = (timestamp: number): [number, moment.Duration] => {
    const time = moment(timestamp * 1000);
    const duration = moment.duration(time.diff(moment()));

    const lockedDays = Math.ceil(Math.abs(duration.asDays()));
    return [lockedDays, duration];
}
export const getDurationSecondsFromNow = (timestamp: number): [number, moment.Duration] => {
    const time = moment(timestamp * 1000);
    const duration = moment.duration(time.diff(moment()));

    const lockedSeconds = Math.ceil(Math.abs(duration.asSeconds()));
    return [lockedSeconds, duration];
}


export const getSeparatedDurationStringFromNow = (timestamp: number, toDay = false): { value: number, unit: string } => {
    const [lockedDays, duration] = getDurationDaysFromNow(timestamp);
    if (toDay)
        return { value: lockedDays, unit: "days" };

    let value;
    let unit;
    if (lockedDays < 30) {
        value = lockedDays;
        unit = "days";
    }
    else if (lockedDays < 365) {
        value = Math.ceil(Math.abs(duration.asMonths()));
        unit = "months";
    }
    else {
        value = Math.ceil(Math.abs(duration.asYears()));
        unit = "years";
    }
    return { value, unit };
};

export const getDurationStringFromNow = (timestamp: number, toDay = false): string => {
    const [lockedDays, duration] = getDurationDaysFromNow(timestamp);
    if (toDay)
        return `${lockedDays} days`;

    let lockedDurationString;
    if (lockedDays < 30)
        lockedDurationString = `${lockedDays} days`;
    else if (lockedDays < 365)
        lockedDurationString = `${Math.ceil(Math.abs(duration.asMonths()))} months`;
    else
        lockedDurationString = `${Math.ceil(Math.abs(duration.asYears()))} years`;
    return lockedDurationString;
}

export const getDurationString = (duration: moment.Duration): string => {
    const lockedDays = Math.ceil(duration.asDays());
    let lockedDurationString;
    if (lockedDays < 30)
        lockedDurationString = `${lockedDays} days`;
    else if (lockedDays < 365)
        lockedDurationString = `${Math.ceil(duration.asMonths())} months`;
    else
        lockedDurationString = `${Math.ceil(duration.asYears())} years`;
    const temp = lockedDurationString;
    return temp;
};
