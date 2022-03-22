<template>
    <div class="container">
        <div>
            <form role="form" @submit.prevent>
                <input type="text" id="merchant-users-search" class="form-control"
                        name="search"
                        placeholder="Search By Name Or E-Mail Address..."
                        v-model="filter.text"
                        @keyup.enter="search">
            </form>
        </div>

        <div class="card card-default tw-bg-white mt-4" v-if="searching">
            <div class="card-body">
                <i class="fa fa-btn fa-spinner fa-spin"></i> Searching
            </div>
        </div>

        <div class="card card-default tw-bg-white mt-4" v-if=" ! searching && noSearchResults">
            <div class="card-body">
                No users matched the given criteria.
            </div>
        </div>

        <div class="my-4" v-if=" ! searching && searchResults.length > 0">
            <div class="table-responsive tw-bg-white">
                <table class="table table-valign-middle mb-0">
                    <thead class="">
                        <th></th>
                        <th>EMail</th>
                        <th>Default Source</th>
                        <th class="th-fit"></th>
                    </thead>

                    <tbody>
                        <tr v-for="searchUser in searchResults">
                            <td>
                                <img :src="searchUser.photo_url" class="spark-profile-photo" alt="User Photo" />
                            </td>

                            <td>
                                <div class="btn-table-align">
                                    {{ searchUser.email }}
                                </div>
                            </td>

                             <td>
                                <div class="btn-table-align" v-if="searchUser.card_last_four">
                                    <i :class="getCardIcon(searchUser.card_brand)" class="mx-2"></i>
                                    *********{{ searchUser.card_last_four }}
                                </div>
                                <div class="btn-table-align" v-else>
                                    No card
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            test: [],
            filter: {
                text: null,
            },
            searchResults: [], 
            searching: false,
            noSearchResults: false,
            cardIcon: 'fab fa-2x fa-cc-visa',
            perPage: 5,
        };
    },

    created(){
        this.search();
    },

    methods: {
        search(){
            let params = {
                filter: {...this.filter},
                per_page: {...this.perPage}
            };
            this.searching    = true;

            axios.get(route('users.search'), {params})
                .then(response => {
                    this.searchResults = response.data;
                    this.noSearchResults = this.searchResults.length === 0;
                    this.searching = false;
                });
        }, 


        getCardIcon(brand){
            switch (brand) {
                case 'Visa':
                    return 'fab fa-2x fa-cc-visa';
                case 'MasterCard':
                    return 'fab fa-2x fa-cc-mastercard';
                case 'Amex':
                    return 'fab fa-2x fa-cc-amex';
                case 'Discover':
                    return 'fab fa-2x fa-cc-discover';
                default:
                    break;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .th-border-bottom {
        border-bottom: 1px solid #f2f2f2 !important
    }
</style>

