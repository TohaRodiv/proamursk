$(function () {
    if ($('.map').length > 0) {
        var map1, map2, map3;
        ymaps.ready(initMap);

        function initMap() {

            map1 = new ymaps.Map("sp-children-section_1__map", {
                center: [50.231025, 136.886119],
                zoom: 14,
                controls: ['zoomControl']
            });

            map1.behaviors.disable('scrollZoom');

            var map1Places = [
                {
                    coords: [50.218630, 136.906322],
                    title: 'МБДОУ Детский сад комбинированного вида № 9',
                    address: '682640, Хабаровский край, г. Амурск, пр. Мира, 22 б',
                    phone: '99-6-91',
                    site: 'amurskdetsad9.ucoz.ru',
                    mail: 'det_sad_9@mail.ru',
                },
                {
                    coords: [50.225638, 136.905845],
                    title: 'МБДОУ Детский сад комбинированного вида № 14',
                    address: '682640, Хабаровский край, г. Амурск, пр. Комсомольский, 13а',
                    phone: '99-6-78',
                    site: 'mdou14amursk.ucoz.ru',
                    mail: 'mdoy_14@mail.ru',
                },
                {
                    coords: [50.215760, 136.894347],
                    title: 'МБДОУ Детский сад комбинированного вида № 15',
                    address: '682640, Хабаровский край, г. Амурск, ул. Пионерская, 8а',
                    phone: '99-6-81',
                    site: 'duimovochka-27.ucoz.ru',
                    mail: 'mdoudskv15@mail.ru',
                },
                {
                    coords: [50.232283, 136.910274],
                    title: 'МБДОУ Детский сад комбинированного вида № 17',
                    address: '682640, Хабаровский край, г. Амурск, пр. Строителей, 18а',
                    phone: '99-8-79',
                    site: 'amurskdetsad17.ucoz.ru',
                    mail: 'sad-17@mail.ru',
                },
                {
                    coords: [50.240303, 136.908504],
                    title: 'МБДОУ Детский сад комбинированного вида № 21',
                    address: '682640, Хабаровский край,г. Амурск, пр. Октябрьский, 16 а',
                    phone: '99-7-24',
                    site: 'amurskdou21.ucoz.ru',
                    mail: 'dou_21@list.ru',
                },
                {
                    coords: [50.239490, 136.908972],
                    title: 'МБДОУ Детский сад комбинированного вида № 48',
                    address: '682640, Хабаровский край, г. Амурск, пр. Строителей, 40',
                    phone: '99-6-48',
                    site: 'amurskdetsad48.ucoz.ru',
                    mail: 'sad.48@mail.ru',
                },
                {
                    coords: [50.232346, 136.905136],
                    title: 'МБДОУ Детский сад комбинированного вида № 49',
                    address: '682640, Хабаровский край, г. Амурск, пр. Строителей, 29 а',
                    phone: '2-62-36',
                    site: 'amurskdetsad49.ucoz.ru',
                    mail: 'mdoy49amursk@mail.ru',
                },
            ];

            var map1point = new ymaps.GeoObjectCollection(
                {
                    preset: 'islands#icon',
                    iconColor: '#0073FF'
                }
            );
            var map1pointPlacemarks = [];
            for (var i = 0; i < map1Places.length; i++) {
                map1pointPlacemarks.push(new ymaps.Placemark(map1Places[i].coords,
                    {
                        balloonContent: "<div class='balloon'><div class='balloon__title'>" + map1Places[i].title + "</div><table class='sp-place__contacts-table balloon__content'><tbody><tr><td><span class='icon-geo-stroke'></span>Адрес:</td><td>" + map1Places[i].address + "</td></tr><tr><td><span class='icon-phone'></span>Телефон:</td><td>" + map1Places[i].phone + "</td></tr><tr><td><span class='icon-web'></span>Сайт:</td><td><a href='http://unaturalist.ucoz.com' target='_blank'>" + map1Places[i].site + "</a></td></tr><tr><td><span class='icon-instagram'></span>Почта:</td><td><a href='mailto:naturalist27@yandex.ru' target='_blank'>" + map1Places[i].mail + "</a></td></tr></tbody></table></div>"
                    }
                ));
                map1point.add(map1pointPlacemarks[i]);
            }
            map1.geoObjects.add(map1point);

            $('body').on('click', '.sp-map-points__item-btn', function () {
                var currentMapWrap = $(this).parents('.sp-map-wrap'),
                    currentMap = currentMapWrap.find('.sp-map'),
                    currentMapId = currentMap.attr('id');

                currentMapWrap.find('.sp-map-points__item-btn').removeClass('active');
                $(this).addClass('active');

                if (currentMapId === 'sp-children-section_1__map') {
                    var coord = $(this).data('coord');
                    var index = $('.sp-children-section_1__map-wrap').find('.sp-map-points__item-btn').index($(this));

                    map1.panTo(coord, {
                        flying: 1
                    });
                    for (var i = 0; i < map1Places.length; i++) {
                        if (coord[0] === map1Places[i].coords[0] && coord[1] === map1Places[i].coords[1] && i === index) {
                            map1pointPlacemarks[i].balloon.open();
                            break;
                        };
                    }
                    map1.container.fitToViewport();
                }
                else if (currentMapId === 'sp-children-section_2__map') {
                    var coord = $(this).data('coord');
                    var index = $('.sp-children-section_2__map-wrap').find('.sp-map-points__item-btn').index($(this));

                    map2.panTo(coord, {
                        flying: 1
                    });
                    for (var i = 0; i < map2Places.length; i++) {
                        if (coord[0] === map2Places[i].coords[0] && coord[1] === map2Places[i].coords[1] && i === index) {
                            map2pointPlacemarks[i].balloon.open();
                            break;
                        };
                    }
                    map2.container.fitToViewport();
                }
                else if (currentMapId === 'sp-children-section_3__map') {
                    var coord = $(this).data('coord');
                    var index = $('.sp-children-section_3__map-wrap').find('.sp-map-points__item-btn').index($(this));

                    map3.panTo(coord, {
                        flying: 1
                    });
                    for (var i = 0; i < map3Places.length; i++) {
                        if (coord[0] === map3Places[i].coords[0] && coord[1] === map3Places[i].coords[1] && i === index) {
                            map3pointPlacemarks[i].balloon.open();
                            break;
                        };
                    }
                    map3.container.fitToViewport();
                }
            });
        };
    }
});