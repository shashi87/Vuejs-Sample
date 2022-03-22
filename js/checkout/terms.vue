<template>
    <div class="modal">
        <div class="modal-dialog md:tw-max-w-3xl modal-dialog sm:tw-max-w-full sm:tw-px-6">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        Terms and Conditions
                    </h5>
                    <button class="close" type="button" @click="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div v-html="html_content"/>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-default" type="button" data-dismiss="modal">
                        Close
                    </button>

                    <button @click="acceptTerms" class="btn btn-primary" type="button">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                html_content : null,
            }
        },

        created() {
            axios.get(route('terms')).then(response => {
                this.html_content = response.data;
            });
        },

        methods: {
            open() {
                $(this.$el).modal('show');
            },

            close() {
                $(this.$el).modal('hide');
            },

            acceptTerms() {
                this.$emit('accept');
                this.close();
            },
        }
    }
</script>
