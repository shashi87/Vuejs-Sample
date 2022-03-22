<template>
    <div>
        <div class="form-group" :class="{'text-danger': form.errors.has('address.country'), 'row': horizontal}">
            <label for="country" class="form-label"
                :class="{[labelSizeClass]: horizontal}">
                Country
            </label>

            <div :class="{[inputSizeClass]: horizontal}">
                <select-country v-model="form.address.country" id="country" class="form-control"
                    @change="updateCountryCodes"
                    :class="{'is-invalid': form.errors.has('address.country')}">
                </select-country>

                <p class="invalid-feedback" v-if="form.errors.has('address.country')">{{ form.errors.get('address.country') }}</p>
            </div>
        </div>

        <div class="form-group" :class="{'text-danger': form.errors.has('address.state'), 'row': horizontal}">
            <label for="state" class="form-label" :class="{[labelSizeClass]: horizontal}">
                State
            </label>

            <div :class="{[inputSizeClass]: horizontal}">
                <select-state v-model="form.address.state" :country-code="form.address.country" class="form-control" id="state"
                    :class="{'is-invalid': form.errors.has('address.state')}"
                    search-country-by="countryShortCode">
                </select-state>

                <p class="invalid-feedback" v-if="form.errors.has('address.state')">{{ form.errors.get('address.state') }}</p>
            </div>
        </div>

        <div class="form-group" :class="{'text-danger': form.errors.has('address.city'), 'row': horizontal}">
            <label for="city" class="form-label" :class="{[labelSizeClass]: horizontal}">
                City
            </label>

            <div :class="{[inputSizeClass]: horizontal}">
                <input-text id="city" class="mb-0" v-model="form.address.city" :form="form" field="address.city" placeholder="eg: Murray"></input-text>
            </div>
        </div>

        <div class="form-group" :class="{'text-danger': form.errors.has('address.line1'), 'row': horizontal}">
            <label for="line1" class="form-label" :class="{[labelSizeClass]: horizontal}">
                Address Line 1
            </label>

            <div :class="{[inputSizeClass]: horizontal}">
                <input-text id="line1" class="mb-0" v-model="form.address.line1" :form="form" field="address.line1" placeholder="eg: Street Address with Number"></input-text>
            </div>
        </div>

        <div class="form-group" :class="{'text-danger': form.errors.has('address.line2'), 'row': horizontal}">
            <label for="line2" class="form-label" :class="{[labelSizeClass]: horizontal}">
                Address Line 2 (Optional)
            </label>

            <div :class="{[inputSizeClass]: horizontal}">
                <input-text id="line2" v-model="form.address.line2" :form="form" field="address.line2" placeholder="eg: Apartment"></input-text>
            </div>
        </div>

        <div class="form-group mb-0" :class="{'text-danger': form.errors.has('address.zipcode'), 'row': horizontal}">
            <label for="zipcode" class="form-label" :class="{[labelSizeClass]: horizontal}">
                Zip Code
            </label>

            <div :class="{[inputSizeClass]: horizontal}">
                <input-text id="zipcode" v-model="form.address.zipcode" :form="form" field="address.zipcode" placeholder="eg: 12345" class="mb-0"></input-text>
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
