<template>
    <div class="container">

        <div class="row">
            <div class="col-sm-12 col-md-4">
                <balance/>
                <exchange/>
            </div>

            <div class="col-sm-12 col-md-8">
                <div class="card">
                    <div class="card-body p-3">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link active"
                                    data-toggle="tab"
                                    href="#transactions">
                                    Transactions
                                </a>
                            </li>
                            <li class="nav-item">
                                <a
                                    class="nav-link"
                                    data-toggle="tab"
                                    href="#subscriptions">
                                    Subscriptions
                                </a>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <div id="transactions" class="tab-pane fade show active">
                                <transactions/>
                            </div>
                            <div id="subscriptions" class="tab-pane fade">
                                <subscriptions/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script>

import Balance from './balance';
import Exchange from './exchange';
import Transactions from './transactions';
import Subscriptions from './subscriptions';

export default {
    components: {
        Balance,
        Exchange,
        Transactions,
        Subscriptions
    },
}
</script>


<style>
    .left-box{
        min-width: 35%;
    }

    .right-box{
        background-color: white;
        min-width: 65%;
    }

    .border-content {
        border: 1px solid #c7cdd1;
        border-top: none;
        padding-bottom: 2vw;
    }
</style>
