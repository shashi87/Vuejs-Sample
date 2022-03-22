import Vue from 'vue';

Vue.filter('capitalize', require('./capitalize').default);
Vue.filter('date', require('./date').default);
Vue.filter('from_now', require('./from_now').default);
Vue.filter('int_to_money', require('./int_to_money').default);
