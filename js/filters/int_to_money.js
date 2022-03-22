export default function(value) {
    if (typeof(value) === 'number') {
        value = '$ ' + (value / 100).toFixed(2);
    }

    return value;
}
