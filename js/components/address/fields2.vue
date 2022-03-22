<template>
    <div style="width:100%;">
        
        <div class="row" style="margin:0;">
            <div class="col-md-6">
                <div class="checkout-form-list">
                    <input type="text" id="city" v-model="form.address.city" :form="form" field="address.city" placeholder="eg: Murray"></input>
                </div>
            </div>
            <div class="col-md-4">
                <div class="checkout-form-list">                                        
                    

                    <select-state v-model="form.address.state" :country-code="form.address.country" class="form-control" id="state"
                        :class="{'is-invalid': form.errors.has('address.state')}"
                        search-country-by="countryShortCode">
                    </select-state>
                </div>
            </div>
            <div class="col-md-2">
                <div class="checkout-form-list">                                        
                    <input type="text" placeholder="Postcode / Zip" v-model="form.address.zipcode"/>
                </div>
            </div>   
        </div>


        <div class="col-md-12">
            <div class="checkout-form-list">
                <select-country v-model="form.address.country" id="country" class="form-control"
                    @change="updateCountryCodes"
                    :class="{'is-invalid': form.errors.has('address.country')}">
                </select-country>

                <p class="invalid-feedback" v-if="form.errors.has('address.country')">{{ form.errors.get('address.country') }}</p>
            </div>
        </div>

       

       
    </div>
</template>

<script>
    export default {
        props: {
            form: { required: true, type: window.Form },
            horizontal: { default: false, type: Boolean },
            labelSize: { default: 3 },
        },

        created() {
            this.initializeAddress();
        },

        computed: {
            labelSizeClass() {
                return 'col-sm-' + this.labelSize + ' text-right mt-1';
            },

            inputSizeClass() {
                return 'col-md-' + (12 - this.labelSize);
            },
        },

        watch: {
            form() {
                this.initializeAddress();
            },
        },

        methods: {
            initializeAddress() {
                const address = this.form.address || {};
                this.$set(this.form, 'address', address);
            },

            updateCountryCodes(country) {
                if (!country) return;
                this.form.address.country_fips = country.fips;
                this.form.address.country_iso3 = country.iso3;
                this.form.address.country_number = country.isoNo;
                this.$emit('selectedCountry', country.iso3);
            },
        },
    };
</script>


