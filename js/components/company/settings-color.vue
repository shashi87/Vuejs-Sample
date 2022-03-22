<template>
    <div>
        <div class="card card-default">
            <div class="card-header">
                Update Company Checkout Colors
            </div>

            <div class="card-body">
                <div class="alert alert-success" v-if="success">
                    Your company colors has been updated!
                </div>

                <div
                    class="p-2 mb-2 rounded d-flex"
                    :style="{background: background}">
                    <div>
                        <img class="img-fluid" :src="team.photo_url" width="40px" />
                    </div>

                    <h3
                        class="pl-2 my-auto font-weight-bold"
                        :style="{color: text}">
                        {{team.name}}
                    </h3>
                </div>

                <div class="offset-md-4 d-flex py-2">
                    <el-color-picker v-model="background" class="pr-2"/>
                    <span class="my-auto">Background color</span>
                </div>

                <div class="offset-md-4 d-flex py-3">
                    <el-color-picker v-model="text" class="pr-2"/>
                    <span class="my-auto">Text color</span>
                </div>


                <button @click="saveColors()" class="offset-md-4 btn btn-primary">
                    Update
                </button>

            </div>
        </div>
    </div>
</template>

<script>
import {ColorPicker} from 'element-ui';
import 'element-ui/lib/theme-chalk/color-picker.css';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

export default {
    components: {
        ColorPicker
    },

    props: {
        team: {required: true}
    },

    data() {
        return {
            background: this.team.settings ? this.team.settings.background : '#488dc9',
            text: this.team.settings ? this.team.settings.text : '#fff',
            success: false,
        }
    },

    methods: {
        checkLuminosity() {
            let luminosity = this.$colorLuminosity(this.text) - this.$colorLuminosity(this.background);

            if (50 >= Math.abs(luminosity)) {
                this.$alert(
                    {
                        title: 'warning',
                        message: 'These colors are very similar, please select colors that generate higher contrast.'
                    }
                );
                return;
            }
        },

        saveColors() {
            this.checkLuminosity();
            this.success = false;

            axios.put(
                route('company.color', {company: this.team.id}),
                {
                    background: this.background,
                    text: this.text
                },
            ).then(response => {
                this.success = true;
            });
        }
    }
}
</script>
