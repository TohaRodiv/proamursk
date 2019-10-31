import { idWithoutCheckboxWithMenu, menuWithoutCheckbox } from '../../columns';

const state = {
    columnsConfig: {
        'text-errors': [
            idWithoutCheckboxWithMenu,
            menuWithoutCheckbox,
            {
                name: 'URL страницы',
                type: 'link',
                align_text: 'left',
                width: 240,
                codename: 'url',
                customName: 'original_name',
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
        ],
    },
    actionsConfig: {
        'text-errors': {
            addButton: false,
            activationButtons: false,
            deleteButton: false,
            duplicateButton: false,
        },
    },
    filterConfig: {
        'text-errors': [
            {
                filterTitle: 'Дата создания',
                minMaxCodename: 'create_date',
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