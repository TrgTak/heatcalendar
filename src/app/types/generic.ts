export type OptionModel = {
    value: any,
    label: string
};

export type OptionSelect = (value: OptionModel) => any | void;

//FIXME: temporary type for dummy data. Replace with real aggregate api model when api is implemented
export type AggregateResponse = {
    [key: string]: number
};

export type LocaleMeta = {
    locale: Intl.Locale,
    monthLabels: string[],
    weekDayLabels: string[],
    weekStart: number
};

export type CalendarMeta = {
    year: number,
    days: number,
    months: {[key: string]: MonthMeta},
};

export type MonthMeta = {
    firstWeekday: number,
    transitionIndex: number,
    days: number,
    weekSpread: number,
};