<template>
    <div>
        <div class="card-body">
            <div class="form-group row" :class="{'text-danger': form.errors.has('name')}">
                <div class="col-sm-12">
                    <input-text
                        id="name"
                        class="mb-0"
                        v-model="form.name"
                        :form="form"
                        v-validate="'required'"
                        field="name"
                        placeholder="Name on Card"
                    ></input-text>
                </div>
            </div>

            <div class="col-md-12" style="padding-left:0px">
                <div class="checkout-form-list your-order" style="padding:0px;width:30%">
                    <img src="/css/newChanges/images/card.jpeg" alt />
                </div>
            </div>

            <div
                class="form-group row"
                :class="{'text-danger': form.errors.hasAny('card.number', 'card.expiration_date', 'card.cvc')}"
            >
                <div class="col-sm-12">
                    <div class="input-group credit-card">
                        <input
                            id="card-number"
                            type="text"
                            class="form-control card-number"
                            placeholder="Card Number"
                            v-model="form.card.number"
                            :class="{'is-invalid': form.errors.has('card.number')}"
                            v-mask="['#### #### #### ####']"
                        />
                    </div>

                    <p
                        :class="{'d-block': form.errors.has('card')}"
                        class="invalid-feedback tw-block"
                    >{{ form.errors.get('card') }}</p>
                </div>
            </div>

            <div
                class="form-group row"
                :class="{'text-danger': form.errors.hasAny('card.number', 'card.expiration_date', 'card.cvc')}"
            >
                <div class="col-sm-6">
                    <div class="input-group credit-card">
                        <input
                            type="text"
                            class="form-control card-expiration-date"
                            v-model="form.card.expiration_date"
                            placeholder="Expiration"
                            :class="{'is-invalid': form.errors.has('card.expiration_date')}"
                            v-card-expiration
                        />
                    </div>

                    <p
                        :class="{'d-block': form.errors.has('card')}"
                        class="invalid-feedback tw-block"
                    >{{ form.errors.get('card') }}</p>
                </div>
                <div class="col-sm-6">
                    <div class="input-group credit-card">
                        <input
                            type="text"
                            class="form-control card-cvc"
                            v-model="form.card.cvc"
                            placeholder="CVV"
                            :class="{'is-invalid': form.errors.has('card.cvc')}"
                            v-card-cvc
                        />
                    </div>

                    <p
                        :class="{'d-block': form.errors.has('card')}"
                        class="invalid-feedback tw-block"
                    >{{ form.errors.get('card') }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="checkout-form-list">
                        <input v-model="form.info.email" type="email" placeholder="Email Address " />
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="checkout-form-list">
                        <input type="text" v-model="form.info.phone" placeholder="Phone" />
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="checkout-form-list">
                        <input
                            type="text"
                            v-model="form.info.street_address"
                            placeholder="Street address"
                        />
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="checkout-form-list">
                        <input type="text" placeholder="Town / City" v-model="form.info.city" />
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="checkout-form-list">
                        <input type="text" placeholder="State / County " v-model="form.info.state" />
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="checkout-form-list">
                        <input type="text" placeholder="Postcode / Zip" v-model="form.info.zip" />
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="checkout-form-list">
                        <input type="text" placeholder="Country" v-model="form.info.country" />
                    </div>
                </div>
            </div>

            <div class="form-group row">
                <div class="form-group col-sm-12">
                    <div class="custom-control custom-checkbox">
                        <input
                            v-model="form.terms"
                            type="checkbox"
                            class="custom-control-input"
                            id="terms"
                            required="required"
                        />

                        <label class="text-center custom-control-label" for="terms">
                            I accept the
                            <a href="#" @click="$refs.terms.open()">Terms and Conditions</a>

                            <p
                                class="invalid-feedback d-block text-center"
                                v-if="form.errors.has('terms')"
                            >{{form.errors.get('terms')}}</p>
                        </label>
                    </div>
                </div>

                <terms ref="terms" @accept="acceptTerms()" />
            </div>

            <div class="col-md-12 order-button-payment">
                <button type="button" class="opc" @click="submit">NEXT</button>
            </div>
        </div>
    </div>
</template>
<script>
import Visa from './icons/visa';
import MasterCard from './icons/master-card';
import Discover from './icons/discover';
import AmericaExpress from './icons/america-express';
import axios from 'axios';

export default {
    name: 'direct-payment-s1',
    props: {
        total: { required: true },
        goldToken: { required: true },
        checkoutId: { required: true },
        checkoutItems: { required: true },
        teamName: { required: true },
        isSubscription: {
            required: true,
            type: Number,
        },
        completing: { default: false },
        internationalFee: { required: true },
        address: { required: false },
        user: { required: false },
    },
    components: { Discover, MasterCard, Visa, AmericaExpress },

    data() {
        return {
            show: true,
            error: [],
            total_amount: '$ ' + this.total,
            isFlexTokenTheme: process.env.MIX_APP_THEME === 'flextoken',
            checkout_id: this.checkoutId,
            checkout_d: this.checkoutItems,
            address_d: this.address,
            user_d: this.user,
            formCancel: new Form({}),
            form: new Form({
                card: {
                    number: null,
                    expiration_date: null,
                    cvc: null,
                },
                postal_code: null,
                email: null,
                password: null,
                email_confirmation: null,
                terms: false,
                international_fee: false,
            }),
        };
    },

    mounted() {
        let uri = window.location.href.split('?');
        if (uri.length == 2) {
            let vars = uri[1].split('&');
            let getVars = {};
            let tmp = '';
            vars.forEach(function(v) {
                tmp = v.split('=');
                if (tmp.length == 2) getVars[tmp[0]] = window.decodeURIComponent(tmp[1]);
            });
            console.log(getVars);
            // do
        }
        try {
            let user = JSON.parse(this.user);
            this.form.name = user.name;
            this.form.email = user.email;
            this.form.phone = user.phone;
            this.form.info = {};
            this.form.info.email = '';
            this.form.info.phone = '';
            this.form.info.street_address = '';
            this.form.info.city = '';
            this.form.info.state = '';
            this.form.info.zip = '';
            this.form.info.country = '';
        } catch (error) {
            console.info('Not received user data to parse');
        }

        try {
            let address = JSON.parse(this.address);
            this.form.postal_code = address.zipcode;
            this.$set(this.form, 'address', address || {});
        } catch (error) {
            console.info('Not received address data to parse');
        }

        $('#collapseGuest')
            .on('hide.bs.collapse', () => {
                this.show = !this.show;
            })
            .on('show.bs.collapse', () => {
                this.show = !this.show;
            });
    },

    methods: {
        internationalFeeCountryBased(country) {
            let international_div = document.getElementById('international_fee').parentElement;

            if ('USA' !== country && this.internationalFee > 0) {
                this.total_amount = '$ ' + parseFloat(this.total);
                console.log(this.internationalFee, country, international_div, '********');
                this.$confirm({
                    title: 'International Fee',
                    text: 'A fee will be charged for customers outside the United States',
                    type: 'info',
                    confirmButtonText: 'Got it',
                    confirmButtonColor: 'text-primary',
                    hideCancelButton: true,
                });

                international_div.classList.remove('d-none');
                document.getElementById('total_amount').innerHTML = this.total_amount;
                return;
            }

            this.total_amount = '$ ' + this.total;
            international_div.classList.add('d-none');
            document.getElementById('total_amount').innerHTML = this.total_amount;
        },
        expiry_check() {
            let month_year = this.form.card.expiration_date.split('-');
            if (month_year.length != 2) return false;
            let month = parseInt(month_year[0]);
            let year = parseInt(month_year[1]);
            let ac_year = parseInt(
                new Date()
                    .getFullYear()
                    .toString()
                    .substr(-2)
            );
            let ac_month = parseInt(new Date().getMonth() + 1);
            if (month == 0 || month > 12 || (year == ac_year && month < ac_month) || year < ac_year) return false;
            return true;
        },

        submit() {
            this.error = [];
            /* validations */
            let fields = [];

            if (!this.form.name) this.error.push('Name is mandatory.');
            if (!this.form.card.number) this.error.push('Card Number is mandatory.');
            if (!this.form.card.expiration_date) this.error.push('Expiration is mandatory.');
            else if (this.form.card.expiration_date && !this.expiry_check()) this.error.push('Invalid Expiration.');
            if (!this.form.card.cvc) this.error.push('CVV is mandatory.');
            else if (this.form.card.cvc && this.form.card.cvc.length < 3) this.error.push('Invalid CVV.');

            if (!this.form.terms) {
                this.error.push('Please accept the Terms and Conditions');
            }

            if (this.error.length)
                this.$swal.fire({
                    title: 'Validation',
                    text: this.error.length > 1 ? this.error.join('</br>') : this.error.join(''),
                    type: 'warning',
                    confirmButtonColor: '#dc3545',
                    confirmButtonText: 'OK',
                    html: this.error.join('</br>'),
                });
            else this.register();
        },

        confirm(options = {}) {
            const defaultOptions = {
                title: 'Are you sure?',
                text: 'You will not be able to recover it!',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#2c3a49',
                confirmButtonText: 'Yes, proceed!',
                showCancelButton: true,
                html: false,
                imageUrl: '',
                imageWidth: 0,
                imageHeight: 0,
            };

            return new Promise((resolve, reject) => {
                this.$swal.fire(Object.assign({}, defaultOptions, options)).then(({ value }) => {
                    return value ? resolve(value) : reject(false);
                });
            });
        },

        register() {
            try {
                var t_a = this.total_amount.replace('$ ', '');
                var gold_token = this.goldToken;
                var checkoutId = this.checkoutId;
                var checkout_details = this.checkout_d;
                var user_ = this.user_d;
                axios
                    .post('saveStep1', {
                        data: this.form,
                        total_amount: t_a,
                        gold_token: gold_token,
                        checkoutId: this.checkoutId,
                        checkout_details: checkout_details,
                        user: user_,
                    })
                    .then(function(response) {
                        var card_details = JSON.stringify(response.data.form_data.card);
                        var checkout = JSON.stringify(response.data.checkout_details);
                        var user = JSON.stringify(response.data.user);
                        return (window.location =
                            window.location.origin +
                            '/direct-checkout/step2?t_a=' +
                            t_a +
                            '&gold_token=' +
                            gold_token +
                            '&user=' +
                            user +
                            '&checkoutId=' +
                            checkoutId +
                            '&card_details=' +
                            card_details +
                            '&checkout=' +
                            checkout);
                    });
            } catch (e) {
                if (e.status === 422) return;
                if (e.data && e.data.status === 403) {
                    this.$swal.fire({
                        title: 'Error',
                        text: e.response.data.message,
                        type: 'warning',
                        confirmButtonColor: '#dc3545',
                        confirmButtonText: 'OK',
                        html: false,
                    });
                } else if (e) {
                    this.$swal.fire({
                        title: 'Error',
                        text: e.data.message,
                        type: 'warning',
                        confirmButtonColor: '#dc3545',
                        confirmButtonText: 'OK',
                        html: false,
                    });
                }
            }
        },

        async cancel() {
            try {
                await this.confirm({
                    title: 'Are you sure?',
                    text: `Cancel this purchase`,
                    type: 'warning',
                    confirmButtonColor: '#488dc9',
                    cancelButtonColor: '#2c3a49',
                });
                const { data } = await this.formCancel.post(`/checkout-cancel/${this.checkoutId}`);
                window.location = data.url;
            } catch (e) {
                window.error = e;
            }
        },

        headerText() {
            if (this.completing) return 'Validate your account info';

            return 'Create your Account';
        },

        subHeaderText() {
            if (this.completing) return;

            let brand = process.env.MIX_APP_THEME === 'flextoken' ? 'FLX' : 'PMC';

            return this.isSubscription ? `To subscribe you must have a ${brand} account` : '';
        },
        acceptTerms() {
            this.form.terms = true;
            this.register();
        },
    },
};
</script>

