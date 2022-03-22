<template>
    <div class="modal" id="modal-transaction-detail" role="dialog">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Transaction detail</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body tw-bg-white">
                    <div v-for="detail in transaction_details" :key="detail.id">
                        <div class="ml-5">
                            <div class="row mb-2">
                                <div class="col-6">
                                    Date:
                                </div>
                                <div class="col-6">
                                    {{ detail.created_at | date }}
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6">
                                    Amount:
                                </div>
                                <div class="col-6">
                                    ${{ (detail.unit_price / 100).toFixed(2) }}
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6">
                                    Quantity:
                                </div>
                                <div class="col-6">
                                    {{detail.quantity}}
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6">
                                    Description:
                                </div>
                                <div class="col-6">
                                    {{detail.description}}
                                </div>
                            </div>
                        </div>
                        <hr>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        transaction_details: [],
    }),

    methods: {
        open(transaction_details) {
            this.transaction_details = transaction_details;
            $(this.$el).modal('show');
        },

        close() {
            $(this.$el).modal('hide');
        },
    },
};
</script>

<style lang="scss">
.modal-header {
    border-bottom: none;
}
</style>
