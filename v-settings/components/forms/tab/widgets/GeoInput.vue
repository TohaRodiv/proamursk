<template>
    <div :class="{'col12': labelPosition === 'top', 'col16': labelPosition === 'left'}" :style="(labelPosition === 'left') ? {display: 'flex'} : false">
        <div class="tab-left-label col4" v-if="labelPosition === 'left' && options.required">
            <div class="hint-wrapper" v-if="labelPosition === 'left' && options.hint.length > 0">
                <div class="hint-inner-wrapper">
                    <div
                            class="hint-container icon-question"
                            @mouseenter="showHint = true"
                            @mouseleave="showHint = false">
                    </div>
                    <div v-if="showHint" class="arrow-wrapper">
                        <div class="hint-arrow"></div>
                    </div>
                    <div class="hint-message" v-if="showHint">{{options.hint}}</div>
                </div>
            </div>
            <span class="label-text tab-required-star-left" v-html="options.label"></span>
        </div>
        <div class="tab-left-label col4" v-if="labelPosition === 'left' && !options.required">
            <div class="hint-wrapper" v-if="labelPosition === 'left' && options.hint.length > 0">
                <div class="hint-inner-wrapper">
                    <div
                            class="hint-container icon-question"
                            @mouseenter="showHint = true"
                            @mouseleave="showHint = false">
                    </div>
                    <div v-if="showHint" class="arrow-wrapper">
                        <div class="hint-arrow"></div>
                    </div>
                    <div class="hint-message" v-if="showHint">{{options.hint}}</div>
                </div>
            </div>
            <span class="label-text" v-html="options.label"></span>
        </div>
        <div v-if="labelPosition === 'top'" style="display: flex; max-width: 100%; padding-right: 15px">
            <div class="tab-top-label ellipsis" style="width: auto;">
                <span class="label-text" v-html="options.label"></span>
            </div>
            <span class="tab-required-star" v-if="options.required"></span>
            <div class="hint-wrapper" v-if="options.hint.length > 0">
                <div class="hint-inner-wrapper">
                    <div
                            class="hint-container icon-question"
                            @mouseenter="showHint = true"
                            @mouseleave="showHint = false">
                    </div>
                    <div v-if="showHint" class="arrow-wrapper">
                        <div class="hint-arrow"></div>
                    </div>
                    <div class="hint-message" v-if="showHint">{{options.hint}}</div>
                </div>
            </div>
        </div>

        <div style="width: 700px">
            <div class="selector-ghost" style="z-index: 2;" v-on-clickaway="closeSelector">
                <div class="geo-wrapper" :class="{'selector-opened': selectorOpened, 'blocked-field-bg': isBlocked, 'input-on-error': options.invalid}" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
                    <input
                            type="text"
                            ref="selectorInput"
                            v-model="value"
                            @focus="validateOnchange()"
                            :disabled="isBlocked"
                            placeholder="Введите адрес или укажите точку на карте"
                            @blur="isFocused = false"
                            :class="{'blocked-field-bg': isBlocked}"
                            class="input selector-active-part"
                            @click.self="(!isBlocked) ? toggleSelector() : false">
                    <div class="input-error-message" v-if="options.invalid && isHovered">
                        {{options.message}}
                    </div>
                    <div
                            class="geo-selector-icon icon-geo"
                            @click="(!isBlocked) ? openBalloon(true) : false"
                            :class="{'selector-with-tags-opened': selectorOpened, 'geo-selector-icon-opened': (map !== '') ? Object.keys(pickedItem).length > 0: false, 'single-selector-arrow-blocked': isBlocked, 'blocked-field-bg': isBlocked}">
                    </div>
                    <!--<div class="geo-selector-picked-container" :class="{'single-selector-picked-container-blocked': isBlocked}" style="padding: 8px 15px" v-if="Object.keys(pickedItem).length > 0 && !selectorOpened" @click="(!isBlocked) ? toggleSelector() : false">-->
                        <!--<span class="ellipsis">{{pickedItem.name}}</span>-->
                    <!--</div>-->
                </div>
                <div class="geo-dropwdown" style="margin-top: 5px" v-if="selectorOpened && value.length !== 0 && completeCallback.length > 0">
                    <div class="selector-dropwdown-row" v-for="(item, itemDex) in completeCallback" :key="itemDex">
                        <div class="selector-dropdown-item geo-selector-item" @click="pickItem(item)">
                            <span class="ellipsis">{{item.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="map" class="geo-map-container" style="position: relative">
                <preloader :show-preloader="showPreloader" :mode="'geo'"></preloader>
            </div>
        </div>
    </div>
</template>

<script>
    import { mixin as clickaway } from 'vue-clickaway'
    import axios from 'axios'
    import preloader from '../../../../../cp_vue/frontend/vue/components/Preloader.vue'

    export default {
        mixins: [clickaway],
        props: {
            labelPosition: {
                type: String,
                default: 'left',
            },
            options: {
                type: Object,
                default: ()=>{
                    return {
                        view_structure: [
                            {
                                codename: 'name'
                            },
                        ],
                        codename: 'coordinates',
                        label: 'Дефолтный лейбл',
                        required: false,
                        hint: '',
                    }
                }
            },
            isBlocked: Boolean,
            coordinates: String,
            showMap: Boolean,
        },

        data() {
            return {
                pointFoundByCords: false,                                                                               /*Флаг который отвечает за нахождение точки по данным изначально координатам*/
                selectorOpened: false,
                pickedItem: {},
                completeCallback: [],
                rawGeocoder: [],

                isHovered: false,
                isFocused: false,

                instantCords: '',
                value: '',
                map: '',
                point: '',
                objectManager: '',

                showPreloader: false,
            }
        },
        mounted() {
            this.showPreloader = true;
            window.onload = () => {                                                                                     /*Когда страница загружается прямо на форме*/
                if (!this.map)
                    this.mapInstance();
            };
            if (!this.map)
                this.mapInstance();                                                                          /*Когда на форму переходят с другого интерфейса*/
            if (this.coordinates)
                this.$store.commit('setFormsObject', {[this.options.codename]: this.coordinates});
        },

        watch: {
            'value': function () {
                if (this.value === '') {
                    this.map.balloon.close();
                    this.pickedItem = {};
                    this.$store.commit('setFormsObject', {[this.options.codename]: ''});
                    this.objectManager.remove(this.point);
                    this.point = ''
                }

                if (/\d+\.?\d*,\s*\d+\.?\d*/.test(this.value)) {
                    let apart = this.value.split(' ');
                    let lat = apart[0].substring(0, apart[0].length - 1);
                    let lng = apart[1];
                    if (this.isFocused) this.getNameFromPlace(lng, lat, true);
                } else {
                    if (this.value !== '' && this.isFocused) this.getPlaceFromName();
                }
            },

            'pickedItem': function () {
                this.$emit('pickedItem', this.pickedItem);
                if (Object.keys(this.pickedItem).length > 0) this.$store.commit('setFormsObject', {[this.options.codename]: this.pickedItem.cord.lat + ', ' + this.pickedItem.cord.lng});
                else this.$store.commit('setFormsObject', {[this.options.codename]: ''})
            },

            'showMap': function () {
                if (this.showMap && !this.map)
                    this.mapInstance();
                else {
                    if (this.map !== '')
                        this.map.destroy();
                    this.map = '';
                }
            },

            'coordinates': function() {
                this.$store.commit('setFormsObject', {[this.options.codename]: this.coordinates});

                if (this.coordinates) {
                    let split = this.coordinates.split(', ');
                    let cords = [+split[0], +split[1]];
                    this.map.setCenter(cords, this.map.zoom);
                    this.getNameFromPlace(cords, false);
                }

            },
        },

        methods: {
            mapInstance(){
                if (typeof ymaps.geolocation !== 'undefined') {
                    ymaps.geolocation.get()
                        .then((res) => {
                            if (this.map === '') {
                                this.map = new ymaps.Map('map', {
                                    center: [res.geoObjects.position[0], res.geoObjects.position[1]],
                                    zoom: 13
                                });
                            }

                            this.map.controls.remove('searchControl');
                            this.map.controls.remove('routeButton');
                            this.map.controls.remove('routeEditor');
                            this.map.controls.remove('routePanel');
                            this.map.controls.remove('trafficControl');
                            this.map.controls.remove('fullscreenControl');
                            this.map.controls.remove('listBox');
                            this.map.controls.remove('typeSelector');

                            if (this.coordinates) {
                                let split = this.coordinates.split(', ');
                                let cords = [+split[0], +split[1]];
                                this.map.setCenter(cords, this.map.zoom);
                                this.getNameFromPlace(cords, false);
                            }

                            this.showPreloader = false;
                        })
                        .then(()=>{
                            this.map.events.add('click', (e) => {
                                if (!this.isBlocked){
                                    let cords = e.get('coords');
                                    this.instantCords = cords;
                                    this.getNameFromPlace(cords);
                                    this.$store.commit('setFormsObject', {[this.options.codename]: cords[1] + ', ' + cords[0]});
                                }
                            });

                            this.objectManager = new ymaps.GeoObjectCollection();
                            this.map.geoObjects.add(this.objectManager);
                            this.objectManager.events.add('click', this.clickObjectOnMap);
                        })
                }
            },

            clickObjectOnMap(e) {
                this.openBalloon();
            },

            getPlaceFromName(){
                let configs = {
                    withCredentials: false,
                    params: {
                        geocode: this.value,
                        format: 'json'
                    }
                };

                axios.get('https://geocode-maps.yandex.ru/1.x/', configs)
                    .then((r) => {
                        this.rawGeocoder = r.data.response.GeoObjectCollection.featureMember;
                        this.createOptions();
                    });
            },

            getNameFromPlace(cords, requestFromSelector){
                let configs = {
                        withCredentials: false,
                        params: {
                            geocode: cords[1] + ', ' + cords[0],
                            format: 'json'
                        }
                    };

                axios.get('https://geocode-maps.yandex.ru/1.x/', configs)
                    .then((r) => {
                        let path = r.data.response.GeoObjectCollection.featureMember[0].GeoObject;
                        this.completeCallback = [];
                        this.pickedItem = {
                            name: path.name + ', ' + path.description,
                            cord: {
                                lat: cords[0],
                                lng: cords[1]
                            }
                        };
                        this.value = this.pickedItem.name;
                        if (!requestFromSelector) this.setPoint(cords);
                        else {
                            this.rawGeocoder = r.data.response.GeoObjectCollection.featureMember;
                            this.createOptions();
                        }
                    });
            },

            pickItem(item){
                this.pickedItem = item;
                this.value = item.name;
                this.closeSelector();
                let cords = [+item.cord.lat, +item.cord.lng];
                this.map.setCenter(cords, this.map.zoom);
                this.setPoint(cords);

                this.$store.commit('setFormsObject', {[this.options.codename]: item.cord.lng + ', ' + item.cord.lat});
            },

            createOptions(){
                this.completeCallback = [];
                for (let i = 0; i < this.rawGeocoder.length; i++) {
                    const node = this.rawGeocoder[i];
                    this.completeCallback.push({
                        name: node.GeoObject.name + ', ' + node.GeoObject.description,
                        cord: {
                            lat: node.GeoObject.Point.pos.split(' ')[1],
                            lng: node.GeoObject.Point.pos.split(' ')[0]
                        }
                    })
                }
            },

            setPoint(cords){
                if (this.point !== '') {
                    this.objectManager.remove(this.point);
                    this.point = '';
                }

                this.point = new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: cords
                    }
                });
                this.map.balloon.close();
                this.objectManager.add(this.point);
            },

            openMapPopup(cords){
                this.map.balloon.open(cords, {
                    contentHeader: this.pickedItem.name,
                    contentBody: `<span style="color: rgba(35, 41, 46, .5);">Координаты: ${cords[0].toFixed(4)}, ${cords[1].toFixed(4)}</span>`,
                })
            },

            openBalloon(centerMap){
                if (Object.keys(this.pickedItem).length > 0) {
                    let cords = [+this.pickedItem.cord.lat, +this.pickedItem.cord.lng];
                    if (centerMap) this.map.setCenter(cords, this.map.zoom);
                    this.openMapPopup(cords)
                }
            },

            toggleSelector(){
                this.selectorOpened = !this.selectorOpened;
                setTimeout(() => {
                    if (this.selectorOpened) {
                        this.$refs.selectorInput.focus();
                        this.$refs.selectorInput.select()
                    }

                }, 100);

            },

            closeSelector(){
                this.selectorOpened = false;
            },

            validateOnchange(){
                this.isFocused = true;
                this.$emit('clearErrors', {index: this.child_entity_id});
                if (this.options.invalid === true) {
                    this.$emit('clearErrors', this.options.codename);                                                   /*Эмит для сложных доч. сущностей*/
                    let tabHasErrors = {
                        tabId: 0,
                        status: false
                    };

                    const payload = {view: this.$route.params.view};
                    const config = this.$store.getters.getFormsConfig(payload);

                    for (let a = 0; a < config.length; a++) {
                        const tab = config[a];
                        for (let b = 0; b < tab.blocks.length; b++) {

                            const block = tab.blocks[b];
                            for (let c = 0; c < block.elements.length; c++) {


                                const element = block.elements[c];

                                if (element.codename === this.options.codename) {
                                    tabHasErrors.tabId = tab.id;
                                    this.$store.commit('setInvalidStatus', {view: this.$route.params.view, tabIndex: a, blockIndex: b, elementIndex: c, status: false, message: ''});
                                }
                                tabHasErrors.status = element.invalid;
                            }
                        }
                    }
                    if (tabHasErrors.status === false) this.$store.commit('setInvalidStatusOnTab', {view: this.$route.params.view, tabId: tabHasErrors.tabId, status: false});
                }
            },
        },

        components: {
            preloader,
        }
    }
</script>