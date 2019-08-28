
const state = {
    formsOptions: {
        'sidebar-banners': [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Название',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'title',
                                widget: 'simpleInput',
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Ссылка',
                                required: true,
                                invalid: false,
                                width: 10,
                                codename: 'link',
                                widget: 'simpleInput',
                                hint: '',
                                placeholder: 'http(s)://',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                format: 'datetime',
                                label: 'Дата и время<br>начала публикации',
                                required: false,
                                invalid: false,
                                width: 4,
                                codename: 'start_publication_date',
                                widget: 'inputDatetime',
                                hint: '',
                            },
                            {
                                format: 'datetime',
                                label: 'Дата и время<br>окончания публикации',
                                required: false,
                                invalid: false,
                                width: 4,
                                codename: 'end_publication_date',
                                widget: 'inputDatetime',
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'field',
                                label: 'Комментарий',
                                required: false,
                                invalid: false,
                                width: 12,
                                height: 80,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: '',
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                title: 'ИЗОБРАЖЕНИЯ',
                blocks: [
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                inputID: 'wideBannersVertCoverInput',
                                dragID: 'wideBannersVertCoverDrag',
                                label: 'Вертикальный баннер',
                                required: true,
                                width: 6,
                                image: {
                                    width: 760,
                                    height: 920,
                                },
                                codename: 'cover',
                                widget: 'singleImageLoader',
                                modClass: 'marginBottom20',
                                requireSendId: true,
                                key_attr: 'id',
                                hint: '',
                            },
                            {
                                type: 'field',
                                inputID: 'wideBannersHorCoverInput',
                                dragID: 'wideBannersHorCoverDrag',
                                label: 'Горизонтальный баннер',
                                required: true,
                                width: 6,
                                image: {
                                    width: 760,
                                    height: 480,
                                },
                                codename: 'horizontal_cover',
                                widget: 'singleImageLoader',
                                modClass: 'marginBottom20',
                                requireSendId: true,
                                key_attr: 'id',
                                hint: '',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        'sidebar-banners': {
            title: 'Активный баннер',
            hint: 'Неактивные баннеры не отображаются на сайте',
        },
    },
};

export default {
    state,
};