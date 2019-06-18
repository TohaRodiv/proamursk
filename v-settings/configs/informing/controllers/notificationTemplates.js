import api from '../../../../cp_vue/frontend/vue/store/utils/api';

const defaultTags = [
    {
        codename: 'title',
        postfix: '"Текст"',
        name: 'Заголовок'
    },
    {
        codename: 'link',
        postfix: '"Ссылка" "Текст"',
        name: 'Ссылка'
    },
    {
        codename: 'email',
        postfix: '"Адрес" "Текст"',
        name: 'Email'
    },
    {
        codename: 'button',
        postfix: '"Ссылка" "Заголовок"',
        name: 'Кнопка'
    },
    {
        codename: 'html_template',
        postfix: '"ID шаблона"',
        name: 'HTML шаблон'
    },
    {
        codename: 'separator',
        name: 'Сепаратор'
    }
];

export default {
    change: {
        action(data, component) {
            this._setHintInfo(data, component);
        },

        channel(data, component) {
            const channel = data.channel;
            const subjectConfig = component.FORM_CONFIG.subject;
            const textConfig = component.FORM_CONFIG.text;

            if (channel) {
                component.$set(subjectConfig, 'show', true);
                component.$set(textConfig, 'show', true);
            } else {
                component.$set(subjectConfig, 'show', false);
                component.$set(textConfig, 'show', false);
            }

            this._setHintInfo(data, component);
        },

        _setHintInfo(data, component) {
            this._makeRequest(data, component)
                .then(items => {
                    const html = this._generateHtml(items);
                    this._installHtml(data, component, html);
                });
        },

        _installHtml(data, component, html) {
            const textConfig = component.FORM_CONFIG.text;
            textConfig.hint = html;
        },

        async _makeRequest(data, component) {
            const actionId = typeof data.action == 'object'
                ? data.action.id
                : data.action;
            const url = '/events/' + actionId;

            try {
                const { variables } = await api.get(url);
                return variables;
            } catch (error) {
                //
            }
        },

        _generateHtml(items) {
            let { tags, vars } = this._getVarsAndTags(items);
            const varsHtml = this._generateHtmlVars(vars);
            const tagsHtml = this._generateHtmlTags(tags);
            const defaultTagsHtml = this._generateHtmlDefaultTags(defaultTags);
            const html = varsHtml + tagsHtml + defaultTagsHtml;
            return html;
        },

        _generateHtmlVars(items) {
            let html = '';

            if (items && items.length > 0) {
                const title = 'Доступные переменные:';
                const array = items.map(item => {
                    const prefix = item.prefix
                        ? item.prefix + ' '
                        : '';
                    return `
                    {{ ${ prefix }${ item.codename } }} &mdash; ${ item.name }`;
                });
                const list = this._arrayToList(array);
                html = `
                <span class="base-hint-message__title">${ title }</span>`;
                html += list;
            }

            return html;
        },

        _generateHtmlTags(items) {
            let html = '';

            if (items && items.length > 0) {
                const title = 'Доступные теги:';
                const array = items.map(item => {
                    const prefix = item.prefix
                        ? item.prefix + ' '
                        : '';
                    return `
                    {% ${ prefix }${ item.codename } %} &mdash; ${ item.name }`;
                });
                const list = this._arrayToList(array);
                html = `
                <span class="base-hint-message__title">${ title }</span>`;
                html += list;
            }

            return html;
        },

        _generateHtmlDefaultTags(items) {
            let html = '';

            if (items && items.length > 0) {
                const title = 'Универсальные теги:';
                const array = items.map(item => {
                    const prefix = item.prefix
                        ? item.prefix + ' '
                        : '';
                    const postfix = item.postfix
                        ? item.postfix + ' '
                        : '';
                    return `{% ${ prefix }${ item.codename } ${ postfix }%} &mdash; ${ item.name }`;
                });
                const list = this._arrayToList(array);
                html = `
                <span class="base-hint-message__title">${ title }</span>`;
                html += list;
            }

            return html;
        },

        _getVarsAndTags(items) {
            const vars = [];
            const email = [];
            const link = [];
            let tags = [];

            items.map(item => {
                const construction = item.construction_type;
                if (construction == 'var') {
                    vars.push(item);
                    const content = item.content_type;

                    if (content == 'email') {
                        email.push(Object.assign({}, item, { prefix: 'email' }));
                    } else if (content == 'link') {
                        link.push(Object.assign({}, item, { prefix: 'link' }));
                        link.push(Object.assign({}, item, { prefix: 'button' }));
                    }
                } else if (construction == 'tag') {
                    tags.push(item);
                }
            });

            tags = [...email, ...link, ...tags];

            return { tags, vars };
        },

        _arrayToList(array) {
            let list = '';

            if (array && array.length > 0) {
                list += `
                <ul>`;
                list += array
                    .map((item, index) => {
                        if (index == array.length - 1) {
                            return `
                            <li>${ item }.</li>`;
                        } else {
                            return `
                            <li>${ item };</li>`;
                        }
                    })
                    .join('');
                list += `
                </ul>`;
            }

            return list;
        }
    }
};