<template>
    <div>
        <div class="row mb-3 d-flex justify-content-center" v-if="options.length > 0">
            <div class="col-4">
                <select v-model="filter.fieldSearch" class="form-control">
                    <option value="" disabled selected>Select the field</option>
                    <option v-for="(item, index) in options" :key="`${index}-filter-field-option`">{{ item }}</option>
                </select>
            </div>
            <div class="col-8">
                <input type="text" placeholder="Search..." v-model="filter.search" @keyup.enter="fetchData()"
                       class="form-control">
            </div>
        </div>

        <div class="row mb-3 d-flex justify-content-center">
            <div class="col">
                <date-range v-model="dataRange" @change="fetchData(1)"></date-range>
            </div>
            <div class="col">
                <button type="button" class="btn float-right btn-outline-success px-3" @click="fetchData()">
                    Search
                </button>

                <button type="button" class="btn float-right btn-outline-dark px-3 mr-2" @click="clearFilter()">
                    Clear
                </button>

                <button type="button" class="btn float-right btn-outline-white px-3 mr-2" @click="exportReport()">
                    Export
                </button>
            </div>
        </div>

        <div class="card card-default">
            <div class="card-header valign-middle">
                <slot></slot>
                <i class="fa fa-spin fa-spinner" v-if="loading"></i>
            </div>

            <div class="table-responsive">
                <table class="table table-valign-middle mb-0 table-striped">
                    <thead>
                    <tr>
                        <th v-for="(item, index) in headers" :key="`header-${index}`" nowrap>{{ item }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in pagination.data" :key="`tr-data-report-${index}`">
                        <td v-for="(column, index) in columns" :key="`column-${index}`" nowrap>
                            {{ item[column] }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <pagination :meta="pagination.meta" :links="pagination.links" @page="goToPage"></pagination>

    </div>
</template>

<script>
    import buildURL  from '../../../../node_modules/axios/lib/helpers/buildURL';
    import DateRange from '../shared/date-range';

    export default {
        components: {DateRange},
        props     : {
            headers: {required: true, type: Array},
            columns: {required: true, type: Array},
            options: {required: true, type: Array},
            report : {required: true, type: String},
        },

        data: () => ({
            pagination: {
                data : [],
                meta : null,
                links: null,
            },
            page      : 1,
            perPage   : 10,
            loading   : true,
            dataRange : {
                start: moment().startOf('month').format(),
                end  : moment().format(),
            },
            filter    : {
                start      : null,
                end        : null,
                search     : '',
                fieldSearch: '',
            },
        }),

        created() {
            this.fetchData();
        },

        methods: {
            filters() {
                this.filter.start = this.dataRange.start;
                this.filter.end   = this.dataRange.end;

                return {
                    filter : this.filter,
                    page   : this.page,
                    perPage: this.perPage,
                };
            },

            exportReport() {
                let params      = this.filters();
                window.location = buildURL(`/reports/${this.report}/export?`, params);
            },

            filterStatus(status) {
                this.filter.status = status;
                this.page          = 1;
                this.fetchData();
            },

            clearFilter() {
                this.filter.search      = '';
                this.filter.fieldSearch = '';
                this.fetchData();

            },

            goToPage({page, perPage}) {
                this.page    = page;
                this.perPage = perPage;
                this.fetchData();
            },

            async fetchData(page) {
                if(page) this.page = page;

                let params = this.filters();

                if (params.filter === undefined || params.filter.search === undefined) {
                    params.filter.search = null;
                }

                this.loading    = true;
                let {data}      = await axios.get(`/reports/${this.report}/search`, {params});
                this.pagination = data;
                this.loading    = false;
            },
        },
    };
</script>
