<template>
    <div class="card tw-bg-white tw-overflow-hidden shadow-sm tw-border-0 sm:tw-mt-6 md:tw-mt-0">
        <div
            class="card-header tw-cursor-pointer tw-bg-white tw-border-0 tw-font-medium tw-py-5 tw-text-grey-darker tw-flex tw-justify-between">
            <div class="tw-mt-1 font-roboto-slab-regular">
                <i class="fa tw-mr-2 tw-text-orange" :class="{'fa-angle-right' : !show , 'fa-angle-down': show}"></i>
                {{ completing ? 'Login to your account' : `Pay with your ${isFlexTokenTheme ? 'FLX' : 'PMC'} account` }}
            </div>
            <div class="tw-flex">
                <small-logo/>
                <i class="fa fa-lock tw-ml-2 tw-mt-1 tw-text-gray-500"></i>
            </div>
        </div>
        <div class="collapse show">
            <div class="card-body">
                <form action="" @submit.prevent="login()">
                    <div class="form-group">
                        <label for="email" class="tw-text-brown-darker font-roboto-slab-regular">Email</label>
                        <input id="email" type="email" class="form-control tw-bg-brown-lightest"
                               :class="{'is-invalid': form.errors.has('email')}"
                               name="email" v-model="form.email"/>
                        <p class="invalid-feedback">{{form.errors.get('email')}}</p>
                    </div>

                    <div class="form-group">
                        <label for="password" class="tw-text-brown-darker font-roboto-slab-regular">Password</label>
                        <input id="password" type="password" class="form-control tw-bg-brown-lightest"
                               :class="{'is-invalid': form.errors.has('password')}"
                               name="password" v-model="form.password"/>
                        <p class="invalid-feedback">{{form.errors.get('password')}}</p>
                    </div>

                    <button
                        :disabled="form.submitting"
                        class="btn btn-primary tw-text-white tw-px-8 tw-py-2 tw-mt-7 tw-mb-1">
                        <i v-if="form.submitting" class="fa fa-spinner fa-spin"></i>
                        Log In
                    </button>
                    <div class="tw-mt-2">
                        <a href="/password/reset"
                           class="tw-text-sm tw-text-grey-dark tw-font-light small">
                            Forgot email or password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import SmallLogo from './icons/small-logo';

export default {
    name: 'checkout-login',
    components: { SmallLogo },
    props: {
        checkoutId: { required: true },
        completing: { default: false },
    },
    data: () => ({
        show: true,
        isFlexTokenTheme: process.env.MIX_APP_THEME === 'flextoken',
        form: new Form({
            email: null,
            password: null,
        }),
    }),
    mounted() {
        $('#collapseLogin')
            .on('hide.bs.collapse', () => {
                this.show = !this.show;
            })
            .on('show.bs.collapse', () => {
                this.show = !this.show;
            });
    },
    methods: {
        async login() {
            try {
                await this.form.post(`/checkout-login`);
                window.location.reload();
            } catch (e) {
                window.error = e;
            }
        },
    },
};
</script>

<style scoped>
</style>
