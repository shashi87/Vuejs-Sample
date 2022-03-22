import Vue from 'vue';

Vue.directive('zipcode', {

    bind: function (el) {

        $(el).attr('maxlength', 10);

        let mask = function () {
            let v = $(el).val();
            v     = v.toString().replace(/[^0-9]/g, '');
            if (v === undefined || v === null || v.length === 0) {
                return '';
            }

            v = v.replace(/^(\d{5})(\d)/g, '$1-$2');

            $(el).val(v);

            let event = new Event('input', {bubbles: true});
            el.value  = v;
            el.dispatchEvent(event);
        };

        $(el).keypress(() => {
            setTimeout(mask, 1);
        });

        $(el).on('change', () => {
            setTimeout(mask, 1);
        });

        $(el).on('keydown', () => {
            $(el).trigger('change');
        });

        mask();
    },

});
