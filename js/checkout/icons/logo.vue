<template>
    <img class="img-fluid logo" :src="resolveImageUrlBasedOnDomain()" height="40px" style="margin:15px">
</template>

<script>
    export default {
        name: "logo",

        methods: {
            resolveImageUrlBasedOnDomain() {
                // new_logo.png
                // return process.env.MIX_APP_THEME === 'flextoken' ? '/images/secondary_domain/full-logo.svg': '/images/landing-page/PMC-full.png';
                return process.env.MIX_APP_THEME === 'flextoken' ? '/images/secondary_domain/full-logo.svg': '/images/landing-page/PMC_gold_logo.png';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .logo {
        height: 45px;
    }
</style>

