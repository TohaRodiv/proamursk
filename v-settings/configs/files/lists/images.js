const state = {
    columnsConfig: {
        mediafiles: [
            {
                name: '',
                type: 'flag',
                is_sortable: false,
                align_text: 'left',
                width: 120,
                fixed: true,
                codename: 'checkbox',
                sort: 'none',
                menu: true
            },
            {
                name: '',
                type: 'image',
                is_sortable: false,
                align_text: 'left',
                width: 100,
                fixed: true,
                codename: 'min_crop_url',
                sort: 'none'
            },
            {
                name: '#',
                type: 'int',
                is_sortable: true,
                align_text: 'left',
                width: 100,
                fixed: true,
                codename: 'id',
                sort: {
                    direction: 'DESC',
                    order_by: 'id'
                }
            },
            {
                name: 'Имя файла оригинала',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 260,
                codename: 'name',
                isMain: true,
                sort: {
                    order_by: 'name'
                }
            },
            {
                name: 'Разрешение, px',
                type: 'resolution',
                codename: '',
                path: {
                    width: 'width',
                    height: 'height'
                },
                is_sortable: false,
                fixed: true,
                align_text: 'left',
                width: 140,
                sort: {
                    order_by: 'width'
                }
            },
            {
                name: 'Размер оригинала',
                type: 'text',
                is_sortable: true,
                fixed: true,
                codename: 'size',
                align_text: 'left',
                width: 160,
                sort: {
                    order_by: 'file_size'
                }
            },
            {
                name: 'Размер миниатюр',
                type: 'text',
                is_sortable: true,
                fixed: true,
                codename: 'thumbnails_size',
                align_text: 'left',
                width: 160,
                sort: {
                    order_by: 'thumbnails_size'
                }
            },
            {
                name: 'Медиатег',
                type: 'tag',
                codename: 'tags',
                align_text: 'left',
                width: 340,
                sort: {
                    order_by: 'file_size'
                }
            },
            {
                name: 'Ссылка',
                type: 'link',
                is_sortable: false,
                align_text: 'left',
                width: 420,
                codename: 'original_url',
                sort: 'none'
            },
            {
                name: 'Дата загрузки',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'create_date',
                sort: {
                    order_by: 'create_date'
                }
            },
        ]
    },
    actionsConfig: {
        mediafiles: {
            addButton: false,
            activationButtons: false,
            deleteButton: true,
        }
    },
    filterConfig: {
        mediafiles: [
            {
                filterTitle: 'Форматы изображений',
                queryName: 'extension_id__in',
                input_type: 'tags',
                api_route: 'mediafiles-extensions',
                sortFlag: {
                    value: 'name',
                    direction: 'asc'
                },
                callbackValue: 'id'
            },
            {
                filterTitle: 'Ширина, px',
                minMaxCodename: 'width',
                queryName: {
                    min: 'width__gte',
                    max: 'width__lte'
                },
                input_type: 'toFromInteger',
            },
            {
                filterTitle: 'Высота, px',
                minMaxCodename: 'height',
                queryName: {
                    min: 'height__gte',
                    max: 'height__lte'
                },
                input_type: 'toFromInteger',
            },
            {
                filterTitle: 'Размер оригинала, КБ',
                minMaxCodename: 'file_size',
                queryName: {
                    min: 'file_size__gte',
                    max: 'file_size__lte'
                },
                input_type: 'toFromInteger',
            },
            {
                filterTitle: 'Медиатеги',
                queryName: 'tags_id__in',
                viewValue: 'name',
                input_type: 'tagSelector',
                api_route: 'mediafiles-tags',
                sortFlag: {
                    value: 'name',
                    direction: 'asc'
                },
                callbackValue: 'id'
            },
            {
                filterTitle: 'Дата загрузки',
                queryName: {
                    min: 'create_date__gte',
                    max: 'create_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
        ]
    },
    additionalListInterfaces: {
        mediafiles: {
            hasGrid: true,
        }
    },
};

export default {
    state
}