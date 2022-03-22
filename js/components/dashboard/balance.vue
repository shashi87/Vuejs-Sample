<template>
    <div class="card bg-white">
        <div class="card-body">
            <div class="card-title">
                <p class="balance-title"> Balance </p>
                <a href="/wallets?newWallet=true" v-if="!teamUserHasWallet"> New Wallet <i class="fas fa-angle-right pl-1"></i></a>
            </div>

            <div class="d-flex flex-row pb-3"  v-if="teamUserHasWallet">
                <!-- <div class="mr-3"> -->
                    <!-- <draw-pmc-coin :width="59" :height="59"></draw-pmc-coin> -->
                <!-- </div> -->

                <div class="pmc-values">
                    <div v-if="total_in_pmc || total_in_pmc === 0">
                        <input v-model="total_in_pmc" v-money="pmc" style="display: none"/>
                        <span class="pmc-number"> {{total_in_pmc}} </span>
                        <span class="pmc-suffix">PMC</span>
                    </div>

                    <div v-if="total_in_dollar || total_in_dollar === 0">
                        <input v-model="total_in_dollar" v-money="dollar" style="display: none"/>
                        <span class="dollar-number"> {{ total_in_dollar }}</span>
                        <span class="dollar-suffix"> USD </span>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row pb-5 pt-3 justify-content-center new-wallet-info" v-if="!teamUserHasWallet">
                <span> Add a new wallet to review your balance</span>
            </div>
        </div>
    </div>
</template>

<script>
import { VMoney } from 'v-money';

export default {
    directives: { money: VMoney },

    data: () => ({
        total_in_dollar: null,
        total_in_pmc: null,
        dollar: {
            decimal: '.',
            thousands: '',
            prefix: '$',
            suffix: '',
            precision: 2,
            masked: false,
        },
        pmc: {
            decimal: '.',
            thousands: '',
            prefix: '',
            suffix: '',
            precision: 1,
            masked: false,
        },
    }),

    computed: {
        teamUserHasWallet() {
            return this.spark.state.currentTeam.has_wallets;
        },
    },

    created() {
        this.fetchData();
    },

    methods: {
        async fetchData() {
            try {
                let data = await axios.get(route('team-balance'));
                this.total_in_dollar = data.data.total_in_dollar;
                this.total_in_pmc = data.data.total_in_pmc;
            } catch (error) {}
        },
    },
};
</script>

<style>
.balance {
    background-color: white;
}

.new-wallet-info {
    font-size: 16px;
    font-weight: 100;
    opacity: 92%;
}

.pmc-coin {
    min-width: 19%;
}

.pmc-values {
    font-family: 'Lato';
    font-weight: 300;
    margin-top: -17px;
}

.pmc-number {
    font-size: 65px;
    margin-right: -10px;
}

.pmc-suffix {
    font-size: 35px;
}

.dollar-number {
    font-size: 29px;
}

.dollar-suffix {
    font-size: 21px;
}
</style>
