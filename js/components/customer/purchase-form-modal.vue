<template>
    <modal ref="modal" size="xl">
        <span slot="title">Purchase</span>

        <div class="alert alert-danger d-flex align-items-center" v-if="error">
            <i class="fa fa-exclamation-triangle fa-2x mr-3"></i>
            <div>
                <div class="tw--mb-1"><b>Error</b></div>
                <div>{{ error }}</div>
            </div>
        </div>

        <div class="form-row">
            <div class="col-12 col-lg-6">
                <label class="form-label">Customer</label>
                <input-suggestions placeholder="Search a customer" class="mb-3"
                    v-model="form.customer_id"
                    :form="form"
                    field="customer_id"
                    left-icon="fa fa-user"
                    :open-on-focus="true"
                    :loading="searchingCustomers"
                    @search="onSearchCustomer"
                    @selected="updateCustomerType"
                    :options="customers">
                    <div slot="option" slot-scope="{ item: customer, highlighted, selected }">
                        {{ customer.name }}
                        <div class="badge badge-dark" v-if="customer.customer_type === 'users'">User</div>
                        <span v-if="customer.phone" :class="{'text-black-50': highlighted && !selected, 'text-white': selected}">
                            - {{ customer.phone }}</span>
                        <div class="tw-text-xs" :class="{'text-black-50': highlighted && !selected, 'text-white': selected}">{{ customer.email }}</div>
                    </div>
                </input-suggestions>
            </div>

            <div class="col">
                <div class="form-row">
                    <div class="col-12 col-md-12 col-lg-6">
                        <input-text v-model="form.card.number"
                            :form="form"
                            field="card.number"
                            label="Card Number"
                            :right-icon="cardIcon"
                            @input="updateCardIcon"
                            v-mask="'#### #### #### ####'"
                            placeholder="**** **** **** ****"/>
                    </div>

                    <div class="col-12 col-md-6 col-lg-3">
                        <input-text v-model="form.card.expiration"
                            :form="form"
                            field="card.expiration"
                            label="Expiration"
                            placeholder="**/**"
                            :tokens="dateTokens"
                            v-mask="'##/##'"/>
                    </div>

                    <div class="col-12 col-md-6 col-lg-3">
                        <input-text v-model="form.card.cvc"
                            :form="form"
                            field="card.cvc"
                            label="CVC"
                            placeholder="***"
                            v-mask="['###', '####']"/>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="customer && !hasAddress" class="alert alert-warning d-flex align-items-center">
            <i class="fa fa-exclamation-triangle mr-2"></i>
            <span>
                This customer doesn't have an address.
                Please, <a href="#" @click.prevent="editCustomer">add an address</a> before continuing the purchase.
            </span>
        </div>

        <input-select v-model="form.wallet_id" :form="form" field="wallet_id" v-if="wallets.length > 1"
            label="Wallet"
            :options="wallets"
            labeled-by="nickname"
            placeholder="Select a wallet">
        </input-select>

        <label class="form-label">Add a Product</label>
        <input-suggestions placeholder="Search a product" class="mb-3" ref="productSearch"
            @selected="addProduct"
            object-value
            :form="form"
            field="items"
            :open-on-focus="true"
            :options="productOptions"
            :loading="searchingProducts"
            @search="onSearchProduct"
            left-icon="fa fa-boxes">
            <div class="d-flex align-items-center justify-content-between" slot="option" slot-scope="{ item: product }">
                <div class="mr-2">
                    <div class="tw--mb-1">{{ product.name }}</div>
                    <div class="tw-text-xs text-black-50">{{ product.description }}</div>
                </div>
                <span>{{ product.price / 100 | currency }}</span>
            </div>
        </input-suggestions>

        <div v-if="items.length">
            <label class="form-label">Items:</label>

            <div class="table-responsive shadow-sm">
                <table class="table table-bordered table-striped mb-0">
                    <thead>
                        <th style="width: 110px">Product ID</th>
                        <th>Item Name</th>
                        <th style="width: 90px">Quantity</th>
                        <th style="width: 135px">Price Per Unit</th>
                        <th style="width: 135px">Total Amount</th>
                        <th style="width: 70px"></th>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) of items" :key="index"
                            :class="{'text-danger tw-bg-red-lightest': item.invalid}">
                            <td class="align-middle px-3 py-1">{{ item.product.id }}</td>

                            <td class="align-middle px-3 py-1">
                                <div class="tw--mb-1">{{ item.product.name }}</div>
                                <div class="tw-text-xs text-black-50 mb-0">{{ item.product.description }}</div>
                            </td>

                            <td class="align-middle px-3 py-1">
                                <input type="number" min="1" v-model="item.quantity" class="form-control form-control-sm"
                                    style="width: 100px"
                                    :class="{'is-invalid': item.invalid}">
                            </td>

                            <td class="align-middle px-3 py-1">
                                <input type="number" v-model="item.unit_price" class="form-control form-control-sm"
                                    style="width: 100px"
                                    v-money
                                    :class="{'is-invalid': item.invalid}">
                            </td>

                            <td class="align-middle px-3 py-1">
                                {{ totalAmount(item) | currency }}
                            </td>

                            <td class="align-middle px-3 py-1">
                                <button class="btn btn-danger btn-sm" @click="remove(item)">
                                    <i class="fa fa-times"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr class="bg-light">
                            <td colspan="4" class="text-right">
                                Service Fee:
                            </td>
                            <td colspan="2">
                                {{ serviceFee() | currency }}
                            </td>
                        </tr>
                        <tr v-if="internationalFee() > 0" class="bg-light">
                            <td colspan="4" class="text-right">
                                International Fee:
                            </td>
                            <td colspan="2">
                                {{ internationalFee() | currency }}
                            </td>
                        </tr>
                        <tr class="bg-light text-success">
                            <td colspan="4" class="text-right font-weight-bold lead text-uppercase">
                                total:
                            </td>
                            <td colspan="2" class="lead font-weight-bold">{{ total() + serviceFee() + internationalFee() | currency }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <div slot="footer" class="d-flex align-items-center">
            <button class="btn btn-link ml-auto" @click="close">Cancel</button>
            <button-loading :loading="form.submitting" class="btn btn-primary ml-2" @click="purchase" :disabled="!hasAddress">
                <i class="fa fa-dollar-sign mr-1" v-if="!form.submitting"></i>
                Charge
            </button-loading>
        </div>
    </modal>
</template>

<script>
import ModalComponent from '@/mixins/modal-component';
import _ from 'lodash';

export default {
    mixins: [ModalComponent],

    data() {
        return {
            items: [],
            form: new Form({ items: [], card: { number: null } }),
            customers: [],
            customer: null,
            productOptions: [],
            wallets: [],
            searchingCustomers: false,
            searchingProducts: false,
            cardIcon: 'fa fa-credit-card',
            error: null,
            dateTokens: {
                M: {
                    pattern: /(0?[1-9]|1[012])/,
                },
            },
        };
    },

    computed: {
        hasAddress() {
            return this.customer && this.customer.address;
        },
    },

    methods: {
        setup(data = {}) {
            this.form = new Form(data || { items: [], card: { number: null }, wallet_id: null });
            this.items = [];
            this.form.items = this.items;
            this.form.card = this.form.card || { number: null };
            this.error = null;
            this.customer = null;
            this.fetchWallets();
            this.searchCustomers();
            this.searchProducts();

            return this;
        },

        setupCustomer(customer) {
            this.setup({ customer_id: customer.id, customer_type: customer.customer_type });
            this.customers = this.customers.length ? this.customers : [customer];
            this.customer = customer;

            return this;
        },

        onSearchCustomer: _.debounce(function(search) {
            this.searchCustomers(search);
        }, 500),

        onSearchProduct: _.debounce(function(search) {
            this.searchProducts(search);
        }, 500),

        async searchCustomers(search) {
            try {
                const params = { page: 1, perPage: 100, search, archived: false };
                this.searchingCustomers = true;
                const { data: customers } = await this.$http.get(route('customer.index'), { params });
                this.customers = customers.data;
            } finally {
                this.searchingCustomers = false;
            }
        },

        async searchProducts(search) {
            try {
                const params = { page: 1, perPage: 100, search };
                this.searchingProducts = true;
                const { data: productOptions } = await this.$http.get(route('product.suggestions'), { params });
                this.productOptions = productOptions.data;
            } finally {
                this.searchingProducts = false;
            }
        },

        async fetchWallets() {
            const params = { only: 'id,nickname' };
            const { data: wallets } = await this.$http.get(this.route('wallet.index'), { params });
            this.wallets = wallets;
            if (this.wallets.length === 1) this.form.wallet_id = this.wallets[0].id;
        },

        addProduct(product) {
            this.$refs.productSearch.clear();

            let item = {
                product,
                quantity: 1,
                unit_price: product.price / 100,
                total_amount: 0,
                invalid: false,
            };

            if (this.itemAdded(item)) {
                return this.incrementItem(item);
            }

            this.items.push(item);
        },

        itemAdded(item) {
            return this.items.find(i => i.product.id === item.product.id);
        },

        incrementItem(item) {
            const existingItem = this.itemAdded(item);
            existingItem.quantity += 1;
        },

        total() {
            return this.items.reduce((a, b) => a + +b.total_amount.toFixed(2), 0);
        },

        serviceFee() {
            return (this.$team.percent_fee / 100) * this.total() + this.$team.service_fee / 100;
        },

        internationalFee() {
            return (this.customer.address && 'US' != this.customer.address.country) ? this.$team.international_fee / 100 : 0;
        },

        totalAmount(item) {
            item.total_amount = item.quantity * item.unit_price;
            item.invalid = item.total_amount <= 0;
            return item.total_amount;
        },

        remove(item) {
            this.items.splice(this.items.indexOf(item), 1);
        },

        updateCardIcon(number) {
            this.cardIcon = this.getIconBrand(number);
        },

        updateCustomerType(customerId) {
            this.customer = this.customers.find(customer => customer.id === customerId);
            this.form.customer_type = this.customer.customer_type;
        },

        async purchase() {
            try {
                this.form.items = this.items;
                this.form.total_amount = (this.total() + this.serviceFee() + this.internationalFee()).toFixed(2);
                this.form.service_fee = this.serviceFee().toFixed(2);
                this.form.international_fee = this.internationalFee().toFixed(2);
                const { data: transaction } = await this.form.post(route('purchase'));
                this.$notify(`Successfully charged $${this.form.total_amount} from customer ${transaction.customer.name}.`);
                this.close();
                this.$emit('purchased', transaction);
            } catch (error) {
                if (error.status !== 422) {
                    this.error = error.data.message;
                }
            }
        },

        getIconBrand(number) {
            if (number.startsWith('4')) return 'fab fa-cc-visa';
            if (
                number.startsWith('51') ||
                number.startsWith('55') ||
                number.startsWith('22') ||
                number.startsWith('27')
            ) {
                return 'fab fa-cc-mastercard';
            }
            if (number.startsWith('34') || number.startsWith('37')) {
                return 'fab fa-cc-amex';
            }
            if (number.startsWith('300') || number.startsWith('305') || number.startsWith('309')) {
                return 'fab fa-cc-diners-club';
            }
            if (number.startsWith('35') || number.startsWith('2131') || number.startsWith('1800')) {
                return 'fab fa-cc-jcb';
            }
            if (
                number.startsWith('6011') ||
                number.startsWith('65') ||
                number.startsWith('644') ||
                number.startsWith('649')
            ) {
                return 'fab fa-cc-discover';
            }

            return 'fa fa-credit-card';
        },

        editCustomer() {
            this.close();
            setTimeout(() => this.$emit('editCustomer', this.customer), 300);
        },
    },
};
</script>
