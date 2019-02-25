<template>
    <div class="post-editor-slider-container">
        <div v-for="(image, imDex) in data" v-if="imDex === currentImage">
            <img :src="image.cover.large_url">
            <div class="post-editor-slider-bottom-container">
                <div class="post-editor-slider-title ellipsis" :title="image.description">{{image.description}}</div>
                <div class="post-editor-slider-controls">
                    <div class="icon-arrow-1" @click="clickLeft" :class="{'post-editor-slider-has-button': currentImage !== 0}"></div>
                    <div class="post-editor-slider-controls-page-number">{{currentImage + 1}} / {{data.length}}</div>
                    <div class="icon-arrow-1" @click="clickRight" :class="{'post-editor-slider-has-button': currentImage !== data.length - 1}"></div>
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
                randomMSec: Math.random() * 50
            }
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
            }
        },

        mounted(){
            if (this.widget.cachedData) {
                this.data = cloneDeep(this.widget.cachedData)
            }
            else if (typeof this.widget.slides !== 'undefined') {
                this.getSliderData();
            }
        },

        methods: {
            getSliderData(){
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
                // Добавил проверку, потому что иногда
                // селектор возвращает весь объект,
                // а не только id
                let id
                if (this.widget.slides.id) {
                    id = this.widget.slides.id
                } else {
                    id = this.widget.slides
                }
                axios.get(`/sliders/${id}/`, config)
                    .then(response =>{
                        this.data = response.data.slides
                    })
                    .catch(error => {
                        if (error.response.status === 500) {
                            this.$store.commit('setErrorMessage', 'Внутреняя ошибка сервера, попробуйте попытку позже');
                        }
                        else if (error.response.status === 504) {
                            this.$store.commit('setErrorMessage', 'Сервер не отвечает, попробуйте повторить попытку позже');
                        }
                        else if (error.response.status === 403) {
                            if (error.response.headers['user-id']) {
                                this.$store.commit('setErrorMessage', `Нет прав на /api/sliders/${this.widget.slides}/`);
                            } else {
                                this.$router.push({name: 'auth'});
                            }
                        }
                        else if (error.response.status === 404) {
                            this.$store.commit('setErrorMessage', `Адрес /api/sliders/${this.widget.slides}/ не существует`);
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
    }
</script>