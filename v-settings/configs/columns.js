export const idWithoutCheckboxWithMenu = {
    name: '#',
    type: 'int',
    codename: 'id',
    width: 50,
    fixed: true,
    is_sortable: true,
    sort: {
        direction: 'DESC',
        order_by: 'id',
    },
};

export const menuWithoutCheckbox = {
    type: 'menu',
    name: '',
    width: 50,
    fixed: true,
    is_sortable: false,
    sort: 'none',
};