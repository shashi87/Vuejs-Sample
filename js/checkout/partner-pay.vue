<template>
<!--     <div class="m-12">
        <button :disabled="form.submitting" @click="submit"
                class="btn btn-warning tw-text-white tw-px-12">
            <i v-if="form.submitting" class="fa fa-spinner fa-spin"></i>
           COMPLETE TRANSACTION
        </button>
    </div> -->

    <div class="row">
        <div class="col-md-6">
            <div class="checkout-form-list">

                <input v-model="form.email" type="email" placeholder="Email Address "  value="" />
            </div>
        </div>
        <div class="col-md-6">
            <div class="checkout-form-list">                                        
                <input type="text" placeholder="Phone" v-model="form.phone" />
            </div>
        </div>
        <div class="col-md-12">
            <div class="checkout-form-list">
                <input type="text" placeholder="Street address" v-model="form.address.line1" />
            </div>
        </div>
        <!--  <div class="col-md-4">
            <div class="checkout-form-list">                                        
                <input type="text" placeholder="State / County " v-model="form.address.state" />
            </div>
        </div>
        <div class="col-md-2">
            <div class="checkout-form-list">                                        
                <input type="text" placeholder="Postcode / Zip" v-model="form.address.postal_code"/>
            </div>
        </div>    -->                           
        <!-- <div class="col-md-12">
            <div class="checkout-form-list">
                <input type="text" placeholder="Country" v-model="form.address.country"/>
            </div>
        </div> -->
        <!-- <div class="col-md-12">
            <div class="order-button-payment">
                <input type="hidden" name="checkout" value="{{$checkout}}">
                <input type="submit" value="COMPLETE TRANSACTION" />
            </div>
        </div> -->
        <address-fields
                    @selectedCountry="internationalFeeCountryBased"
                    horizontal label-size="4"
                    :form="form">
                </address-fields>

        <div class="col-md-12">
            <div class="order-button-payment">
                <button :disabled="form.submitting" type="button" @click="submit"
                        class="btn opc">
                    <i v-if="form.submitting" class="fa fa-spinner fa-spin"></i>
                   CONFIRM PARTNER PAYMENT FOR REGISTRATION
                </button>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'partner-pay',
        props: {
            total: { required: true },
            goldToken: { required: true },
            checkoutId: { required: true },
            cardDetailsNumber: { required: true },
            cardDetailsExpirationDate: { required: true },
            cardDetailsCvc: { required: true },
            email: { required: true },
            
            address: { required: true},
            city: { required: true},
            user: {required:true},
            name:{ required: true },
            checkoutItems: {required: true},
            
        },
        

        data() {
            return {
                show: true,
                errors:[],
                total_amount: '$ ' + this.total,
                isFlexTokenTheme: process.env.MIX_APP_THEME === 'flextoken',
                formCancel: new Form({}),
                form: new Form({
                    card: {
                        number: this.cardDetailsNumber,
                        expiration_date: this.cardDetailsExpirationDate,
                        cvc: this.cardDetailsCvc,
                    },
                    address:{
                        line1: null,
                        city: null,
                        state: null,
                        
                        country: null,
                        zipcode: null,
                    },
                    postal_code: this.postalCode,
                    zipcode: this.postalCode,
                    email: this.email,
                    terms: true,
                    international_fee: false,
                    name: this.name,
                    user: this.user,
                    checkoutDetails: this.checkoutItems,
                    totalAmount: '$ ' + this.total,
                    totalAsIt : ''+this.total
                }),
            };
        },

        mounted() {
            try {
                let user = JSON.parse(this.user);
                console.log(user);
                this.form.name  = user.name;
                this.form.email = user.email;
                this.form.phone = user.phone;
                this.form.address.line1 = user.address.line1;
                this.form.address.city = user.address.city;
                this.form.address.country = user.address.country;
                this.form.address.state = user.address.state;
               // this.form.address.postal_code = user.address.zipcode;
                this.form.postal_code = user.address.zipcode;
                this.form.address.zipcode = user.address.zipcode;
            } catch (error) {
                console.info('Not received user data to parse');
            }

            try {
                let address = JSON.parse(this.address);
                this.form.postal_code = postal_code;
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
                this.errors = []
                //alert((this.form.phone).length);
                if(!this.form.email) this.errors.push('Email is mandatory.')
                if(!this.form.phone) this.errors.push('Phone Number is mandatory.')
                if((this.form.phone).length < 14 || (this.form.phone).length >15) this.errors.push('Phone number must be of 14 or 15 digits')
                if(!this.form.address.line1) this.errors.push('Address is mandatory.')
                if(!this.form.address.city) this.errors.push('City is mandatory.')
                if(!this.form.address.state) this.errors.push('State is mandatory.')
                if(!this.form.address.zipcode) this.errors.push('Postal Code is mandatory.')
                if(!this.form.address.country) this.errors.push('Country is mandatory.')

                if(this.errors.length){
                    this.$swal.fire({
                        title: 'Validation',
                        text: this.errors.length > 1 ? this.errors.join('</br>') : this.errors.join(''),
                        type: 'warning',
                        confirmButtonColor: '#dc3545',
                        confirmButtonText: 'OK',
                        html: this.errors.join('</br>'),
                    });
                }else{
                    this.register();
                }
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
                    /*if (!this.form.terms) {
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

                    this.form.time_zone = window.moment.tz.guess();*/

                    const { data } = await this.form.post(`/direct-checkout-guest/${this.checkoutId}`);
                    console.log(data.url);
                    console.log(data.redirect_url);

                   // window.location = "https://pmcapital.com/";
                    /* build a form and post the values */
                    // if(data.redirect_url){
                    //     window.location = data.url+'&redirect='+encodeURIComponent(data.redirect_url);
                    // }else{
                    //     window.location = data.url;
                    // }

                    /* end of form */
                } catch (e) {
                   /* if (e.status === 422) return;
                    if (e.data && e.data.status === 403) {
                        this.$swal.fire({
                            title: 'Error',
                            text: e.response.data.message,
                            type: 'warning',
                            confirmButtonColor: '#dc3545',
                            confirmButtonText: 'OK',
                            html: false,
                        });
                    } else */if (e) {
                        this.$swal.fire({
                            title: 'Error  rrr',
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
