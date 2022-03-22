<template>
    <div class="table-responsive">
        <empty
            v-if="!subscriptions.length"
            style="max-width: 300px"
            class="mx-auto"
            type="account">
            <div class="text-center mx-auto my-3 lead">
                <div class="mb-3">No subscriptions found.</div>
            </div>
        </empty>

        <table v-if="subscriptions.length" class="table table-valign-middle ">
            <thead>
                <tr>
                    <th scope="col" >Started</th>
                    <th scope="col" >Merchant</th>
                    <th scope="col" class="tw-text-center" align="center">Status</th>
                    <th scope="col" >Value</th>
                    <th scope="col" ></th>
                </tr>
            </thead>
            <tbody v-if="subscriptions" class="tw-bg-white">
                <tr v-for="subscription in subscriptions" :key="subscription.id" class="mb-1 th-border-bottom">
                    <td class="td-fit pr-5 py-3">
                        {{ subscription.date | date('LLL') }}
                    </td>
                    <td class="pr-5">
                        {{ subscription.merchant }}
                    </td>
                    <td class="td-fit" align="center">
                        <span class="badge badge-pill tw-text-base" :class="statusClass(subscription.status)">
                            {{ subscription.status | capitalize }}
                            <span v-if="subscription.status === 'grace_period'">until {{ subscription.ends_at | date('LL') }}</span>
                        </span>
                    </td>
                    <td class="td-fit">
                        {{ subscription.amount }}
                    </td>
                    <td class="td-fit"  align="center">
                        <button v-if="!subscription.ends_at" class="btn btn-sm btn-outline-danger" type="button" @click="confirmCanceling(subscription)">
                            Cancel
                        </button>

                        <i
                            v-if="subscription.ends_at && subscription.cancel_description"
                            class="fa fa-info-circle"
                            v-b-tooltip.hover
                            :title="subscription.cancel_description"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'subscriptions-list',

        props: {
            subscriptions: { required: true },
        },

        data () {
            return {
                cancel_description: null,
            }
        },

        methods: {
            statusClass(status) {
                if (status.indexOf('canceled') !== -1) return 'badge-danger tw-bg-red-light';
                if (status.indexOf('active') !== -1) return 'badge-success';

                return 'badge-secondary';
            },

            async confirmCanceling(subscription) {
                this.$swal(
                    {
                        title: 'Subscription Cancel',
                        text: 'Why are you canceling?',
                        input: 'text',
                        inputPlaceholder: '...',
                        confirmButtonColor: 'red',
                        confirmButtonText: 'Yes',
                        closeOnConfirm: true,
                        showCancelButton: true,
                        inputValidator: (value) => {

                            if (value.length < 10) {
                                return 'Please tell me more why you want to cancel?'
                            }

                            this.cancel_description = value;
                            this.cancel(subscription);
                        }
                    },
                );
            },

            async cancel(subscription) {
                try {
                    this.loading = true;
                    await this.$http.post(
                        `/customer/subscriptions-cancel/${subscription.id}`,
                        {'cancel_description': this.cancel_description}
                    );
                    this.$emit('cancelled');
                    this.loading = false;
                } catch (error) {
                    console.error(error);
                }
            },
        },
    };
</script>
