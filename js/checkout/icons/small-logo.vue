<template>
    <img class="img-fluid" :src="resolveImageUrlBasedOnDomain()" />
</template>

<script>
    export default {
        name: "small-logo",

        methods: {
            resolveImageUrlBasedOnDomain() {
                return process.env.MIX_APP_THEME === 'flextoken' ? '/images/secondary_domain/icon-logo.svg': '/images/landing-page/PMC-icon.png';
            }
        }
    }
</script>

<style scoped>
    img {
        height: 30px;
        width: 70px;
    }
</style>
