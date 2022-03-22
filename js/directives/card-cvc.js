import Vue from 'vue';

Vue.directive('cardCvc', {

    bind: function (el, binding) {

        $(el).attr('maxlength', 4);

        let mask = function () {
            let v = $(el).val();
            v = v.toString().replace(/[^0-9]/g, "");
            if (v === undefined || v === null || v.length === 0) {
                return "";
            }

            $(el).val(v);
            el.value = v;

            el.dispatchEvent(new Event('input', {bubbles: true}));
        };

        $(el).keypress(() => {
            setTimeout(mask, 1);
        });

        mask();
    },

});
