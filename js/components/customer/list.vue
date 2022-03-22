<template>
    <div class="container">
        <div class="transitioned mb-3">
            <input-text class="mb-0" :input-class="searchStyleClasses" :autofocus="true"
                :left-icon="fetching ? 'fa fa-spin fa-spinner' : 'fa fa-search'"
                placeholder="Search customer by name, email or phone number..."
                @keyup.enter.native="fetchCustomers"
                v-model="search">
            </input-text>

            <div class="mt-3 d-flex flex-wrap align-items-center justify-content-center">
                <a href="#" @click.stop.prevent="archived = null" class="mx-2 tw-no-underline"
                    :class="archived === null ? 'text-primary hover:tw-no-underline tw-cursor-default' : 'text-dark'">all</a>
                <a href="#" @click.stop.prevent="archived = false" class="mx-2 tw-no-underline"
                    :class="archived === false ? 'text-primary hover:tw-no-underline tw-cursor-default' : 'text-dark'">active</a>
                <a href="#" @click.stop.prevent="archived = true" class="mx-2 tw-no-underline"
                    :class="archived === true ? 'text-primary hover:tw-no-underline tw-cursor-default' : 'text-dark'">archived</a>

                <div class="actions mx-auto ml-md-auto mr-md-0 my-3 my-md-0">
                    <button class="btn btn-sm btn-outline-primary" @click="addPurchase">
                        <i class="fa fa-cart-plus mr-1"></i>
                        Add Purchase
                    </button>

                    <button class="btn btn-primary btn-sm" @click="addCustomer">
                        <i class="fa fa-user-plus mr-1"></i>
                        Add Customer
                    </button>
                </div>
            </div>
        </div>

        <div class="card bg-white border-0 mb-2" v-for="customer of customers.data" :key="customer.id + '-' + customer.type">
            <div class="card-body d-flex flex-wrap align-items-center">
                <div>
                    <div class="lead">
                        <a :href="customerRoute(customer)"><b>{{ customer.name }}</b></a>

                        <span v-if="isUser(customer)" class="badge badge-pill badge-dark tw-text-xs">
                            <i class="fa fa-user mr-1"></i>
                            User
                        </span>

                        <span v-if="customer.archived_at" class="badge badge-pill badge-secondary tw-text-xs">
                            <i class="fa fa-archive mr-1"></i>
                            Archived
                        </span>
                    </div>

                    <div class="text-muted d-flex flex-wrap mb-2 mb-sm-0 align-items-center" v-if="customer.email || customer.phone">
                        <a :href="`mailto:${customer.email}`" class="mr-3 tw-text-grey tw-cursor-pointer" v-if="customer.email">
                            <i class="fa fa-envelope tw-text-xs"></i>
                            {{ customer.email }}
                        </a>

                        <a :href="`tel:${customer.phone}`" class="tw-text-grey tw-cursor-pointer" v-if="customer.phone">
                            <i class="fa fa-phone tw-text-xs"></i>
                            {{ customer.phone }}
                        </a>
                    </div>
                </div>

                <div class="ml-auto" v-if="customer.archived_at">
                    <button-loading class="btn btn-sm btn-outline-secondary"
                        :loading="isArchiving(customer)"
                        @click.stop="unarchive(customer)">
                        <i v-if="!isArchiving(customer)" class="fa fa-redo-alt fa-flip-horizontal"></i>
                        Unarchive
                    </button-loading>
                </div>

                <div class="ml-auto" v-if="!customer.archived_at && !isUser(customer)">
                    <button class="btn btn-sm btn-outline-primary" @click.stop="edit(customer)">
                        <i class="fa fa-edit"></i>
                        Edit
                    </button>

                    <button-loading :loading="isArchiving(customer)" class="btn btn-sm btn-outline-danger"
                        @click.stop="archive(customer)">
                        <i v-if="!isArchiving(customer)" class="fa fa-archive"></i>
                        {{ isArchiving(customer) ? 'Archiving...' : 'Archive' }}
                    </button-loading>
                </div>
            </div>
        </div>

        <pagination class="mt-4" v-if="customers.meta && customers.meta.last_page > 1"
            @page="goToPage"
            :links="customers.links"
            :meta="customers.meta"/>

        <empty style="max-width: 300px" class="mx-auto mt-5" v-if="!customers.data.length" type="people-search">
            <div class="text-center mx-auto my-3 lead">
                <div class="mb-3">This is the customer list, try to search some.</div>
                <button class="btn btn-primary btn-lg" @click="addCustomer">Add Customer</button>
            </div>
        </empty>

        <customer-form-modal ref="customerFormModal" @saved="saved"></customer-form-modal>

        <purchase-form-modal @editCustomer="edit($event)" ref="purchaseFormModal"></purchase-form-modal>
    </div>
