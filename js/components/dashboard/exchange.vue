<template>
    <div class="card bg-white" v-if="show">
        <div class="card-body">
            <div class="card-title">Gold</div>

            <h2 class="mb-0">${{ change_dollar }}</h2>
            <!-- <span class="trianguleml-2 mr-2" :class="{'negative': change_dollar < 0}"></span> -->
            <div class="text-muted lead">
                <span>${{ usd }} </span>
                <i class="fa fa-chevron-up" :class="change_dollar < 0 ? 'text-danger fa-long-arrow-alt-down' : 'text-success fa-long-arrow-alt-up'"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            show: false,
            usd: null,
            change_dollar : null,
        }),

        async created() {
            await this.fetchData();
            this.show = true;
        },

        methods: {
            async fetchData() {
                let {data}        = await this.$http.get(route('gold-price'));
                this.usd = parseFloat(data.usd).toFixed(2);
                this.change_dollar  = parseFloat(data.change_dollar).toFixed(2);
            }
        }
    }
</script>

<style scoped lang="scss">
    .exchange {
        background-color: white;
    }

    .exchange-numbers {
        font-family: 'Lato';
        font-weight: 300;
    }

    .first-number {
        font-size: 41px;
    }

    .second-number {
        font-size: 58px;
        margin-bottom: -10px;
    }

    .triangule {
        width: 0;
        height: 0;
        border-left: 31px solid transparent;
        border-right: 31px solid transparent;
        border-bottom: 62px solid #61D047;

        &.negative {
            border-top: 62px solid hsl(360, 64%, 55%);
            border-bottom: none !important;
        }
    }

</style>
