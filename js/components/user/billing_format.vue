<script src="../bootstrap.js"></script>
<template>
    <div>
        <div class="card card-default">
            <div class="card-header">Payment Method</div>

            <div class="card-body">
                <div class="alert alert-success" v-if="successful">
                    Your credit card has been updated!
                </div>

                <div class="alert alert-warning" v-if="!$user.address">
                    You must provide an address before update your payment method.
                </div>

                <div class="row" v-if="!showForm">
                    <div class="col-8">
                        <i :class="getIconCard(card_brand)" class="mx-2"></i>
                        <span class="align-top">**** **** **** {{ cardLastFour }}</span>
                    </div>
                    <div class="col-4 text-right">
                        <button :disabled="!$user.address" class="btn btn-primary tw-text-white" @click="openForm"> Update</button>
                    </div>
                </div>

                <div v-if="showForm">
                    <div class="row align-items-center" >
                        <div class="form-group col-12">
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

                            <p class="tw-text-red mb-0 small" v-if="error">{{ error }}</p>
                        </div>
                    </div>

                    <div class="custom-control custom-checkbox form-group">
                        <input  v-model="form.terms"
                                type="checkbox"
                                class="custom-control-input"
                                id="terms"
                                :class="{'is-invalid': form.errors.has('terms')}">

                        <label class="custom-control-label" for="terms">
                            I accept the <a class="link" @click="$refs.terms.open()">Terms and Conditions</a>.
                        </label>
                    </div>

                    <terms ref="terms" @accept="acceptTerms()" />

                    <p class="invalid-feedback d-block" v-if="form.errors.has('terms')">
                        {{form.errors.get('terms')}}
                    </p>

                    <div class="text-right">
                        <button type="button" @click="cancelForm" class="btn btn-link tw-text-grey-darker tw-px-8 tw-py-2">
                            Cancel
                        </button>
                        <button-loading :loading="form.submitting" @click="saveNewCard" class="btn btn-primary">Save</button-loading>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: new Form({
                    terms: false,
                    card: {
                        number: '',
                        cvc: '',
                        expiration_date: '',
                    },
                }),

                cardIcon: 'fab fa-2x fa-cc-mastercard',
                showForm: false,
                error: null,
                cardLastFour: null,
                card_brand: null,
                successful: false,
            };
        },

        created() {
            this.fetchData();
        },

        methods: {
            async fetchData() {
                const { data: card } = await axios.get(route('current-card'));
                this.card_brand = card.card_brand;
                this.cardLastFour = card.card_last_four;
            },

            async saveNewCard() {
                try {
                    const { data: card } = await this.form.post(route('update-credit-card'));

                    this.cardLastFour = card.card_last_four;
                    this.successful = true;
                    this.showForm = false;
                    this.fetchData();
                } catch (response) {
                    this.$alert({ type: 'error', message: response.data.message });
                }
            },

            cancelForm() {
                this.clearForm();
                this.showForm = !this.showForm;
            },

            acceptTerms() {
                this.form.terms = true;
            },

            openForm() {
                this.clearForm();
                this.successful = false;
                this.showForm = true;
            },

            clearForm() {
                this.form = new Form({
                    terms: false,
                    card: {
                        number: '',
                        cvc: '',
                        expiration_date: '',
                    },
                });
            },

            getIconCard(type) {
                switch (type) {
                    case 'Visa':
                        return 'fab fa-2x fa-cc-visa';
                    case 'Amex':
                        return 'fab fa-2x fa-cc-amex';
                    case 'MasterCard':
                        return 'fab fa-2x fa-cc-mastercard';
                    case 'Discover':
                        return 'fab fa-2x fa-cc-discover';
                    case 'JCB':
                        return 'fas fa-2x fa-credit-card';
                    case 'DinersClub':
                        return 'fab fa-2x fa-cc-diners-club';
                    default:
                        return 'fas fa-2x fa-credit-card';
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
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

    .link {
        color: #488dc9 !important;
        text-decoration: none;
    }

    .link:hover {
        color: #488dc9 !important;
        cursor: pointer;
        text-decoration: underline !important;
    }
</style>
