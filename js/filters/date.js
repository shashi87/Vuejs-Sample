import moment from 'moment';

export default function(date, format = 'LL', parseFormat = false, locale = 'en') {
    if (!date) return '';
    moment.locale(locale);
    return parseFormat ? moment(date, format).format(format) : moment(date).format(format);
}
