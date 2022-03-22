<template>
    <div>
        <div class="card card-default">
            <div class="card-header">
                Update Company Address
            </div>

            <div class="card-body">
                <div class="alert alert-success" v-if="success">
                    Your company address has been updated!
                </div>

                <div class="form-group row">
                    <div class="col-md-12">
                        <address-fields ref="addressItems"
                                        labelSize="4"
                                        :form="form"
                                        :horizontal="true"></address-fields>
                    </div>
                </div>


                <div class="form-group row">
                    <div class="col-md-8 offset-md-4">
                        <button @click="save()" class="btn btn-primary">Update</button>
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>

<script>

export default {


    props: {
        team: {required: true}
    },

    data() {
        return {
            success: false,
            form: new Form({}),
        }
    },

    mounted() {
        this.loadAddress();
    },

    methods: {
        loadAddress() {
            this.$set(this.form, 'address', this.team.address || {});
        },
        save() {
            this.success = false;
            axios.put(
                route('company.address', {company: this.team.id}),
                {
                    address: this.form.address,
                },
            ).then(response => {
                this.success = true;
            });
        }
    }
}
</script>