</template>

<script>
import _ from 'lodash';
import CustomerFormModal from './form-modal';
import PurchaseFormModal from './purchase-form-modal';

export default {
    components: { CustomerFormModal, PurchaseFormModal },

    props: {
        data: { required: false, default: () => ({ data: [] }) },
    },

    data() {
        return {
            search: null,
            customers: this.data,
            fetching: false,
            archiving: [],
            archived: null,
            perPage: 10,
            page: 1,
        };
    },

    mounted() {
        this.setCustomers(this.data);
        this.$refs.purchaseFormModal.searchCustomers();
        this.$refs.purchaseFormModal.searchProducts();
    },

    watch: {
        search() {
            this.fetching = true;
            this.fetchCustomers();
        },

        archived() {
            this.fetching = true;
            this.fetchCustomers();
        },
    },

    computed: {
        searchStyleClasses() {
            let classes = 'form-control border-0 form-control-lg rounded-pill ';
            classes += this.search ? 'shadow-sm' : 'shadow';
            return classes;
        },
    },

    methods: {
        goToPage({ page, perPage }) {
            this.fetching = true;
            this.page = this.perPage != perPage ? 1 : page;
            this.perPage = perPage;
            this.fetchCustomers({ page: this.page, perPage });
        },
        fetchCustomers: _.debounce(async function(params) {
            this.fetching = true;
            params = {
                search: this.search,
                archived: this.archived,
                ...params,
            };

            const { data: customers } = await this.$http.get(route('customer.index'), { params });
            this.setCustomers(customers);
            this.fetching = false;
        }, 500),

        setCustomers(customers) {
            customers.data = customers.data.map(c => new Form(c));
            return (this.customers = customers);
        },

        addCustomer() {
            this.$refs.customerFormModal.setup({ name: this.search }).open();
        },

        edit(customer) {
            this.$refs.customerFormModal.setup(customer).open();
        },

        isArchiving(customer) {
            return this.archiving.includes(customer.id);
        },

        isUser(customer) {
            return customer.type === 'users';
        },

        customerRoute(customer) {
            return this.isUser(customer)
                ? this.route('customer.show-user', customer)
                : this.route('customer.show', customer);
        },

        async archive(customer) {
            try {
                this.archiving.push(customer.id);
                await customer.delete(route('customer.destroy', customer));
                this.fetching = true;
                this.fetchCustomers();
            } finally {
                this.archiving.splice(this.archiving.indexOf(customer.id), 1);
            }
        },

        async unarchive(customer) {
            try {
                this.archiving.push(customer.id);
                await customer.put(route('customer.unarchive', customer));
                this.fetching = true;
                this.fetchCustomers();
            } finally {
                this.archiving.splice(this.archiving.indexOf(customer.id), 1);
            }
        },

        saved(customer) {
            this.fetching = true;
            this.search = this.search || customer.name;
            this.fetchCustomers();
        },

        addPurchase() {
            this.$refs.purchaseFormModal.setup().open();
        },
    },
};
</script>
