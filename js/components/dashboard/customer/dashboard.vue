<template>
    <div class="container">
        <div class="right-box py-2">
            <ul class="nav nav-tabs mt-2 mx-2">
                <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#transactions">Transactions</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#subscriptions">Subscriptions</a>
                </li>
            </ul>
            <div class="tab-content border-content mx-2">
                <div id="transactions" class="tab-pane fade show active">
                    <customer-transactions></customer-transactions>
                </div>
                <div id="subscriptions" class="tab-pane fade">
                    <customer-subscriptions></customer-subscriptions>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import CustomerTransactions from './transactions';
    import CustomerSubscriptions from './subscriptions';

    export default {
        components: {
            CustomerTransactions,
            CustomerSubscriptions,
        },
    };
</script>


<style lang="scss" scoped>
    .left-box {
        min-width: 35%;
    }

    .right-box {
        background-color: white;
        min-width: 65%;
    }

    .border-content {
        border: 1px solid #c7cdd1;
        border-top: none;
        padding-bottom: 2vw;
    }

</style>
