import Echo from 'laravel-echo';
import Vue from 'vue';
import VTooltip from 'v-tooltip';
import Notifications from 'vue-notification';
import { loadProgressBar } from 'axios-progress-bar';
import form from './utils/form';
import VCalendar from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';
import VueCarousel from 'vue-carousel';
import DevsquadUi from '@elitedevsquad/ui';
import VueTheMask from 'vue-the-mask';
import money from 'v-money';
import VueSweetalert2 from 'vue-sweetalert2';
import { TooltipPlugin } from 'bootstrap-vue';

Vue.use(TooltipPlugin);
Vue.use(VueSweetalert2);

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

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    encrypted: true,
});

window.Form = form;
Vue.prototype.$http = window.axios;

Vue.use(VTooltip);
Vue.use(Notifications);
Vue.use(VCalendar, {
    firstDayOfWeek: 2, // Monday
    datePickerTintColor: '#488dc9',
});
Vue.use(VueCarousel);
Vue.use(DevsquadUi);
Vue.use(VueTheMask);
Vue.use(money, {
    decimal: '.',
    thousands: ',',
    prefix: '$ ',
    suffix: '',
    precision: 2,
    masked: false,
});

loadProgressBar();

Vue.mixin({ methods: { route: window.route } });

Vue.prototype.$team = Spark.state.currentTeam;
Vue.prototype.$user = Spark.user;
Vue.prototype.$userRole = Spark.state.currentTeam
    ? _.find(Spark.state.currentTeam.users, { id: Spark.userId }).pivot.role
    : null;

Vue.prototype.$alert = (options = {}) => {
    const title =
        options.title || (options.type === 'error' ? 'Error!' : options.type === 'success' ? 'Success!' : 'Warning!');
    return new Promise((resolve, reject) => {
        swal(
            {
                title,
                text: options.message || options.text || '',
                type: options.type || 'warning',
            },
            ok => (ok ? resolve(ok) : reject(ok))
        );
    });
};

Vue.prototype.$confirm = (options = {}) => {
    return new Promise((resolve, reject) => {
        swal(
            {
                title: options.title || 'Are you sure?',
                text: options.text || 'You will not be able to recover it!',
                type: options.type || 'warning',
                confirmButtonColor: options.confirmButtonColor || '#dc3545',
                confirmButtonText: options.confirmButtonText || 'Yes, delete it!',
                closeOnConfirm: options.closeOnConfirm || false,
                disableButtonsOnConfirm: true,
                showLoaderOnConfirm: true,
                showCancelButton: true,
                html: false,
            },
            function(confirm) {
                return confirm ? resolve(confirm) : reject(confirm);
            }
        );
    });
};

Vue.prototype.$colorLuminosity = color => {
    let nib = color.split('');
    let r = parseInt(nib[1] + nib[2], 16);
    let g = parseInt(nib[3] + nib[4], 16);
    let b = parseInt(nib[5] + nib[6], 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
};
