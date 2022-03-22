<template>
    <div class="container">
        <div class="clearfix mb-4">
            <button
                @click="$refs.NewWidgetModal.open()"
                class="btn btn-primary btn-lg rounded-pill">
                <i class="fa fa-plus"></i>
                <span class="d-none d-md-inline ml-1">Add Widget</span>
            </button>
        </div>

        <div class="card bg-white border-0 mb-2" v-for="widget in widgets" :key="widget.id">
            <div class="card-body d-flex align-items-center justify-content-between">

                <div class="lead">
                    <div class="text-danger tw-text-sm tw-bg-red-100 p-2 rounded" v-if="invalid(widget)">
                        <i class="fa fa-exclamation-triangle"></i>
                        This widget is imcompleted. Please complete the subscription's fields to make it work properly.
                    </div>

                    <div>
                        {{ widget.name }}

                        <span v-if="widget.is_subscription" class="badge badge-pill badge-secondary">Subscription</span>

                    </div>

                    <div v-if="widget.checkouts_count > 0" class="tw-text-grey-dark tw-text-sm">
                        <span v-if="widget.is_subscription">Has <b class="text-primary">{{ widget.user_subscriptions_count }} active subscriptions.</b></span>
                        Has <b class="text-primary">{{ widget.checkouts_completed_count }}</b> of <b class="text-primary">{{ widget.checkouts_count }} checkouts completed</b>.
                        Convertion rate
                        <b class="text-primary">{{ convertionRate(widget).toFixed(0) }}%</b>.
                    </div>
                </div>

                <div>
                    <button class="btn btn-sm btn-outline-secondary" type="button" @click="selectWidget(widget)">
                        <i class="fas fa-info"></i> Plugin Details
                    </button>

                    <button class="btn btn-sm btn-outline-secondary" type="button" @click="$refs.NewWidgetModal.open(widget)">
                        <i class="fas fa-edit"></i> Edit
                    </button>

                    <button class="btn btn-sm btn-outline-primary" type="button" @click="$refs.HtmlFormModal.open(widget)">
                        <i class="fas fa-code"></i> Html
                    </button>

                    <button v-if="!widget.user_subscriptions_count" class="btn btn-sm btn-outline-danger" type="button" @click="destroy(widget)">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>

        <widget-form ref="NewWidgetModal" @saved="fetchData"></widget-form>
        <widget-html-form ref="HtmlFormModal" @saved="fetchData"></widget-html-form>

        <modal ref="PluginDetailsModal">
            <span slot="title">Plugin Details</span>

            <div v-if="selected_widget" class="col-sm-12">
                <h5 class="pb-2">{{ selected_widget.name }}</h5>

                <p>
                    Customer ID:
                    <span class="text-primary">{{ selected_widget.customer_id }}</span>
                </p>
                <p class="text-break">
                    Token:
                    <span class="text-primary">{{ selected_widget.token }}</span>
                </p>
                <p class="text-break">
                    Return Token:
                    <span class="text-primary">{{ selected_widget.return_token }}</span>
                </p>
            </div>

            <div slot="footer">
                <button class="btn btn-link mr-2" @click="$refs.PluginDetailsModal.close()">
                    Close
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import WidgetForm from './form.vue';
    import WidgetHtmlForm from './html-form.vue';

    export default {
        components: { WidgetForm, WidgetHtmlForm },

        data: () => ({
            widgets: [],
            selected_widget: null,
        }),

        created() {
            this.fetchData();
        },

        methods: {
            async fetchData() {
                const { data } = await this.$http.get(route('widget.index'));
                this.widgets = data;
                this.widgets.forEach(widget => (widget.invalid = this.invalid(widget)));
            },

            async destroy(widget) {
                if (await this.$confirm()) {
                    try {
                        let { data } = await this.$http.delete(route('widget.destroy', { widget: widget.id }));
                        this.fetchData();
                        this.$alert({ type: 'success', title: data.message });
                    } catch (e) {
                        if (e.request.status === 403) {
                            this.$alert({ type: 'error', message: e.response.data.message });
                        } else {
                            this.$notify({ type: 'error', text: e.response.data.message });
                        }
                    }
                }
            },

            invalid(widget) {
                return widget.is_subscription && (!widget.renew_url || !widget.renewal_request_url);
            },

            convertionRate(widget) {
                return (widget.checkouts_completed_count * 100) / widget.checkouts_count;
            },

            selectWidget(widget) {
                this.selected_widget = widget;
                let htmlDoc = new DOMParser().parseFromString(widget.form_html, 'text/html');
                this.selected_widget.customer_id = htmlDoc.getElementsByName('customer_id')[0].value;
                this.selected_widget.return_token = htmlDoc.getElementsByName('return_token')[0].value;
                this.$refs.PluginDetailsModal.open();
            }
        },
    };
</script>

<style lang="scss" scoped>
    .new-widget-container {
        width: 35%;

        background-color: white;
        min-height: 96px;
        margin-bottom: 22px;
        padding: 0 22px 0 22px;99
    }
</style>
