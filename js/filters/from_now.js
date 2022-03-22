import moment from 'moment';

export default function(date, locale = 'en') {
    if (!date) return '';
    moment.locale(locale);
    return moment(date).fromNow();
}
