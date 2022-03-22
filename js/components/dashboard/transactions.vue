<template>
    <div>
        <div class="row pt-3">
            <div class="col-sm-12 col-md-6">
                <small class="self-end">
                    <button class="btn btn-link font-semibold tracking-wide"
                            :class="{'tw-text-grey': filter.active !== 'all'}"
                            @click="filterActive('all')">All
                    </button>
                    |
                    <button class="btn btn-link font-semibold tracking-wide"
                            :class="{'tw-text-grey': filter.active !== 'pending'}"
                            @click="filterActive('pending')">Pending
                    </button>
                    |
                    <button class="btn btn-link font-semibold tracking-wide"
                            :class="{'tw-text-grey': filter.active !== 'processed'}"
                            @click="filterActive('processed')">Processed
                    </button>
                </small>
            </div>

            <div class="col-sm-12 col-md-6">
                <v-date-picker
                    mode='range'
                    v-model='filter.selectedDate'
                    show-caps
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

        <div v-else>
            <div v-if="pagination.data.length > 0"
                class="row float-right pr-1">
                <button class="btn btn-link" @click="downloadCSV">
                    <i class="fas fa-file-csv mr-1"></i> Export CSV
                </button>
            </div>

            <transactions-list :transactions="pagination.data"/>
            <pagination
                v-if="pagination.data.length > 0"
                @page="goToPage"
                :meta="pagination.meta"
                :links="pagination.links"/>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        download: null,
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
            active: 'all',
        },

        attrs: [
            {
                key: 'today',
                dates: new Date(),
            },
        ],
    }),

    watch: {
        "filter.selectedDate"(date) {
            if (!date) return;

            this.filter.selectedDate.start.setHours(0, 0, 0, 0);
            this.filter.selectedDate.end.setHours(23, 59, 59, 999);
            this.fetchData();
        }
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

        downloadCSV() {
            let params = {
                filter: { ...this.filter },
            };
            this.loading = true;
            axios.get('/transactions-export', { params }).then(res => {
                window.location.href = res.request.responseURL;
                this.loading = false;
            });
        },

        async fetchData() {
            try {
                let params = {
                    page: this.page,
                    perPage: this.perPage,
                    filter: { ...this.filter },
                };

                this.loading = true;
                let { data } = await this.$http.get('/team-transactions', { params });
                this.pagination = data;
                this.loading = false;
            } catch (error) {}
        },

        filterActive(status) {
            this.filter.active = status;
            this.fetchData();
        },

        clearDate() {
            this.filter.selectedDate = null;
            this.fetchData();
        },
    },
};
</script>
