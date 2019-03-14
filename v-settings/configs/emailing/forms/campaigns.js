const hint = `<span style="font-weight: 600;">Тег для публикаций:</span>
<ul>
    <li>
        <span>{% posts “тип публикации, id публикации, формат” … %} — Публикации</span>
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
</ul>
<span style="font-weight: 600;">Типы публикаций:</span>
<ul>
    <li>
        <span>new — Новость</span>
    </li>
    <li>
        <span>event — Анонс события</span>
    </li>
    <li>
        <span>report — Репортаж о прошедшем событии</span>
    </li>
    <li>
        <span>history — Историческая статья</span>
    </li>
    <li>
        <span>person — Статья о жителе Амурска</span>
    </li>
    <li>
        <span>place — Статья о месте</span>
    </li>
    <li>
        <span>guide — Гид по городу</span>
    </li>
    <li>
        <span>special — Спецпроект</span>
    </li>
</ul>
<span style="font-weight: 600;">Форматы публикаций:</span>
<ul>
    <li>
        <span>wf — Широкая (wide) с полноразмерной (full) обложкой</span>
    </li>
    <li>
        <span>ws — Широкая (wide) с обычной (standart) обложкой</span>
    </li>
    <li>
        <span>hf — В половину ширины (half) с полноразмерной (full) обложкой</span>
    </li>
    <li>
        <span>hs — В половину ширины (half) с обычной (standart) обложкой</span>
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
                                required: true,
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