import Vue from 'vue';

Vue.directive('tooltip', {
    bind: function (el, binding) {
        $(el).attr('data-toggle', 'tooltip')
            .attr('title', binding.value.title)
            .attr('data-placement', binding.arg || 'top')
            .attr('trigger', 'hover').tooltip();
        $(el).on('shown.bs.tooltip', function () {
            $('.tooltip').addClass('scale').css('opacity', 1);
        });
    },
});
