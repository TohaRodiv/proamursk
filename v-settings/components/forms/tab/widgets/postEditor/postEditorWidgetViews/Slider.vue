<template>
    <div class="post-editor-slider-container">
        <div
            v-for="(image, imDex) in data"
            v-if="imDex === currentImage">
            <img :src="image.cover.original_url">
            <div class="post-editor-slider-bottom-container">
                <div
                    class="post-editor-slider-title ellipsis"
                    :title="image.description">{{image.description}}</div>
                <div class="post-editor-slider-controls">
                    <div
                        class="icon-arrow-1"
                        @click="clickLeft"
                        :class="{'post-editor-slider-has-button': currentImage !== 0}"/>
                    <div class="post-editor-slider-controls-page-number">{{currentImage + 1}} / {{data.length}}</div>
                    <div
                        class="icon-arrow-1"
                        @click="clickRight"
                        :class="{'post-editor-slider-has-button': currentImage !== data.length - 1}"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';

export default {
    props: {
        widget: Object,
        isDragOn: Boolean,
    },

    data() {
        return {
            currentImage: 0,
            data: [],
            randomMSec: Math.random() * 50,
        };
    },

    watch: {
        'isDragOn': function (newValue) {
            if (newValue === true) {
                vue.set(this.widget, 'cachedData', this.data);
            } else {
                setTimeout(() => { //Разделяю процесс кеширования на части, чтобы при начале и конце драга браузер не зависал
                    vue.delete(this.widget, 'cachedData');
                }, this.randomMSec);
            }
        },
        'widget.slides': {
            handler: function (newValue) {
                this.getSliderData();
            },
            deep: true,
        },

    },

    mounted(){
        if (this.widget.cachedData) {
            this.data = cloneDeep(this.widget.cachedData);
        }
        else if (typeof this.widget.slides !== 'undefined') {
            this.getSliderData();
        }
    },

    methods: {
        getSliderData(){
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            axios.get(`/sliders/${ (this.widget.slides.id || this.widget.slides) }/`, config)
                .then(response =>{
                    this.data = response.data.slides;
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        this.$store.commit('setErrorsStore', {
                            type: 'failed',
                            message: 'Внутренняя ошибка сервера, попробуйте попытку позже',
                        });
                    }
                    else if (error.response.status === 504) {
                        this.$store.commit('setErrorsStore', {
                            type: 'failed',
                            message: 'Сервер не отвечает, попробуйте повторить попытку позже',
                        });
                    }
                    else if (error.response.status === 403) {
                        if (error.response.headers['user-id']) {
                            this.$store.commit('setErrorsStore', {
                                type: 'failed',
                                message: `Нет прав на /api/sliders/${this.widget.slides.id}/`,
                            });
                        } else {
                            this.$router.push({ name: 'auth', });
                        }
                    }
                    else if (error.response.status === 404) {
                        this.$store.commit('setErrorsStore', {
                            type: 'failed',
                            message: `Адрес /api/sliders/${this.widget.slides.id}/ не существует`,
                        });
                    }
                });
        },

        clickRight(){
            if (this.currentImage !== this.data.length - 1) this.currentImage = this.currentImage + 1;
        },

        clickLeft(){
            if (this.currentImage !== 0) this.currentImage = this.currentImage - 1;
        },
    },
};
</script>