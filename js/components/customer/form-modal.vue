<template>
    <modal ref="modal" body-classes="pt-0">
        <span slot="title">
            {{ form.id ? 'Edit' : 'New' }} Customer
        </span>

        <form-title>Personal Information</form-title>
        <input-text :disabled="isUser" label="Name" ref="name" placeholder="Customer full name" v-model="form.name" :form="form" field="name"></input-text>
        <input-text :disabled="isUser" label="E-mail Address" type="email" placeholder="Customer e-mail address" v-model="form.email" :form="form" field="email"></input-text>
        <input-text :disabled="isUser" v-mask="['(###) ###-####']" label="Phone Number" placeholder="Customer phone number" v-model="form.phone" :form="form" field="phone"></input-text>

        <form-title>Address</form-title>
        <address-fields :form="form"></address-fields>

        <div v-if="error" class="alert alert-danger d-flex align-items-center my-3">
            <i class="fa fa-exclamation-circle mr-2"></i>
            <div>
                <div><b>Sorry! Something went wrong.</b></div>
                <div>Error Message: {{ error }}</div>
            </div>
        </div>

        <div slot="footer" class="d-flex align-items-center">
            <button class="btn btn-link mr-2" @click="close">Close</button>
            <button-loading :loading="form.submitting" @click="save" class="btn btn-primary">Save</button-loading>
        </div>
    </modal>
</template>

<script>
import ModalComponent from '@/mixins/modal-component';

export default {
    mixins: [ModalComponent],

    data() {
        return {
            form: new Form({ address: {} }),
            error: null,
        };
    },

    computed: {
        isUser() {
            return this.form.customer_type === 'users';
        },

        url() {
            if (!this.form.id) return route('customer.index');
            return this.isUser ? route('customer.update-user', this.form) : route('customer.update', this.form);
        },

        httpMethod() {
            return this.form.id ? 'put' : 'post';
        },
    },

    methods: {
        setup(data = {}) {
            this.error = null;
            const address = { ...data.address } || {};
            this.form = new Form({ ...data, address: { ...address } } || {});
            if (!this.form.address) {
                this.$set(this.form, 'address', {});
            }

            setTimeout(() => this.$refs.name.focus(), 200);

            return this;
        },

        async save() {
            try {
                this.error = null;
                const { data: customer } = await this.form[this.httpMethod](this.url);
                this.$emit('saved', customer);
                this.close();
                this.$notify(`Customer ${customer.name} updated`);
            } catch (error) {
                console.error('error', error);
                if (error.status === 500) {
                    this.error = error.data.message;
                }
            }
        },
    },
};
</script>
