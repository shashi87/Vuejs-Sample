<template>
    <div class="mt-4 font-size-14">
        <empty
            v-if="!transactions.length"
            style="max-width: 300px"
            class="mx-auto pt-5"
            type="wallet">
            <div class="text-center mx-auto my-3 lead">
                <div class="mb-3">No transactions found.</div>
            </div>
        </empty>

        <table v-else class="table table-hover table-responsive">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Order ID</th>
                    <th scope="col" v-if="$userRole === 'customer'">Merchant</th>
                    <th scope="col" v-else>Client Name</th>
                    <th scope="col">Total</th>
                    <th scope="col"></th>
                </tr>
            </thead>

            <tbody v-if="transactions" class="tw-bg-white">
                <tr v-for="transaction in transactions" :key="transaction.id" class="th-border-bottom line-height">
                    <td class="td-fit pr-5 thin-line">
                        {{transaction.date}}
                    </td>

                    <td class="td-fit pr-5 thin-line">
                        {{ transaction.order_number ? transaction.order_number : (transaction.meta_data && transaction.meta_data.order_id ? transaction.meta_data.order_id : ' - ') }}
                    </td>
                    <td class="pr-5 thin-line">
                        {{ $userRole === 'customer' ? transaction.merchant : (transaction.customer ? transaction.customer.name : ' - ') }}
                    </td>
                    <td class="td-fit thin-line">
                        {{ transaction.total_amount }}
                    </td>
                    <td class="td-fit tw-text-right thin-line">
                        <div class="dropdown">
                            <button class="btn btn-link" type="button" id="dropdownMenuButton" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <button class="dropdown-item tw-text-gray-700"
                                        @click="$refs.TransactionDetail.open(transaction.transaction_details)"
                                        v-if="transaction.transaction_details.length">
                                    <i class="fas fa-info text-primary w-15 ml-2"></i> Details
                                </button>
                                <button class="dropdown-item tw-text-gray-700" @click="sendInvoice(transaction)">
                                    <i class="fas fa-paper-plane text-primary w-15"></i> Send Invoice
                                </button>
                                <button class="dropdown-item tw-text-gray-700" v-if="!transaction.transaction_details.length">
                                    <i class="fas fa-times w-15 ml-1"></i> No Details
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <transaction-detail ref="TransactionDetail"></transaction-detail>
    </div>
</template>

<script>
    import TransactionDetail from './transaction-detail';
    export default {
        components: {
            TransactionDetail,
        },
        props: ['transactions'],
        methods: {
            textTruncate(text, maxLength) {
                if (text.length > maxLength) {
                    return text.substr(0, maxLength) + '...';
                }
                return text;
            },
            async sendInvoice(transaction) {
                if (
                    await this.$confirm({
                        type: 'warning',
                        text: 'You will not be able to cancel send',
                        confirmButtonText: 'Yes, send it!',
                    })
                ) {
                    try {
                        await this.$http.post(route('transaction.invoice', transaction));
                        this.$alert({
                            type: 'success',
                            title: 'Invoice sent successfully',
                        });
                    } catch (e) {
                        if (e.request.status === 403) {
                            this.$alert({ type: 'error', message: e.response.data.message });
                        } else {
                            this.$notify({ type: 'error', text: e.response.data.message });
                        }
                    }
                }
            },
        },
    };
</script>


<style lang="scss" scoped>
    .transaction-list {
        font-family: 'Lato';
        color: #5f6368;
    }
    .th-border-bottom {
        border-bottom: 1px solid #f2f2f2 !important;
    }
    .font-size-14 {
        font-size: 14px;
        font-weight: 400;
    }
    .thin-line{
        padding-top: 3px !important;
        padding-bottom: 3px !important;
    }
    .line-height {
        line-height: 35px;
    }
</style>
