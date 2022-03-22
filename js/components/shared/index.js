import Vue from 'vue';

// ----------------------------------------------------------------------
// Draws
// ----------------------------------------------------------------------
Vue.component('draw-in-progress', require('./draws/in-progress').default);
Vue.component('draw-schedule', require('./draws/schedule').default);
Vue.component('draw-status-update', require('./draws/status-update').default);
Vue.component('draw-user-flow', require('./draws/user-flow').default);
Vue.component('draw-version-control', require('./draws/version-control').default);
Vue.component('draw-no-data', require('./draws/no-data').default);
Vue.component('draw-pmc-coin', require('./draws/pmc-coin').default);
Vue.component('draw-keyboard-right', require('./draws/keyboard-right').default);
Vue.component('empty', require('./empty').default);

// ----------------------------------------------------------------------
// Icons
// ----------------------------------------------------------------------
Vue.component('icon-settings', require('./icons/settings').default);
Vue.component('icon-backlog', require('./icons/backlog').default);
Vue.component('icon-logout', require('./icons/logout').default);
Vue.component('icon-thunder', require('./icons/thunder').default);
Vue.component('wallet', require('./icons/wallet').default);
Vue.component('add-round', require('./icons/add-round').default);

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------
Vue.component('pagination', require('./pagination').default);
Vue.component('search-input', require('./search-input').default);
Vue.component('input-text', require('./input-text').default);
Vue.component('input-textarea', require('./input-textarea').default);
Vue.component('transactions-list', require('./transactions-list').default);
// Vue.component('input-texteditor', require('./input-texteditor').default);
Vue.component('input-select', require('./input-select').default);
Vue.component('modal', require('./modal').default);
Vue.component('input-suggestions', require('./input-suggestions').default);
Vue.component('form-title', require('./form-title').default);
Vue.component('select-country', require('./select-country').default);
Vue.component('select-state', require('./select-state').default);
Vue.component('report', require('./report').default);
