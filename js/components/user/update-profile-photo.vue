<template>
    <div >
        <div class="form-group row justify-content-center">
            <div class="col-md-12 d-flex align-items-center">
                <div class="image-placeholder mr-4">
                    <span role="img">
                        <img class="profile-photo-preview" :src="linkPhoto">
                    </span>
                </div>
                <div class="mr-4">
                    <input ref="photo" type="file" hidden class="spark-uploader-control" name="photo">
                    <button id="pick-avatar" class="btn btn-outline-dark">Update Photo</button>
                </div>
            </div>
        </div>

        <div v-if="processing" class="text-center tw-text-sm">
            <i class="fa fa-spinner fa-spin mr-1"></i>
            Processing...
        </div>

        <div v-if="form.submitting" class="text-center tw-text-sm">
            <i class="fa fa-spinner fa-spin mr-1"></i>
            Uploading...
        </div>

        <p v-if="form.errors.has('photo')" class="mb-0 tw-text-xs text-danger">{{ form.errors.get('photo') }}</p>

        <avatar-cropper
                trigger="#pick-avatar"
                :output-options="{width: 100, height: 100, fillColor: '#fff'}"
                :cropper-options="defaultCropperOptions"
                :labels="{submit : 'Save', cancel : 'Cancel'}"
                :upload-handler="onChange" />

    </div>
</template>

<script>
    import AvatarCropper from 'vue-avatar-cropper';

    export default {
        components: { AvatarCropper },

        props: {
            photo: { default: '' },
        },

        data() {
            return {
                form: new Form({ photo: null }, 'multipart'),
                linkPhoto: this.photo,
                processing: false,
                defaultCropperOptions: {
                    aspectRatio: 1,
                    movable: true,
                    zoomable: false,
                    minCropBoxWidth: 100,
                    minCropBoxHeight: 100,
                    viewMode: 2,
                },
            };
        },
        methods: {
            onChange(event) {
                const cropper = event;
                this.processing = true;
                cropper.getCroppedCanvas().toBlob(async blob => {
                    let file = new File([blob], 'user.jpeg', { type: 'image/jpeg' });
                    this.form.photo = file;
                    this.processing = false;
                    const request = await this.form.post(route('users.save-photo'));
                    this.linkPhoto = request.data;
                    Bus.$emit('updateUser');
                });
            },
        },
    };
</script>
