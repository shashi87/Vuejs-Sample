<template>
    <div>
        <div class="card bg-white border-0 mb-3 shadow-sm tw-overflow-hidden">
            <div class="tw-absolute tw-pin-r tw-pr-5 tw-pt-4 tw-flex tw-right-0">
                <visa class="tw-mr-1"></visa>
                <master-card class="tw-mr-1"></master-card>
                <discover class="tw-mr-1"></discover>
                <america-express></america-express>
            </div>

            <div class="card-header tw-cursor-pointer bg-white tw-font-medium tw-py-5 tw-text-grey-darker border-bottom-0">
                <div class="md:tw-mt-0 tw-mt-5">
                    <i class="fa sm:tw-mr-2 tw-text-orange"
                       :class="{'fa-angle-right' : !show , 'fa-angle-down': show}"></i>
                    {{ headerText() }}
                </div>
            </div>

            <div class="collapse show">
                <div class="tw-font-light tw-pl-5 tw-text-grey-dark">
                    {{ subHeaderText() }}
                </div>

                <div class="card-body">
                    <div class="form-group row" :class="{'text-danger': form.errors.has('name')}">
                        <label for="name" class="col-sm-4 md:tw-text-right col-form-label">
                            Name
                        </label>

                        <div class="col-sm-8">
                            <input-text id="name" class="mb-0" v-model="form.name" :form="form"
                                        field="name"></input-text>
                        </div>
                    </div>

                    <div class="form-group row"
                         :class="{'text-danger': form.errors.hasAny('card.number', 'card.expiration_date', 'card.cvc')}">
                        <label for="card-number" class="col-sm-4 md:tw-text-right col-form-label">Card</label>

                        <div class="col-sm-8">
                            <div class="input-group credit-card">
                                <input id="card-number" type="text"
                                       class="form-control card-number"
                                       v-model="form.card.number"
                                       :class="{'is-invalid': form.errors.has('card.number')}"
                                       v-mask="['#### #### #### ####']">

                                <input type="text"
                                       class="form-control card-expiration-date"
                                       v-model="form.card.expiration_date"
                                       placeholder="MM-YY"
                                       :class="{'is-invalid': form.errors.has('card.expiration_date')}"
                                       v-card-expiration>

                                <input type="text" class="form-control card-cvc"
                                       v-model="form.card.cvc"
                                       placeholder="CVC"
                                       :class="{'is-invalid': form.errors.has('card.cvc')}"
                                       v-card-cvc>
                            </div>

                            <p :class="{'d-block': form.errors.has('card')}"
                               class="invalid-feedback tw-block">{{ form.errors.get('card') }}</p>
                        </div>
                    </div>

                    <div class="form-group row" :class="{'text-danger': form.errors.has('postal_code')}">
                        <label for="postal_code" class="col-sm-4 md:tw-text-right col-form-label">
                            Postal Code
                        </label>

                        <div class="col-sm-8">
                            <input-text id="postal_code" class="mb-0" v-model="form.postal_code" :form="form"
                                        field="postal_code"></input-text>
                        </div>
                    </div>

                    <div class="form-group row" :class="{'text-danger': form.errors.has('email')}">
                        <label for="email2" class="col-sm-4 md:tw-text-right col-form-label">Email</label>

                        <div class="col-sm-8">
                            <input-text id="email2" type="email" class="mb-0" v-model="form.email" :form="form"
                                        field="email"></input-text>
                        </div>
                    </div>

                    <div class="form-group row">
                            <label for="confirmationEmail" class="col-sm-4 md:tw-text-right col-form-label">
                                Confirm Email
                            </label>

                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="confirmationEmail"
                                       v-model="form.email_confirmation">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-sm-4 md:tw-text-right col-form-label">Password</label>

                            <div class="col-sm-8">
                                <input type="password" class="form-control" id="password" v-model="form.password"
                                       :class="{'is-invalid': form.errors.has('password')}">
                                <p class="invalid-feedback">{{form.errors.get('password')}}</p>
                            </div>
                        </div>

                    <div class="form-group row" :class="{'text-danger': form.errors.has('phone')}">
                        <label for="phone" class="col-sm-4 md:tw-text-right col-form-label">Phone</label>

                        <div class="col-sm-8">
                            <input-text id="phone" class="mb-0" v-model="form.phone" :form="form" field="phone"
                                        v-mask="['(###) ###-####', '(##) #####-####']"></input-text>
                        </div>
                    </div>
                </div>
            </div>

            <terms ref="terms" @accept="acceptTerms()"/>
        </div>

        <div class="card bg-white shadow-sm border-0 mb-3">
            <div class="card-body">
                <div class="card-title mb-4">Billing Address</div>

                <address-fields
                    @selectedCountry="internationalFeeCountryBased"
                    horizontal label-size="4"
                    :form="form">
                </address-fields>
            </div>
        </div>

        <div class="card bg-white shadow-sm border-0 mb-3">
            <div class="card-body text-justify">
                <p class="tw-text-grey-dark">
                    Upon selecting {{ isFlexTokenTheme ? 'FLEX token' : 'PMC Coin'}}, you will be authorizing the purchase of a digital token provided by DG Capital.
                </p>
            </div>
        </div>

        <div class="card bg-white shadow-sm border-0 mb-5">
            <div class="card-body d-flex">

                <div>
                    <div class="form-group col-sm-8 offset-md-4">
                        <div class="custom-control custom-checkbox">
                            <input
                                    v-model="form.terms"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="terms">

                            <label class="text-center custom-control-label" for="terms">
                                <a href="#" @click="$refs.terms.open()">I accept the Terms and Conditions</a>

                                <p class="invalid-feedback d-block text-center" v-if="form.errors.has('terms')">
                                    {{form.errors.get('terms')}}
                                </p>
                            </label>
                        </div>

                    </div>

                    <terms ref="terms" @accept="acceptTerms()"/>
                </div>

                <div class="mt-1">
                    <button :disabled="form.submitting" @click="submit"
                            class="btn btn-primary tw-text-white tw-px-8 tw-py-2">
                        <i v-if="form.submitting" class="fa fa-spinner fa-spin"></i>
                        Pay
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Visa from './icons/visa';
    import MasterCard from './icons/master-card';
    import Discover from './icons/discover';
    import AmericaExpress from './icons/america-express';

    export default {
        name: 'guest',
        props: {
            total: { required: true },
            goldToken: { required: true },
            checkoutId: { required: true },
            teamName: { required: true },
            isSubscription: {
                required: true, type: Number
            },
            completing: { default: false },
            internationalFee: { required: true },
            address: { required: false},
            user: { required: false},
        },
        components: { Discover, MasterCard, Visa, AmericaExpress },

        data() {
            return {
                show: true,
                total_amount: '$ ' + (this.total / 100).toFixed(2),
                isFlexTokenTheme: process.env.MIX_APP_THEME === 'flextoken',
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
            try {
                let user = JSON.parse(this.user);
                this.form.name  = user.name;
                this.form.email = user.email;
                this.form.phone = user.phone;
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
                    this.total_amount =
                        '$ ' + ((parseFloat(this.total) + parseFloat(this.internationalFee)) / 100).toFixed(2);

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

                this.total_amount = '$ ' + (this.total / 100).toFixed(2);
                international_div.classList.add('d-none');
                document.getElementById('total_amount').innerHTML = this.total_amount;
            },

            submit() {
                this.register();
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
                    this.$swal
                        .fire(Object.assign({}, defaultOptions, options))
                        .then(({ value }) => {
                            return value ? resolve(value) : reject(false);
                        });
                });
            },

            async register() {
                try {
                    if (!this.form.terms) {
                        this.$refs.terms.open();
                        return;
                    }

                    await this.confirm({
                        title: `<div class="d-flex flex-column">
                                    Finalize the Purchase of my ${this.isFlexTokenTheme ? 'FLEX token' : 'PMC Coin'}
                                    <small>To be used as selected below</small>
                                </div>`,
                        html:  `<h5 class="font-ubuntu">You are buying <span>${this.goldToken}</span> ${this.isFlexTokenTheme ? 'FLEX tokens' : 'PMC Coins'} for </h5>
                                <h4 class="font-weight-bold font-ubuntu-bold">${this.total_amount}</h4>
                                <div class="text-left">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="purchase-personal" name="purchase-option" value="personal">
                                        <label class="custom-control-label" for="purchase-personal">Transfer ${this.isFlexTokenTheme ? 'FLEX tokens' : 'PMC Coins'} to my personal wallet.</label>
                                    </div>
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="purchase-vendor" name="purchase-option" value="vendor" checked>
                                        <label class="custom-control-label" for="purchase-vendor">Transfer <span class="font-ubuntu">${this.total_amount}</span>, from my ${this.isFlexTokenTheme ? 'FLEX token' : 'PMC Coin'} balance, to ${this.teamName} for purchase of products and/or services.</label>
                                    </div>
                                </div>`,
                        confirmButtonText: 'Confirm',
                        confirmButtonColor: '#488dc9',
                        cancelButtonColor: '#2c3a49',
                        imageUrl: this.isFlexTokenTheme ? '../images/secondary_domain/full-logo.svg' : '../images/landing-page/PMC-full.png',
                        imageWidth: 88,
                        imageHeight: 88,
                        width: '38em',
                        preConfirm: () => {
                            return $('input[name="purchase-option"]:checked').val() !== undefined;
                        },
                    });

                    if ($('input[name=purchase-option]:checked').val() === 'personal') {
                        const { data } = await this.form.post(`/checkout-sendmail/${this.checkoutId}`);

                        await this.confirm({
                            title: '',
                            html:  `<h5>To complete this purchase of ${this.isFlexTokenTheme ? 'FLEX tokens' : 'PMC Coins'}, and have them transferred to your wallet, please contact us at 877.382.2450</h5>`,
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#488dc9',
                            showCancelButton: false,
                            imageUrl: this.isFlexTokenTheme ? '../images/secondary_domain/full-logo.svg' : '../images/landing-page/PMC-full.png',
                            imageWidth: 88,
                            imageHeight: 88,
                            width: '38em',
                        });

                        return window.location = data.url;
                     }

                    this.form.time_zone = window.moment.tz.guess();

                    const { data } = await this.form.post(`/checkout-registration/${this.checkoutId}`);
                    window.location = data.url;
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

                return this.isSubscription
                    ? `To subscribe you must have a ${brand} account`
                    : '';
            },

            acceptTerms() {
                this.form.terms = true;
                this.register();
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import '~bootstrap/scss/functions';
    @import '~bootstrap/scss/variables';
    @import '~bootstrap/scss/mixins';
    @import '~bootstrap/scss/forms';

    .force-show {
        display: block !important;
    }

    .form-control.is-invalid {
        background-image: none;
        padding-right: 0;
    }

    .credit-card {
        .card-number {
            width: auto;
            max-width: calc(100% - 133px);
        }

        .card-expiration-date {
            width: 74px;
            max-width: 74px;
            margin-left: 2px;
            margin-right: 2px;

            &::placeholder {
                font-size: 14px;
            }
        }

        .card-cvc {
            width: 55px;
            max-width: 55px;

            &::placeholder {
                font-size: 14px;
            }
        }
    }

    .custom-control-input ~ .custom-control-label::before {
        top: 18px;
    }

    .custom-checkbox .custom-control-input ~ .custom-control-label::after {
        top: 18px;
    }
</style>
