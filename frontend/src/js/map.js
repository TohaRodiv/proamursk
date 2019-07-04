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



            map2 = new ymaps.Map("sp-children-section_2__map", {
                center: [50.231025, 136.886119],
                zoom: 14,
                controls: ['zoomControl']
            });

            map2.behaviors.disable('scrollZoom');

            var map2Places = [
                {
                    coords: [50.217074, 136.895659],
                    title: 'МОУ СОШ № 2',
                    address: 'г. Амурск, Школьная улица, 9',
                    phone: '2-83-58',
                    site: 'school2-amursk.ucoz.ru',
                    mail: ''
                },
                {
                    coords: [50.230421, 136.908504],
                    title: 'МОУ СОШ № 3',
                    address: 'Хабаровский край, Амурский р-н, Эльбан пос., 1 мкр., 27',
                    phone: '4-20-82',
                    site: 'elban3s.edusite.ru',
                    mail: 'elbans32006@rambler.ru'
                },
                {
                    coords: [50.225782, 136.904049],
                    title: 'МОУ СОШ № 5',
                    address: 'Хабаровский край, г. Амурск, Комсомольский просп., 7а',
                    phone: '2-48-27',
                    site: 'shcola5amursk.ucoz.ru',
                    mail: 'amurskshkola5@rambler.ru'
                },
                {
                    coords: [50.236604, 136.908585],
                    title: 'МБОУ СОШ № 6',
                    address: 'г. Амурск, Октябрьский проспект, 2А',
                    phone: '2-64-86',
                    site: 'shcola6amursk.ucoz.ru',
                    mail: 'shcola6amursk@rambler.ru'
                },
                {
                    coords: [50.242141, 136.909034],
                    title: 'МОУ НОШ № 7',
                    address: 'г. Амурск, Октябрьский проспект, 15',
                    phone: '2-76-96',
                    site: 'school7-amursk.ucoz.ru',
                    mail: ''
                },
                {
                    coords: [50.246789, 136.920272],
                    title: 'МОУ СОШ № 9',
                    address: 'г. Амурск, Комсомольский проспект, 81А',
                    phone: '3-28-99',
                    site: 'amk-scool9.ucoz.ru',
                    mail: 'scool9amk@mail.ru'
                },
                {
                    coords: [50.232115, 136.907804],
                    title: 'Специальная коррекционная общеобразовательная школа-интернат VIII вида № 14',
                    address: 'г. Амурск, просп. Строителей, 16',
                    phone: '2-45-80',
                    site: 'internat14.ru',
                    mail: 'internat14@edu.27.ru'
                }
            ];

            var map2point = new ymaps.GeoObjectCollection(
                {
                    preset: 'islands#icon',
                    iconColor: '#0073FF'
                }
            );
            var map2pointPlacemarks = [];
            for (var i = 0; i < map2Places.length; i++) {
                map2pointPlacemarks.push(new ymaps.Placemark(map2Places[i].coords,
                    {
                        balloonContent: "<div class='balloon'><div class='balloon__title'>" + map2Places[i].title + "</div><table class='sp-place__contacts-table balloon__content'><tbody><tr><td><span class='icon-geo-stroke'></span>Адрес:</td><td>" + map2Places[i].address + "</td></tr><tr><td><span class='icon-phone'></span>Телефон:</td><td>" + map2Places[i].phone + "</td></tr><tr><td><span class='icon-web'></span>Сайт:</td><td><a href='http://unaturalist.ucoz.com' target='_blank'>" + map2Places[i].site + "</a></td></tr><tr><td><span class='icon-instagram'></span>Почта:</td><td><a href='mailto:naturalist27@yandex.ru' target='_blank'>" + map2Places[i].mail + "</a></td></tr></tbody></table></div>"
                    }
                ));
                map2point.add(map2pointPlacemarks[i]);
            }
            map2.geoObjects.add(map2point);



            map3 = new ymaps.Map("sp-children-section_3__map", {
                center: [50.231025, 136.886119],
                zoom: 14,
                controls: ['zoomControl']
            });

            map3.behaviors.disable('scrollZoom');

            var map3Places = [
                {
                    coords: [50.216722, 136.902162],
                    title: 'Детский оздоровительно-образовательный центр «Юность»',
                    address: 'г. Амурск, ул. Лесная, 4а',
                    phone: '22-49-79',
                    site: 'un-amk.edu.27.ru',
                    mail: 'unross@yandex.ru un_amk@edu.27.ru'
                },
                {
                    coords: [50.216722, 136.902162],
                    title: 'Детско-юношеская спортивная школа',
                    address: 'г. Амурск, ул. Лесная, 4а',
                    phone: '22-49-79',
                    site: 'sportschool-amursk.ru',
                    mail: 'sportshkola_2@mail.ru'
                },
                {
                    coords: [50.244854, 136.918943],
                    title: 'Клуб «Киокушин»',
                    address: 'г. Амурск, Комсомолький пр-т, д. 77',
                    phone: '+7 924 224-06-35',
                    site: 'kyokushinkai-karate.ru',
                    mail: ''
                },
                {
                    coords: [50.244992, 136.920668],
                    title: 'Детская художественная школа',
                    address: 'г. Амурск, Комсомольский пр-т, 67',
                    phone: '+ 7 (4214) 29-96-32',
                    site: 'art-amursk.ru',
                    mail: 'artshkola@bk.ru'
                },

                {
                    coords: [50.244992, 136.920668],
                    title: 'Детская школа искусств',
                    address: 'г. Амурск, Комсомольский пр-т, 67',
                    phone: '+ 7 (4214) 29-96-32',
                    site: 'art-amursk.ru',
                    mail: 'artshkola@bk.ru'
                },
                {
                    coords: [50.237543, 136.907058],
                    title: 'Детская музыкальная школа',
                    address: 'г. Амурск, Октябрьский пр-т, 6',
                    phone: '+ 7 (4214) 29-95-81',
                    site: 'dmsh-amur.khv.muzkult.ru',
                    mail: 'schoolmusic@mail.ru'
                },
                {
                    coords: [50.227851, 136.911738],
                    title: 'Дворец культуры',
                    address: 'г. Амурск, Комсомольский пр-т, 48',
                    phone: '+7 (4214) 22-67-60',
                    site: 'dk-amursk.ru',
                    mail: 'amursk-dk@yandex.ru'
                },
                {
                    coords: [50.230104, 136.909915],
                    title: 'Центр творчества «Темп»',
                    address: 'г. Амурск, Победы пр-т, 8а',
                    phone: '+7 (4214) 22-67-05',
                    site: 'cdttemp.ucoz.ru',
                    mail: 'mou_temp@mail.ru'
                },
                {
                    coords: [50.221229, 136.906088],
                    title: 'Лингвистическая школа',
                    address: 'г. Амурск, Мира пр-т, 28а',
                    phone: '+7 (4214) 22-42-18',
                    site: 'lingschool.ucoz.org',
                    mail: 'lingamursk@gmail.com'
                },
                {
                    coords: [50.222307, 136.907229],
                    title: 'Детский эколого-биологический центр «Натуралист»',
                    address: 'г. Амурск, Комсомольский пр-т, 2а',
                    phone: '+7 (4214) 22-13-14',
                    site: 'naturalist.ucoz.com',
                    mail: 'naturalist27@yandex.ru'
                },
                {
                    coords: [50.242141, 136.909034],
                    title: 'Центр детского и юношеского туризма и экскурсий',
                    address: 'г. Амурск, Октябрьский пр-т, 22,',
                    phone: '+7 (4214) 29-96-73',
                    site: 'turcentr.ucoz.ru',
                    mail: 'detyuntur4673.amursk@yandex.ru'
                }
            ];
            var map3point = new ymaps.GeoObjectCollection(
                {
                    preset: 'islands#icon',
                    iconColor: '#0073FF'
                }
            );
            var map3pointPlacemarks = [];
            for (var i = 0; i < map3Places.length; i++) {
                map3pointPlacemarks.push(new ymaps.Placemark(map3Places[i].coords,
                    {
                        balloonContent: "<div class='balloon'><div class='balloon__title'>" + map3Places[i].title + "</div><table class='sp-place__contacts-table balloon__content'><tbody><tr><td><span class='icon-geo-stroke'></span>Адрес:</td><td>" + map3Places[i].address + "</td></tr><tr><td><span class='icon-phone'></span>Телефон:</td><td>" + map3Places[i].phone + "</td></tr><tr><td><span class='icon-web'></span>Сайт:</td><td><a href='http://unaturalist.ucoz.com' target='_blank'>" + map3Places[i].site + "</a></td></tr><tr><td><span class='icon-instagram'></span>Почта:</td><td><a href='mailto:naturalist27@yandex.ru' target='_blank'>" + map3Places[i].mail + "</a></td></tr></tbody></table></div>"
                    }
                ));
                map3point.add(map3pointPlacemarks[i]);
            }
            map3.geoObjects.add(map3point);


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