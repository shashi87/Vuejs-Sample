import Vue from 'vue';
import creditCardType from 'credit-card-type';

Vue.directive('cardNumber', {

    bind: function (el, binding, vnode) {

        let mask = function () {
            let v = $(el).val();
            v = v.toString().replace(/[^0-9]/g, "");
            if (v === undefined || v === null || v.length === 0) {
                el.cardFound = false;
                el.value = v;
                el.dispatchEvent(new Event('input', {bubbles: true}));
                return;
            }

            const types = creditCardType(v);
            if (!types.length || types.length > 1) {
                el.value = v;
                el.cardFound = false;
                el.dispatchEvent(new Event('input', {bubbles: true}));
                return;
            }

            const card = types[0];

            $(el).attr('maxlength', Math.max(...card.lengths) + card.gaps.length);

            let gapOffset = 0;
            card.gaps.forEach(g => {
                const pos = g + gapOffset++;
                if (v.length < pos) {
                    return;
                }
                v = `${v.slice(0, pos)} ${v.slice(pos)}`;
            });

            el.value = v;
            $(el).data(card);

            el.dispatchEvent(new Event('cardFound', {bubbles: true}));
            el.dispatchEvent(new Event('input', {bubbles: true}));
        };

        $(el).keypress(() => {
            setTimeout(mask, 1);
        });

        $(el).change(() => {
            setTimeout(mask, 1);
        });

        mask();
    },

});
