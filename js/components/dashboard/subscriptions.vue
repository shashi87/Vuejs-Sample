<template>
    <div>
        <div class="row py-3">
            <div class="col-sm-12 col-md-6 mx-auto">
                <v-date-picker
                    mode='range'
                    v-model='filter.selectedDate'
                    show-caps
                    @input="filterDate()"
                    :input-props='{
                        placeholder: "Select a date range",
                        readonly: false,
                        class: "form-control text-center"
                    }'>
                </v-date-picker>

                <div v-if="filter.selectedDate" class="text-secondary mt-2">
                    <span
                        @click="clearDate()"
                        class="pl-2 tw-cursor-pointer mouse-hover">
                        clear date
                    </span>
                </div>
            </div>
        </div>

        <div class="col-sm-12 text-center py-5" v-if="loading">
            <i class="fa fa-spinner fa-pulse fa-2x"/>
        </div>

        <div v-if="!loading">
            <subscriptions-list
                class="pt-4"
                :subscriptions="pagination.data"
                @cancelled="fetchData"/>

            <pagination
                v-if="pagination.meta && pagination.meta.last_page > 1"
                @page="goToPage"
                :meta="pagination.meta"
                :links="pagination.links"/>
        </div>
    </div>
</template>

<script>
    import SubscriptionsList from './subscriptions-list';

    export default {
        components: {
            SubscriptionsList,
        },

        data() {
            return {
                pagination: {
                    data: [],
                    meta: null,
                    links: null,
                },

                page: 1,
                perPage: 10,
                loading: true,

                filter: {
                    selectedDate: null,
                },

                attrs: [
                    {
                        key: 'today',
                        dates: new Date(),
                    },
                ],
            };
        },

        created() {
            this.fetchData();
        },

        methods: {
            goToPage({ page, perPage }) {
                this.page = page;
                this.perPage = perPage;
                this.fetchData();
            },

            async fetchData() {
                try {
                    let params = {
                        page: this.page,
                        perPage: this.perPage,
                        filter: { ...this.filter },
                    };

                    this.loading = true;
                    let { data } = await this.$http.get('/team-subscriptions', { params });
                    this.pagination = data;
                    this.loading = false;
                } catch (error) {}
            },

            filterDate() {
                this.filter.selectedDate.start.setHours(0, 0, 0, 0);
                this.filter.selectedDate.end.setHours(23, 59, 59, 999);
                this.fetchData();
            },

            clearDate() {
                this.filter.selectedDate = null;
                this.fetchData();
            },
        },
    };
</script>
