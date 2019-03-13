const hint = `<span style="font-weight: 600;">Тег для публикаций:</span>
<ul>
    <li>
        <span>{% posts “тип публикации, id публикации, формат” … %}</span>
    </li>
</ul>
<span style="font-weight: 600;">Универсальные теги:</span>
<ul>
    <li>
        <span>{% title "Текст" %} - Заголовок</span>
    </li>
    <li>
        <span>{% link "Ссылка" "Текст" %} — Ссылка;</span>
    </li>
    <li>
        <span>{% email "Адрес" "Текст" %} — Email;</span>
    </li>
    <li>
        <span>{% button "Ссылка" "Заголовок" %} — Кнопка;</span>
    </li>
    <li>
        <span>{% separator  %} — Сепаратор.</span>
    </li>
</ul>`

const state = {
    formsOptions: {
        campaigns: [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Название',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'name',
                                widget: 'simpleInput',
                                hint: ''
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Содержание письма',
                                width: 12,
                                widthPopup: '900px',
                                codename: 'content',
                                widget: 'textareaPreviewLetter',
                                hint: hint
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
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
                                hint: ''
                            }
                        ]
                    },
                ]
            }
        ],
    },
};

export default {
    state
}