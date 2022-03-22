<template>
    <div class="container">
        <form @submit.prevent="register()" role="form">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card card-default">
                        <div class="card-header">Profile</div>
                        <div class="card-body">
                            <div class="form-group row" v-if="!invitation">
                                <label for="company" class="col-md-4 col-form-label text-md-right">
                                    Company
                                </label>
                                <div class="col-md-8">
                                    <input id="company" type="text" autofocus="autofocus"
                                           class="form-control" v-model="form.company"
                                           :class="{'is-invalid': form.errors.has('company')}">
                                    <p class="invalid-feedback">{{form.errors.get('company')}}</p>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>
                                <div class="col-md-8">
                                    <input id="name" type="text" class="form-control"
                                           v-model="form.name"
                                           :class="{'is-invalid': form.errors.has('name')}">
                                    <p class="invalid-feedback">{{form.errors.get('name')}}</p>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="email" class="col-md-4 col-form-label text-md-right">E-Mail Address</label>
                                <div class="col-md-8">
                                    <input id="email" type="email" v-model="form.email" class="form-control"
                                           :class="{'is-invalid': form.errors.has('email')}">
                                    <p class="invalid-feedback">{{form.errors.get('email')}}</p>
                                </div>
                            </div>

                            <div class="form-group row" :class="{'text-danger': form.errors.has('phone')}">
                                <label for="phone" class="col-sm-4 md:tw-text-right col-form-label">Phone</label>

                                <div class="col-sm-8">
                                    <input-text id="phone" class="mb-0" v-model="form.phone" :form="form" field="phone"
                                                v-mask="['(###) ###-####', '(##) #####-####']"></input-text>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
                                <div class="col-md-8">
                                    <input id="password" type="password" class="form-control"
                                           v-model="form.password"
                                           :class="{'is-invalid': form.errors.has('password')}">
                                    <p class="invalid-feedback">{{form.errors.get('password')}}</p>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password_confirmation" class="col-md-4 col-form-label text-md-right">
                                    Confirm Password
                                </label>
                                <div class="col-md-8">
                                    <input id="password_confirmation" type="password" name="password_confirmation"
                                           class="form-control" v-model="form.password_confirmation">
                                </div>
                            </div>

                            <div class="form-group row" v-if="!invitation">
                                <div class="col-md-12">
                                    <address-fields labelSize="4" :form="form" :horizontal="true"></address-fields>
                                </div>
                            </div>


                            <terms ref="terms" @accept="form.terms = true"/>

                            <div class="form-group">
                                <div class="offset-md-4">
                                    <div class="custom-control custom-checkbox ml-md-2">
                                        <input
                                            v-model="form.terms"
                                            type="checkbox"
                                            class="custom-control-input"
                                            id="terms"
                                            :class="{'is-invalid': form.errors.has('terms')}">

                                        <label class="custom-control-label" for="terms">
                                            I accept the <a href="#" @click="$refs.terms.open()">Terms and Conditions</a>.
                                        </label>
                                    </div>

                                    <p class="invalid-feedback d-block ml-md-2" v-if="form.errors.has('terms')">
                                        {{form.errors.get('terms')}}
                                    </p>
                                </div>
                            </div>

                            <div class="form-group row mb-0">
                                <div class="col-md-6 offset-md-4">
                                    <button type="submit" class="btn btn-primary" :disabled="form.submitting">
                                        <i v-if="form.submitting" class="fa fa-spinner fa-spin"></i>
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        props: {
            invitation: { default: false },
        },

        name   : 'register',

        data() {
            return {
                form: new Form({
                    company              : null,
                    name                 : null,
                    card                 : {
                        number         : null,
                        expiration_date: null,
                        cvc            : null,
                    },
                    postal_code          : null,
                    email                : null,
                    password             : null,
                    password_confirmation: null,
                    terms                : false,
                    invitation           : this.invitation || false,
                }),
            };
        },

        methods: {
            async register() {
                try {
                    await this.form.post('/company-registration');

                    this.form.submitting = true;
                    window.location      = route(this.invitation ? 'dashboard' : 'on-approval' );
                } catch (e) {
                    this.error = e;
                }
            },
        },
    };
</script>
