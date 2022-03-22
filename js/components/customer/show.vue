<template>
    <div class="container">
        <div class="d-flex align-items-center mb-3">
            <a :href="route('customer.index')" class="btn btn-sm btn-default bg-white rounded-pill">
                <i class="fa fa-arrow-left mr-1"></i>
                Back
            </a>
        </div>

        <div class="card bg-white border-0 shadow tw-overflow-hidden rounded">
            <div class="card-body pb-0">
                <div class="card-title d-flex align-items-center mb-3">
                    <div v-if="isUser && customer.photo_url" class="mr-3">
                        <img :src="customer.photo_url" class="rounded" style="max-width: 80px">
                    </div>

                    <div class="d-flex align-items-center">
                        <span>{{ customer.name }} <button class="btn btn-default btn-sm" @click="edit"><i class="fa fa-edit"></i> Edit</button></span>
                        <span v-if="isUser" class="badge badge-dark badge-pill ml-2">User</span>
                    </div>
                </div>

            </div>
            <ul class="nav nav-tabs" style="padding: 0 1.25rem">
                <li class="nav-item">
                    <a href="#details" data-toggle="pill" class="nav-link active">
                        <i class="far fa-address-card mr-1"></i>
                        Details
                    </a>
                </li>

                <li class="nav-item">
                    <a href="#transctions" data-toggle="pill" class="nav-link">
                        <i class="fa fa-shopping-cart mr-1"></i>
                        Purchases ({{ customer.transactions.length }})
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <div id="details" class="tab-pane fade show active">
                    <div class="table-responsive">
                        <table class="table table-striped table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td style="width: 20%; min-width: 160px"><b>Email Address:</b></td>
                                    <td><a :href="'mailto:' + customer.email">{{ customer.email }}</a></td>
                                </tr>

                                <tr>
                                    <td><b>Phone:</b></td>
                                    <td><a :href="'tel:' + customer.phone">{{ customer.phone }}</a></td>
                                </tr>

                                <tr>
                                    <td><b>Address:</b></td>
                                    <td v-if="address">
                                        {{ address.line1 }}<span v-if="address.line2">, {{ address.line2 }}</span> -
                                        {{ address.city }}, {{ address.state }}
                                        <span>{{ address.country }}</span>
                                    </td>
                                    <td v-if="!address"><em>No address</em></td>
                                </tr>

                                <tr>
                                    <td><b>Since:</b></td>
                                    <td>{{ customer.created_at | date('LLLL') }}</td>
                                </tr>

                                <tr>
                                    <td><b>Last Update:</b></td>
                                    <td>{{ customer.updated_at | date('LLLL') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="transctions" class="tab-pane fade bg-content">
                    <div class="form-row card-body">
                        <div class="col-auto">
                            <button class="btn btn-primary" @click="addPurchase">
                                <i class="fa fa-cart-plus mr-1"></i>
                                Add Purchase
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive" v-if="customer.transactions.length">
                        <table class="table table-striped table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Items</th>
                                    <th>Payment Gateway</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Processed At</th>
                                    <th>Service Fee</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr class="tw-cursor-pointer" v-for="transaction of customer.transactions" :key="transaction.id"
                                    @click="openDetails(transaction)">
                                    <td>{{ transaction.id }}</td>
                                    <td>{{ transaction.details.length }}</td>
                                    <td>{{ transaction.payment_account && transaction.payment_account.payment_gateway.name }}</td>
                                    <td>
                                        <span class="badge badge-pill" :class="transaction.pending ? 'badge-dark': 'badge-success'">
                                            {{ transaction.pending ? 'Pending' : 'Processed' }}
                                        </span>
                                    </td>
                                    <td>{{ transaction.created_at | date('MM/DD/YYYY hh:mm:ss A') }}</td>
                                    <td>{{ transaction.processed_at | date('MM/DD/YYYY hh:mm:ss A') }}</td>
                                    <td>$ {{ (transaction.service_fee / 100).toFixed(2) }}</td>
                                    <td>$ {{ (transaction.total_amount / 100).toFixed(2) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <purchase-form @purchased="reload" @editCustomer="edit" ref="purchaseForm"></purchase-form>
            <customer-form-modal ref="customerFormModal" @saved="saved"></customer-form-modal>
            <transaction-detail ref="transactionDetail"></transaction-detail>
        </div>
    </div>
</template>

<style lang="sass" scoped>
$bgColor: rgba(0, 0, 0, 0.05)
.nav-link
    transition: background-color .6s ease
    &.active
        background-color: $bgColor !important
        border-color: $bgColor $bgColor rgba(255, 255, 255, .7) !important
.bg-content
    background-color: $bgColor
</style>


<script>
import PurchaseForm from './purchase-form-modal';
import TransactionDetail from '@/components/shared/transaction-detail';
import CustomerFormModal from '@/components/customer/form-modal';

export default {
    components: { PurchaseForm, TransactionDetail, CustomerFormModal },

    props: {
        customer: Object,
    },

    data() {
        return {
            searchTransactions: null,
        };
    },

    computed: {
        isUser() {
            return this.customer.current_team_id;
        },

        address() {
            return this.customer.address;
        },
    },

    methods: {
        addPurchase() {
            this.$refs.purchaseForm.setupCustomer(this.customer).open();
            this.$refs.purchaseForm.searchProducts();
        },

        edit() {
            this.$refs.customerFormModal.setup(this.customer).open();
        },

        reload() {
            window.location.reload();
        },

        openDetails(transaction) {
            this.$refs.transactionDetail.open(transaction.details);
        },

        saved() {
            setTimeout(() => window.location.reload(), 1000);
        },
    },
};
</script>
