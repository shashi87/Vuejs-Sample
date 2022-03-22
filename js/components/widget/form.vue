<template>
    <div class="modal" id="modal-widget" role="dialog">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header ml-3">
                    {{ form.id ? 'Edit Widget' : 'Create Widget' }}
                </div>
                <form @submit.prevent="save()">
                    <div class="modal-body">
                        <div class="form-group row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>
                            <div class="col-md-8">
                                <input id="name" ref="mainInput" v-model="form.name"
                                       class="form-control" type="text"
                                       :class="{'is-invalid': form && form.errors.has('name')}">
                                <span class="invalid-feedback" v-show="form.errors.has('name')">
                                    {{ form.errors.get('name') }}
                                </span>
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label for="wallet" class="col-md-4 col-form-label text-md-right">
                                <wallet></wallet>
                                Wallet
                            </label>
                            <div class="col-md-8">
                                <select id="wallet" class="form-control" v-model="form.wallet_id"
                                        :class="{'is-invalid': form && form.errors.has('wallet_id')}">
                                    <option v-for="wallet in wallets" :value="wallet.id" :key="wallet.id">
                                        {{ wallet.nickname }}
                                    </option>
                                    <option disabled="" v-if="wallets.length === 0">
                                        Please, create a wallet first
                                    </option>
                                </select>
                                <span class="invalid-feedback" v-show="form.errors.has('wallet_id')">
                                    {{ form.errors.get('wallet_id') }}
                                </span>
                            </div>
                        </div>

                        <div class="form-group row mb-3">
                            <label for="return_url" class="col-md-4 col-form-label text-md-right">Return Url</label>
                            <div class="col-md-8">
                                <input id="return_url" ref="mainInput" v-model="form.return_url"
                                       placeholder="https://www.example.com"
                                       class="form-control" type="text"
                                       :class="{'is-invalid': form.errors.has('return_url')}">
                                <span class="invalid-feedback" v-show="form.errors.has('return_url')">
                                    {{ form.errors.get('return_url') }}
                                </span>
                            </div>
                        </div>

                        <div class="form-group ml-md-3">
                            <div class="custom-control custom-checkbox offset-md-4">
                                <input
                                    v-model="form.is_subscription"
                                    :disabled="hasActiveSubscriptions"
                                    class="custom-control-input"
                                    id="is_subscription"
                                    type="checkbox">
                                <label class="custom-control-label" for="is_subscription">
                                    Is Subscription
                                </label>

                                <p v-if="hasActiveSubscriptions" class="tw-text-orange tw-text-xs">This widget has active subscriptions and cannot be changed to non-subscription widget.</p>
                            </div>
                        </div>

                        <transition name="fade-in-down">
                            <div v-if="form.is_subscription">
                                <div class="form-group row mb-3">
                                    <label for="renew_url" class="col-md-4 col-form-label text-md-right"
                                        :class="{'text-danger': form.invalid || form.errors.has('renew_url')}">
                                        Renew Url

                                        <i ref="renewUrlHelper" class="fa fa-info-circle tw-cursor-pointer"></i>

                                        <b-tooltip :target="() => $refs.renewUrlHelper">
                                            This URL defines the endpoint which will be requested to check if a subscription renewal should continue.
                                            Http method: GET.
                                        </b-tooltip>
                                    </label>

                                    <div class="col-md-8">
                                        <input-text class="mb-0" id="renew_url" :form="form" field="renew_url" v-model="form.renew_url"
                                            placeholder="eg: https://domain.io/renew/{returnToken}">
                                        </input-text>

                                        <p v-if="form.invalid" class="invalid-feedback d-block">This field is required.</p>
                                    </div>
                                </div>

                                <div class="form-group row mb-4">
                                    <label for="renewal_request_url" class="col-md-4 col-form-label text-md-right"
                                        :class="{'text-danger': form.invalid || form.errors.has('renewal_request_url')}">
                                        Renewal Request Url

                                        <i ref="renewalRequestUrlHelper" class="fa fa-info-circle tw-cursor-pointer"></i>

                                        <b-tooltip :target="() => $refs.renewalRequestUrlHelper">
                                            This URL defines the endpoint which will be requested if a subscription renewal fails.
                                            Http method: GET.
                                        </b-tooltip>
                                    </label>

                                    <div class="col-md-8">
                                        <input-text class="mb-0" id="renewal_request_url" :form="form" field="renewal_request_url" v-model="form.renewal_request_url"
                                            placeholder="eg: https://domain.io/request/{returnToken}/checkout/{checkoutUrl}">
                                        </input-text>

                                        <p v-if="form.invalid" class="invalid-feedback d-block">This field is required.</p>
                                    </div>
                                </div>

                                <h5>
                                    Available Variables
                                    <i ref="availableVariablesHelper" class="fa tw-cursor-pointer tw-text-base fa-info-circle"></i>

                                    <b-tooltip :target="() => $refs.availableVariablesHelper" placement="right">
                                        These variables will be parsed from the text if present.
                                    </b-tooltip>
                                </h5>

                                <div class="row">
                                    <div class="table-responsive">
                                        <table class="table table-hover table-striped mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Variables</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr v-for="(description, variable) in variables" :key="variable">
                                                    <td>{{ `\{${variable}\}` }}</td>
                                                    <td>{{ description }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-link" type="reset" data-dismiss="modal">
                            Cancel
                        </button>
                        <button class="btn btn-primary">
                            {{form.busy ? 'Saving...' : 'Save'}}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data: () => ({
            selected: null,
            item: null,
            wallets: [],
            form: new Form(),
            variables: {
                token: 'The widget token.',
                returnToken: 'The return token received in the checkout.',
                checkoutUrl: 'The public checkout URL.',
            },
        }),

        async created() {
            await this.fetchWallets();
        },

        computed: {
            hasActiveSubscriptions() {
                return !!this.form.user_subscriptions_count;
            },
        },

        methods: {
            async fetchWallets() {
                let { data } = await this.$http.get(route('wallet.index', { only: 'id,nickname' }));
                this.wallets = data;
            },

            open(widget = {}) {
                $(this.$el).modal('show');
                this.form = new Form(widget);
            },

            close() {
                $(this.$el).modal('hide');
            },

            save() {
                this.form.id ? this.update() : this.create();
            },

            async create() {
                await this.form.post(route('widget.store'));
                this.$emit('saved');
                this.close();
            },

            async update() {
                await this.form.put(route('widget.update', this.form));
                this.$emit('saved');
                this.close();
            },
        },
    };
</script>

<style lang="scss">
    .modal-md {
        min-width: 654px;
        min-height: 425px;
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
