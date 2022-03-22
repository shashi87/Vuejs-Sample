import Vue from 'vue';
import form from '../utils/form';
import Login from './login';
import Guest from './guest';
import Guest1 from './guest-s1';
import DirectPayment from './direct-payment-s1';
import PartnerPay from './partner-pay';
import Pay from './pay';
import Confirm from './confirm';
import Logo from './icons/logo';
import SmallLogo from './icons/small-logo';
import VueTheMask from 'vue-the-mask';
import money from 'v-money';

Vue.use(money, {
    decimal: '.',
    thousands: ',',
    prefix: '$ ',
    suffix: '',
    precision: 2,
    masked: false,
});

Vue.use(VueTheMask);
window._ = require('lodash');

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

window.Form = form;
Vue.prototype.$http = window.axios;

Vue.component('logo', Logo);
Vue.component('small-logo', SmallLogo);
Vue.component('login', Login);
Vue.component('guest', Guest);
Vue.component('guest-s1', Guest1);
Vue.component('direct-payment-s1', DirectPayment);
Vue.component('partner-pay', PartnerPay);
Vue.component('pay', Pay);
Vue.component('confirm', Confirm);
Vue.component('terms', require('./terms').default);
Vue.component('address-fields', require('../components/address/fields2').default);
