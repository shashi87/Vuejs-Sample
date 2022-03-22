<template>
    <div class="container">
        <div class="card-body position-relative tw-bg-white">
            <div class="d-flex justify-content-end">
                <v-date-picker
                    id="date"
                    class="form-control mr-2"
                    mode='range'
                    style="max-width: 240px"
                    v-model='filter.selectedDate'
                    show-caps
                    @input="filterDate()"
                    :input-props='{placeholder: "Select a date range", readonly: false}'
                >
                </v-date-picker>
            </div>
            <div style="position: absolute; top: 10px;">
                <div v-if="loading">
                    <i class="fa fa-spinner fa-pulse fa-2x"></i>
                </div>
            </div>
            <transactions-list :transactions="pagination.data"></transactions-list>
            <pagination :meta="pagination.meta" :links="pagination.links" @page="goToPage"
                        v-if="pagination.data.length > 0"></pagination>
        </div>
    </div>
</template>

<script>
    export default {

        name: 'customer-transactions',

        data: () => ({
            pagination: {
                data : [],
                meta : null,
                links: null,
            },

            page   : 1,
            loading: true,

            filter: {
                selectedDate: {
                    start: moment().startOf('month').toDate(),
                    end  : moment().endOf('month').toDate(),
                },
                active      : 'all',
            },

            attrs: [{
                key  : 'today',
                dates: new Date(),
            }],

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
                    page  : this.page,
                    filter: {...this.filter},
                };

                this.loading    = true;
                let {data}      = await this.$http.get('customer/transactions', {params});
                this.pagination = data;
                this.loading    = false;
            },

            filterDate() {
                this.filter.selectedDate.start.setHours(0, 0, 0, 0);
                this.filter.selectedDate.end.setHours(23, 59, 59, 999);
                this.fetchData();
            },

        },
    };
</script>
