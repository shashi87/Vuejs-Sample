<template>
    <div class="container">
        <div class="card-body position-relative  tw-bg-white">
            <div style="position: absolute; top: 10px;">
                <div v-if="loading">
                    <i class="fa fa-spinner fa-pulse fa-2x"></i>
                </div>
            </div>
            <subscriptions-list :subscriptions="pagination.data" @cancelled="fetchData"></subscriptions-list>
            <pagination :meta="pagination.meta" :links="pagination.links" @page="goToPage"
                        v-if="pagination.data.length > 0"></pagination>
        </div>
    </div>
</template>



<script>
    import SubscriptionsList from '../subscriptions-list';

    export default {
        components: {
            SubscriptionsList,
        },
        name: 'customer-subscriptions',

        data: () => ({
            loading: true,
            pagination: {
                data: [],
                meta: null,
                links: null,
            },
            page: 1,
        }),

        created() {
            this.fetchData();
        },

        methods: {
            goToPage(page) {
                this.page = page;
                this.fetchData();
            },

            async fetchData() {
                let params = {
                    page: this.page,
                };

                this.loading = true;
                let { data } = await this.$http.get('customer/subscriptions', { params });
                this.pagination = data;
                this.loading = false;
            },
        },
    };
</script>
