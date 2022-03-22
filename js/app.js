import Vue from 'vue';

require('spark-bootstrap');
require('./components/bootstrap');
require('./bootstrap');
require('./directives/bootstrap');
require('./filters');

window.moment = require('moment-timezone');

window.app = new Vue({
    mixins: [require('spark')],
});
