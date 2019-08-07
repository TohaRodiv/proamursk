const state = {
    columnsConfig: {
        files: [
            {
                name: '',
                type: 'flag',
                is_sortable: false,
                align_text: 'left',
                width: 120,
                fixed: true,
                codename: 'checkbox',
                sort: 'none',
                menu: true,
            },
            {
                name: '',
                type: 'fileGrid',
                is_sortable: false,
                align_text: 'left',
                width: 100,
                fixed: true,
                codename: 'extension',
                sort: 'none',
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
                    order_by: 'id',
                },
            },
            {
                name: 'Имя файла',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 260,
                codename: 'name',
                isMain: true,
                sort: {
                    order_by: 'name',
                },
            },
            {
                name: 'Размер',
                type: 'text',
                is_sortable: true,
                fixed: true,
                codename: 'size',
                align_text: 'left',
                width: 100,
                sort: {
                    order_by: 'file_size',
                },
            },
            {
                name: 'Медиатег',
                type: 'tag',
                is_sortable: true,
                codename: 'tags',
                align_text: 'left',
                width: 340,
                sort: {
                    order_by: 'tags',
                },
            },
            {
                name: 'Ссылка',
                type: 'link',
                is_sortable: false,
                align_text: 'left',
                width: 420,
                codename: 'url',
                sort: 'none',
            },
            {
                name: 'Дата загрузки',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'create_date',
                sort: {
                    order_by: 'create_date',
                },
            },
        ],
    },
    actionsConfig: {
        files: {
            addButton: false,
            activationButtons: false,
            deleteButton: true,
            duplicateButton: false,
        },
    },
    filterConfig: {
        files: [
            {
                filterTitle: 'Типы файлов',
                queryName: 'extension_id__in',
                viewValue: 'name',
                input_type: 'tags',
                api_route: 'files-extensions',
                sortFlag: {
                    value: 'name',
                    direction: 'asc',
                },
                callbackValue: 'id',
            },
            {
                filterTitle: 'Размер, КБ',
                minMaxCodename: 'file_size',
                queryName: {
                    min: 'file_size__gte',
                    max: 'file_size__lte',
                },
                input_type: 'toFromInteger',
            },
            {
                filterTitle: 'Медиатеги',
                queryName: 'tags_id__in',
                viewValue: 'name',
                input_type: 'tagSelector',
                api_route: 'files-tags',
                sortFlag: {
                    value: 'name',
                    direction: 'asc',
                },
                callbackValue: 'id',
            },
            {
                filterTitle: 'Дата загрузки',
                queryName: {
                    min: 'create_date__gte',
                    max: 'create_date__lte',
                },
                input_type: 'toFromDate',
                type: 'date_time',
            },
        ],
    },
};

export default {
    state,
};