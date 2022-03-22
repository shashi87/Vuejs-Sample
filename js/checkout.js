import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';

Vue.use(VueSweetalert2);




require('./components/shared');
require('./checkout/bootstrap');
require('./directives/bootstrap');

window.moment = require('moment-timezone');

Vue.prototype.$user = Spark.user;
Vue.prototype.$confirm = (options = {}) => {
    return new Promise((resolve, reject) => {
        Vue.prototype.$swal(
            {
                title: options.title || 'Are you sure?',
                text: options.text || 'You will not be able to recover it!',
                type: options.type || 'warning',
                confirmButtonColor: options.confirmButtonColor || '#dc3545',
                cancelButtonColor: options.cancelButtonColor || '#2c3a49',
                confirmButtonText: options.confirmButtonText || 'Yes, proceed!',
                closeOnConfirm: options.closeOnConfirm || false,
                disableButtonsOnConfirm: true,
                showLoaderOnConfirm: true,
                showCancelButton: options.hideCancelButton? false : true,
                html: false,
            },
            function(confirm) {
                return confirm ? resolve(confirm) : reject(confirm);
            }
        );
    });
};

new Vue({
    el: '#checkout-app',
    data: () => ({}),
});
