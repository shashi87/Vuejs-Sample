<template>
    <div>
        <div class="card card-default">
            <div class="card-header">Address</div>

            <div class="card-body">
                <div class="alert alert-success" v-if="successful">
                    Your address has been updated!
                </div>

                <address-fields :form="formAddress"></address-fields>

                <div class="text-right mt-4">
                    <button-loading :loading="formAddress.submitting" @click="saveAddress" class="btn btn-primary">Save</button-loading>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                formAddress: new Form(),
                error: null,
                successful: false,
            };
        },

        created() {
            this.fetchData();
        },

        methods: {
            async fetchData() {
                const { data: address } = await axios.get(route('current-address-user'));
                this.$set(this.formAddress, 'address', address || {});
            },

            async saveAddress() {
                const { data: address } = await this.formAddress.post(route('update-address-user'));
                this.$set(this.formAddress, 'address', address || {});
                this.successful = true;
                window.location.reload();
            },
        },
    };
</script>
