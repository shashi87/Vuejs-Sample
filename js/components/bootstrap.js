import Vue from 'vue';

require('./../spark-components/bootstrap');
require('./shared');

Vue.component('kiosk-developers', require('./kiosk/developers').default);
Vue.component('kiosk-companies', require('./kiosk/companies').default);
Vue.component('kiosk-payment-accounts', require('./kiosk/payment-accounts').default);
Vue.component('kiosk-transaction-history', require('./kiosk/transaction-history').default);
Vue.component('dashboard', require('./dashboard/dashboard').default);
Vue.component('customer-dashboard', require('./dashboard/customer/dashboard').default);
Vue.component('pmc-dashboard', require('./pmc/dashboard').default);
Vue.component('widget-list', require('./widget/list').default);
Vue.component('wallet-list', require('./wallet/list').default);
Vue.component('customer-list', require('./customer/list').default);
Vue.component('customer-show', require('./customer/show').default);
Vue.component('register', require('./auth/register').default);
Vue.component('register-client', require('./auth/register-client').default);
Vue.component('terms', require('../checkout/terms').default);
Vue.component('user-list', require('./user/list').default);
Vue.component('products-list', require('./products/list').default);
Vue.component('products-form', require('./products/form').default);
Vue.component('company-settings-color', require('./company/settings-color').default);
Vue.component('update-profile-photo', require('./user/update-profile-photo').default);
Vue.component('address-fields', require('./address/fields').default);
Vue.component('billing_format', require('./user/billing_format').default);
Vue.component('update-team-address', require('./company/update-team-address').default);
Vue.component('link-list', require('./link/list').default);
Vue.component('update_address', require('./user/update_address').default);
Vue.component('batch-processed-transactions', require('./kiosk/batch-processed-transactions').default);
