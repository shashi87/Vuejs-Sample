<template>
    <div class="modal" id="widget-form-html" role="dialog">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="mb-0"><i class="fas fa-code"></i> HTML</h3>
                </div>

                <div class="modal-body pt-0">
                    <div class="alert alert-warning row rounded-0">
                        <h4>Copy this code to your application to start paying using PMC</h4>

                        <div class="mb-3">
                            This is an example structure to be used in your application. <br>
                            You can add or remove input items, but must keep the same structure ('description',
                            'unit_price', 'quantity').
                        </div>

                        <div>
                            <div class="tw-text-red">
                                <h4>Important:</h4>

                                <p> Do not change the FORM ACTION URL <br>
                                    Do not change the TOKEN VALUE</p>
                            </div>

                            <h5>Validation Rules</h5>
                        </div>


                        <table class="table mb-0">
                            <thead>
                                <tr>
                                    <td><strong>Field</strong></td>
                                    <td><strong>Rules</strong></td>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="field of Object.keys(fields)" :key="field">
                                    <td>{{ field }}</td>
                                    <td>{{ fields[field] }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="pointer-events:none;">
                        <div v-html="widget.form_html"></div>
                    </div>

                    <div class="mt-3">
                        <div class="form-group">
                            <textarea name="html" class="form-control text-area-content"
                                v-model="widget.form_html"></textarea>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 px-3 pt-3 pb-0 rounded-0">
                            <h4>Error Codes</h4>

                            <div class="row">
                                <table class="table table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <td class="px-3" style="width: 20%"><strong>Code</strong></td>
                                            <td class="px-3"><strong>Description</strong></td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="code of Object.keys(errorCodes)" :key="code">
                                            <td class="px-3">{{ code }}</td>
                                            <td class="px-3">{{ errorCodes[code] }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-link" type="reset" data-dismiss="modal">
                        Close
                    </button>
                    <button class="btn btn-primary" @click.stop.prevent="copyHtml()">
                        Copy
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import Vue from 'vue';
import Clipboard from 'v-clipboard';

Vue.use(Clipboard);

export default {
    components: {
        Clipboard,
    },

    data: () => ({
        selected: null,
        item: null,
        widget: {},
        errorCodes: Spark.errorCodes,
        fields: {
            token: 'required | valid_token',
            return_token: 'required | valid_token',
            order_number: 'required',
            customer_id: 'required | max:255',
            items: 'required | array',
            'items.*.quantity': 'required | numeric',
            'items.*.unit_price': 'required | numeric',
            'items.*.description': 'required | min:3',
        },
    }),

    methods: {
        open(widget) {
            this.widget = widget;
            $(this.$el).modal('show');
        },

        close() {
            $(this.$el).modal('hide');
        },
        copyHtml() {
            this.$clipboard(this.widget.form_html);
            this.$notify('Content copied!');
        },
    },
};
</script>


<style lang="scss" scoped>
.form-html-content {
    // min-width: 820px;
    // min-height: 650px;
}

.text-area-content {
    min-width: 663px;
    min-height: 422px;
}

.modal-content {
    background-color: white;
}

.modal-footer {
    border-top: none !important;
}

.modal-header {
    border-bottom: none !important;
    font-size: 21px;
}
</style>
