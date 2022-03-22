<template>
    <select v-model="country">
        <option :value="null" selected disabled>{{ placeholder }}</option>
        <option v-for="preSet of preSetsCountries" :key="preSet.value" :value="preSet.value">{{ preSet.label }}</option>
        <option disabled>---</option>
        <option v-for="(country, index) of countries" :key="index" :value="country[valueBy]">{{ country[labelBy] }}</option>
    </select>
</template>

<script>
    import lookup from 'country-code-lookup';

    export default {
        props: {
            placeholder: { default: 'Select Country' },
            value: { default: null },
            valueBy: { default: 'iso2' },
            labelBy: { default: 'country' },
        },

        data() {
            return {
                preSetsCountries: [{value:'US', label: 'United States'}],
                countries: lookup.countries,
                country: this.value,
            };
        },

        watch: {
            value() {
                this.country = this.value;
            },

            country() {
                const country = this.country && lookup.byIso(this.country);
                this.$emit('input', this.country);
                this.$emit('change', country);
            },
        },
    };
</script>
