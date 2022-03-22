<template>
    <select v-model="state">
        <option :value="null" selected disabled>{{ placeholder }}</option>
        <option v-for="(state, index) of states" :key="index" :value="state[trackBy]">{{ state.name }}</option>
    </select>
</template>

<script>
    import countries from 'country-region-data';

    export default {
        props: {
            placeholder: { default: 'Select State' },
            value: { default: null },
            trackBy: { default: 'shortCode' },
            countryCode: { default: null },
            searchCountryBy: { default: 'countryShortCode' },
        },

        data() {
            return {
                countries,
                states: [],
                state: this.value,
            };
        },

        computed: {
            country() {
                if (!this.countryCode) return null;

                return this.countries.find(c => c[this.searchCountryBy] === this.countryCode);
            },
        },

        watch: {
            value() {
                this.state = this.value;
            },

            state() {
                this.$emit('input', this.state);
            },

            countryCode() {
                const states = this.country ? this.country.regions : [];
                this.states = states.map(s => { s[this.trackBy] = s[this.trackBy] || this.country[this.searchCountryBy]; return s; });
                const state = this.states.find(s => s[this.trackBy] === this.value);
                this.state = (state && state[this.trackBy]) || null;
            },
        },
    };
</script>
