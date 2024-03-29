import { idWithoutCheckboxWithMenu, menuWithoutCheckbox } from '../../columns';

const state = {
    columnsConfig: {
        'static-pages': [
            idWithoutCheckboxWithMenu,
            menuWithoutCheckbox,
            {
                name: 'Название',
                type: 'int',
                is_sortable: true,
                align_text: 'left',
                width: 200,
                isMain: true,
                codename: 'name',
                sort: {
                    order_by: 'name',
                },
            },
            {
                name: 'Ссылка',
                type: 'link',
                is_sortable: false,
                align_text: 'left',
                width: 230,
                codename: 'site_url',
                sort: 'none',
            },
            {
                name: 'Дата создания',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'create_date',
                sort: {
                    order_by: 'create_date',
                },
            },
            {
                name: 'Дата изменения',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'edit_date',
                sort: {
                    order_by: 'edit_date',
                },
            },
        ],
    },
    actionsConfig: {
        'static-pages': {
            addButton: false,
            activationButtons: false,
            deleteButton: false,
            duplicateButton: false,
        },
    },
    filterConfig: {
        'static-pages': [
            {
                filterTitle: 'Дата создания',
                queryName: {
                    min: 'create_date__gte',
                    max: 'create_date__lte',
                },
                input_type: 'toFromDate',
                type: 'date_time',
            },
            {
                filterTitle: 'Дата изменения',
                queryName: {
                    min: 'edit_date__gte',
                    max: 'edit_date__lte',
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