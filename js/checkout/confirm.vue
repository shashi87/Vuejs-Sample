<template>
    <div>
        <div class="card bg-white shadow-sm border-0 mb-3">
            <div
                class="card-header tw-cursor-pointer tw-bg-white tw-border-0 tw-font-medium tw-py-5 tw-text-grey-darker tw-flex tw-justify-between">

                <div class="tw-mt-1 font-roboto-slab-regular">
                    <i
                        class="fa tw-mr-2 tw-text-orange"
                        :class="{ 'fa-angle-right': !show, 'fa-angle-down': show }"
                    ></i>
                    Pay with
                    <b>{{ $user.name }}</b> account
                </div>

                <div class="logo-and-lock">
                    <small-logo />
                    <i class="ml-1 fa fa-lock tw-text-grey" />
                </div>
            </div>

            <div class="collapse show card-body">
                <div v-if="showForm">
                    <div class="row justify-content-center mb-3" v-if="mainCard">
                        <span v-if="paymentProfile">
                            <i :class="cardIcon" class="mx-2"></i>
                            ************ {{ paymentProfile.card_last_four }}
                        </span>
                    </div>

                    <div class="row align-items-center" v-if="!mainCard">
                        <div class="form-group col-12">
                            <div class="input-group credit-card">
                                <input
                                    id="card-number"
                                    type="text"
                                    class="form-control card-number"
                                    v-model="form.card.number"
                                    :class="{ 'is-invalid': form.errors.has('card.number') && !form.card.number }"
                                    v-card-number
                                />
                                <input
                                    type="text"
                                    class="form-control card-expiration-date"
                                    v-model="form.card.expiration_date"
                                    placeholder="MM-YY"
                                    :class="{ 'is-invalid': form.errors.has('card.expiration_date') && !form.card.expiration_date }"
                                    v-card-expiration
                                />
                                <input
                                    type="text"
                                    class="form-control card-cvc"
                                    v-model="form.card.cvc"
                                    placeholder="CVC"
                                    :class="{ 'is-invalid': form.errors.has('card.cvc') && !form.card.cvc }"
                                    v-card-cvc
                                />
                            </div>
                        </div>

                        <div class="col-12 form-group">
                            <div class="custom-control custom-checkbox" v-if="form.hasPaymentAccount">
                                <input
                                    class="custom-control-input"
                                    type="checkbox"
                                    value
                                    id="update"
                                    v-model="form.update"
                                    :class="{ 'is-invalid': form.errors.has('update') }"
                                />
                                <label class="custom-control-label" for="update">Update card</label>
                            </div>

                            <p class="invalid-feedback">{{ form.errors.get('update') }}</p>
                        </div>
                    </div>

                    <terms ref="terms" @accept="acceptTerms"/>

                    <div class="custom-control custom-checkbox form-group">
                        <input
                            v-model="form.terms"
                            type="checkbox"
                            class="custom-control-input"
                            id="terms"/>

                        <label class="custom-control-label" for="terms">
                            <a href="#" @click="$refs.terms.open()">I accept the Terms and Conditions</a>.

                            <p class="invalid-feedback d-block" v-if="form.errors.has('terms')">
                                {{ form.errors.get('terms') }}
                            </p>
                        </label>
                    </div>


                    <div class="row justify-content-end">
                        <button
                            type="button"
                            class="btn btn-link tw-text-grey-darker tw-px-8 tw-py-2"
                            @click="backToPaymentOptions"
                        >
                            Cancel
                        </button>
                        <button
                            class="btn btn-primary tw-text-white tw-px-8 tw-py-2 mr-3"
                            @click="pay"
                            :disabled="form.submitting"
                        >
                            <i v-if="form.submitting" class="fa fa-spinner fa-spin"></i>
                            {{ form.update ? 'Update & Pay' : 'Pay' }}
                        </button>
                    </div>
                </div>

                <div class="text-center" v-if="!showForm">
                    <button class="btn btn-primary tw-text-white" v-if="paymentProfile" @click="chooseCard('main')">
                        Pay with **** {{ paymentProfile.card_last_four }}
                    </button>

                    <button class="btn btn-primary tw-text-white" @click="chooseCard('another')" v-html="buttonText()"></button>
                </div>
            </div>
        </div>

        <div class="card bg-white shadow-sm border-0 mb-3" v-if="!$user.phone">
            <div class="card-body">
                <div class="card-title mb-4">Phone Number</div>

                <input-text
                    class="mb-0"
                    :form="form"
                    field="phone"
                    v-model="form.phone"
                    placeholder="eg: (999) 111-3333"
                    v-mask="['(###) ###-####', '(##) #####-####']"
                ></input-text>
            </div>
        </div>

        <div class="card bg-white shadow-sm border-0 mb-3">
            <div class="card-body">
                <div class="card-title mb-4">Billing Address</div>

                <address-fields
                    :form="form"
                    @selectedCountry="internationalFeeCountryBased"/>
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
            <div class="card-body d-flex justify-content-end" v-if="!showForm">
                <button type="button" @click="logout()"
                    class="btn btn-secondary tw-px-8 tw-py-2 tw-mb-1"
                    style="border: 1px solid grey;">
                    {{ logoutForm.submitting ? 'Logging out...' : 'Logout' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import SmallLogo from './icons/small-logo';

    export default {
        name: 'checkout-confirm',
        components: {
            SmallLogo,
        },
        props: {
            checkoutId: { required: true },
            total: { required: true },
            goldToken: { required: true },
            paymentProfile: { default: null },
            teamName: {required: true},
            isSubscription: {
                required: true,
            },
            internationalFee: { required: true },
        },
        data() {
            return {
                show: true,
                total_amount: '$ ' + (this.total / 100).toFixed(2),
                isFlexTokenTheme: process.env.MIX_APP_THEME === 'flextoken',
                form: new Form({
                    terms: false,
                    name: this.$user.name,
                    email: this.$user.email,
                    phone: this.$user.phone,
                    hasPaymentAccount: false,
                    card: {
                        number: '',
                        cvc: '',
                        expiration_date: '',
                    },
                }),
                formCancel: new Form({}),
                logoutForm: new Form({}),
                cardIcon: 'fab fa-2x fa-cc-visa',
                showForm: false,
                mainCard: false,
                error: null,
            };
        },
        mounted() {
            if (this.paymentProfile) {
                this.cardIcon = this.getCardIcon(this.paymentProfile.card_brand);
                this.form.hasPaymentAccount = true;
            }

            this.$set(this.form, 'address', this.$user.address || {});

            $('#collapseLogin')
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
                    this.total_amount = '$ ' + ((parseFloat(this.total) + parseFloat(this.internationalFee)) / 100).toFixed(2);

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
                    return
                }

                this.total_amount = '$ ' + (this.total / 100).toFixed(2);
                international_div.classList.add('d-none');
                document.getElementById('total_amount').innerHTML = this.total_amount;
            },

            isNotEmpty(str) {
                return str || 0 !== str.length;
            },

            confirm(options = {}) {
                return new Promise((resolve, reject) => {
                    this.$swal.mixin({
                        cancelButtonClass: 'btn btn-link',
                    });

                    const defaultOptions = {
                        title: 'Are you sure?',
                        text: 'You will not be able to recover it!',
                        confirmButtonColor: '#dc3545',
                        cancelButtonColor: '#2c3a49',
                        confirmButtonText: 'Yes, proceed!',
                        showCancelButton: true,
                        html: false,
                        reverseButtons: false,
                        imageUrl: '',
                        imageWidth: 0,
                        imageHeight: 0,
                    };

                    this.$swal
                        .fire(Object.assign({}, defaultOptions, options))
                        .then(({ value }) => {
                            return value ? resolve(value) : reject(false);
                        });
                });
            },

            async pay() {
                try {
                    if (!this.form.terms) {
                        this.$refs.terms.open();
                        return;
                    }

                    let confirmText = this.getConfirmText();
                    await this.confirm({
                        title: `<div class="d-flex flex-column">
                                    Finalize the Purchase of my ${this.isFlexTokenTheme ? 'FLEX token' : 'PMC Coin'}
                                    <small>To be used as selected below</small>
                                </div>`,
                        html: confirmText,
                        confirmButtonText: 'Confirm',
                        cancelButtonColor: '#2c3a49',
                        confirmButtonColor: '#488dc9',
                        reverseButtons: true,
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

                    let url = this.mainCard
                        ? `/checkout-confirm/${this.checkoutId}`
                        : `/checkout-another-card/${this.checkoutId}`;
                    const { data } = await this.form.post(url);
                    window.location = data.url;
                } catch (e) {
                    this.error = e.data && e.data.message;
                    if (e.data.status === 403) {
                        this.$swal.fire({
                            title: 'Error',
                            text: e.response && e.response.data && e.response.data.message,
                            type: 'warning',
                            confirmButtonColor: '#dc3545',
                            confirmButtonText: 'OK',
                            html: false,
                        });
                    } else {
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

            async logout() {
                try {
                    this.logoutForm.submitting = true;
                    await axios.get('/logout');
                } finally {
                    window.location.reload();
                }
            },

            chooseCard(option) {
                this.showForm = true;
                this.mainCard = option === 'main';
            },

            buttonText() {
                return this.form.hasPaymentAccount
                    ? 'Pay with another card'
                    : 'We need to update your info.<br><strong>Click here</strong>';
            },

            getCardIcon(brand) {
                switch (brand) {
                    case 'Visa':
                        return 'fab fa-2x fa-cc-visa';
                    case 'MasterCard':
                        return 'fab fa-2x fa-cc-mastercard';
                    case 'Amex':
                        return 'fab fa-2x fa-cc-amex';
                    case 'Discover':
                        return 'fab fa-2x fa-cc-discover';
                    default:
                        break;
                }
            },

            getConfirmText() {
                return `<h5 class="font-ubuntu">You are buying <span>${this.goldToken}</span> ${this.isFlexTokenTheme ? 'FLEX tokens' : 'PMC Coins'} for </h5>
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
                        </div>`;
            },

            backToPaymentOptions() {
                this.showForm = false;
                this.form.errors.errors = new Object();
                this.error = null;
            },

            acceptTerms() {
                this.form.terms = true;
                this.pay();
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import '~bootstrap/scss/functions';
    @import '~bootstrap/scss/variables';
    @import '~bootstrap/scss/mixins';
    @import '~bootstrap/scss/forms';

    .logo-and-lock {
        display: flex;
        align-items: center;
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

    .swal2-styled.swal2-cancel {
        background-color: #dc3545 !important;
    }
</style>
