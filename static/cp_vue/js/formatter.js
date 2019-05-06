; 'use strict';


(function (factory) {
    window['Formatter'] = factory()
})(function () {

    function Formatter(element, options) {

        if (!element) return;

        var self = this;
        self.codeView = false;
        var excludeToolbarButtons = [];
        var defaultToolbar = [
            ['setStyle', '|', 'bold', 'italic', 'strikeThrough', 'underline', '|', 'insertUnorderedList', 'insertOrderedList', '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '|', 'link', 'specialChar', 'footnote'],
            ['fontColor', 'backgroundColor']
        ];
        var footerToolbar = ['resetStyles', '|', 'showBlocks', 'editCode', 'fullScreen'];
        var blockTags = ['p', 'div', 'ul', 'ol'];
        var inlineTags = ['a', 'b', 'i', 'span'];
        var defaultColors = ['#eb5ba0', '#be7bb4', '#888ac3', '#5ea8db', '#1eb787', '#88c86f', '#bad775', '#fed74e',
            '#fab362', '#f26f67', '#ffffff'];
        var defaultSpecialChars = ['&laquo;', '&raquo;', '&copy;', '&reg;', '&trade;', '&sect;', '&#36;',
            '&euro;', '&#8381;', '&alpha;', '&beta;', '&lambda;', '&mu;', '&pi;', '&rho;',
            '&omega;', '&Delta;', '&Sigma;', '&Omega;', '&amp;', '&infin;', '&ne;', '&deg;', '&bull;'
        ];


        this.options = {
            width: 740,
            height: 300,
            toolbar: defaultToolbar,
            footerToolbar: footerToolbar,
            formatterFrameCssPath: 'css/formatter_content.css',
            specialChars: defaultSpecialChars,
            colors: defaultColors,
            imagesPath: 'images/',
            excludeToolbarButtons: excludeToolbarButtons
        };

        this.actions = {

            bold: {
                tag: 'b',
                hintText: 'Жирный',
                func: function (actionName) {
                    _textDecoration(actionName);
                }
            },

            italic: {
                tag: 'i',
                hintText: 'Курсив',
                func: function (actionName) {
                    _textDecoration(actionName);
                }
            },

            underline: {
                tag: 'span',
                style: { textDecoration: 'underline' },
                hintText: 'Подчеркнутый',
                func: function (actionName) {
                    _textDecoration(actionName);
                }
            },

            strikeThrough: {
                tag: 'span',
                style: { textDecoration: 'line-through' },
                hintText: 'Зачеркнутый',
                func: function (actionName) {
                    _textDecoration(actionName);
                }
            },

            link: {
                tag: 'a',
                attributes: ['href', 'target', 'title'],
                preventRemovePopUp: true,
                hintText: 'Ссылка',
                func: function (actionName) {
                    var actionButtonElement = _getActionButtonElement(actionName);

                    if (_hasClass(actionButtonElement, 'formatter-toolbar__button_click-active')) {
                        _removePopUps();
                        _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                    }
                    else {
                        _removePopUps();
                        _addClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                        var template = self.popUpTemplate.link;
                        var popUp = _showPopUp(template, actionName);
                        var urlElement = popUp.querySelector('input[name="url"]');
                        var textElement = popUp.querySelector('input[name="text"]');
                        var titleElement = popUp.querySelector('input[name="title"]');
                        var targetElement = popUp.querySelector('input[name="target"]');
                        var cursorNode = _getCursorNode();
                        var applyButton = popUp.querySelector('.formatter-popup-buttons__button_apply');
                        var cancelButton = popUp.querySelector('.formatter-popup-buttons__button_cancel');
                        var actionNode, selection;
                        targetElement.checked = true;
                        if (_actionState(actionName)) {
                            actionNode = _findParentActionElement(actionName, cursorNode);
                            urlElement.value = actionNode.getAttribute('href');
                            titleElement.value = actionNode.getAttribute('title');
                            targetElement.checked = !!actionNode.getAttribute('target');
                        }
                        selection = self.iframeDocument.getSelection();
                        if (selection && selection.anchorNode != selection.focusNode) {
                            textElement = null;
                            _removeNode(popUp.querySelector('.formatter-popup__input-line_text'))
                        }
                        else {
                            textElement.value = actionNode ? actionNode.innerText : selection.toString();
                        }
                        applyButton.addEventListener('click', function () {
                            if (urlElement.value) {
                                var element = self.iframeDocument.createElement('a');
                                element.href = urlElement.value;
                                if (targetElement.checked) {
                                    element.setAttribute('target', '_blank');
                                }
                                if (titleElement.value) {
                                    element.setAttribute('title', titleElement.value);
                                }
                                if (textElement) {
                                    element.innerText = textElement.value ? textElement.value : urlElement.value;
                                    if (actionNode) {
                                        _replace(actionNode, element);
                                        _selectNodeContents(element)
                                    }
                                    else {
                                        _replaceSelection(element);
                                    }
                                }
                                else {
                                    _unwrapSelectionByAction(actionName);
                                    _wrapSelection(element);
                                }
                            }
                            else {
                                _unwrapSelectionByAction(actionName);
                            }
                            _removePopUps();
                            _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                            _syncCode();
                        });
                        cancelButton.addEventListener('click', function () {
                            _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                            _removePopUps();
                        });
                    }

                }
            },

            footnote: {
                tag: 'span',
                classes: ['footnote'],
                attributes: ['data-caption'],
                preventRemovePopUp: true,
                hintText: 'Сноска',
                func: function (actionName) {
                    var actionButtonElement = _getActionButtonElement(actionName);

                    if (_hasClass(actionButtonElement, 'formatter-toolbar__button_click-active')) {
                        _removePopUps();
                        _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                    }
                    else {
                        _removePopUps();
                        _addClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                        var template = self.popUpTemplate.footnote;
                        var popUp = _showPopUp(template, actionName);
                        var textElement = popUp.querySelector('input[name="text"]');
                        var descriptionElement = popUp.querySelector('textarea[id="description"]');
                        var cursorNode = _getCursorNode();
                        var applyButton = popUp.querySelector('.formatter-popup-buttons__button_apply');
                        var cancelButton = popUp.querySelector('.formatter-popup-buttons__button_cancel');
                        var actionNode, selection;
                        var actionObject = this;
                        if (_actionState(actionName)) {
                            actionNode = _findParentActionElement(actionName, cursorNode);
                            descriptionElement.value = actionNode.getAttribute('data-caption');
                        }

                        selection = self.iframeDocument.getSelection();
                        if (selection && selection.anchorNode != selection.focusNode) {
                            textElement = null;
                            _removeNode(popUp.querySelector('.formatter-popup__input-line_text'))
                        }
                        else {
                            textElement.value = actionNode ? actionNode.innerText : selection.toString();
                        }

                        applyButton.addEventListener('click', function () {
                            if (descriptionElement.value) {
                                var element = self.iframeDocument.createElement('span');
                                element.className = actionObject.classes.join(' ');
                                element.setAttribute('data-caption', descriptionElement.value);
                                if (textElement) {
                                    element.innerText = textElement.value;
                                    if (actionNode) {
                                        _replace(actionNode, element);
                                        _selectNodeContents(element)
                                    }
                                    else {
                                        _replaceSelection(element);
                                    }
                                }
                                else {
                                    _unwrapSelectionByAction(actionName);
                                    _wrapSelection(element);
                                }
                            }
                            else {
                                _unwrapSelectionByAction(actionName);
                            }
                            _removePopUps();
                            _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                            _syncCode();
                        });

                        cancelButton.addEventListener('click', function () {
                            _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                            _removePopUps();
                        });
                    }
                }
            },

            justifyLeft: {
                style: { textAlign: 'left' },
                hintText: 'Выравнивание по левому краю',
                func: function (actionName) {
                    _setJustify(actionName);
                }

            },

            justifyCenter: {
                style: { textAlign: 'center' },
                hintText: 'Выравнивание по центру',
                func: function (actionName) {
                    _setJustify(actionName)
                }
            },

            justifyRight: {
                style: { textAlign: 'right' },
                hintText: 'Выравнивание по правому краю',
                func: function (actionName) {
                    _setJustify(actionName)
                }
            },

            justifyFull: {
                style: { textAlign: 'justify' },
                hintText: 'Выравнивание по ширине',
                func: function (actionName) {
                    _setJustify(actionName)
                }
            },

            specialChar: {
                preventRemovePopUp: true,
                hintText: 'Специальный символ',
                func: function (actionName, event) {
                    var actionButtonElement = _getActionButtonElement(actionName);
                    if (_hasClass(actionButtonElement, 'formatter-toolbar__button_click-active')) {
                        _removePopUps();
                    }
                    else {
                        _removePopUps();
                        _addClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                        var charWrapper = document.createElement('div');
                        charWrapper.className = 'formatter-special-chars-wrapper';
                        var char, charBlock;

                        for (var i = 0; i < self.options.specialChars.length; i++) {
                            char = self.options.specialChars[i];
                            charBlock = document.createElement('div');
                            charBlock.className = 'formatter-special-char';
                            charBlock.innerHTML = char;
                            charBlock.addEventListener('click', function (event) {
                                var target = event.target;
                                var range = _getCurrentRange();
                                var marker = self.iframeDocument.createElement('span');
                                var charNode;
                                marker.innerHTML = target.innerHTML;
                                charNode = marker.firstChild;
                                range.deleteContents();
                                range.insertNode(charNode);
                                _setSelection(charNode, 1, charNode, 1);
                                _focusFrame();
                                _removePopUps();
                                _syncCode();
                            });
                            charWrapper.appendChild(charBlock);
                        }
                        _showPopUp(charWrapper, actionName)
                    }
                }
            },

            fontColor: {
                preventRemovePopUp: true,
                withVariants: true,
                style: { color: '' },
                selector: 'span[style^="color"]',
                hintText: 'Цвет текста',
                showVariants: function (event) {
                    _setColorStyle('fontColor', 'color', event)

                },
                func: function (actionName, event) {
                    this.showVariants(event)
                }
            },

            backgroundColor: {
                preventRemovePopUp: true,
                withVariants: true,
                style: { backgroundColor: '' },
                selector: 'span[style^="background-color"]',
                hintText: 'Цвет фона',
                showVariants: function (event) {
                    _setColorStyle('backgroundColor', 'backgroundColor', event)
                },
                func: function (actionName, event) {
                    this.showVariants(event)
                }
            },

            insertOrderedList: {
                tag: 'ol',
                allowTags: ['li'],
                variants: {
                    '': 'По умолчанию',
                    'decimal': 'Арабские числа (1, 2, 3, 4,...)',
                    'decimal-leading-zero': 'Арабские числа с нулем впереди (01, 02, 03,...)',
                    'lower-alpha': 'Строчные латинские буквы (a, b, c, d,...)',
                    'lower-greek': 'Строчные греческие буквы (α, β, γ, δ,...)',
                    'lower-roman': 'Римские числа в нижнем регистре (i, ii, iii, iv, v,...)',
                    'upper-alpha': 'Заглавные латинские буквы (A, B, C, D,...)',
                    'upper-roman': 'Римские числа в верхнем регистре (I, II, III, IV, V,...)',
                    'none': 'Без нумерации'
                },
                hintText: 'Нумерованый список',
                showVariants: function (event) {
                    _showVariants(event)
                },
                func: function (actionName, event) {
                    var isToolbarClick = !event;
                    var listStyleType = event ? event.target.getAttribute('data-value') : '';
                    listStyleType = listStyleType ? listStyleType : '';
                    if (_actionState(actionName)) {
                        var actionElement = _findParentActionElement(actionName, _getCursorNode());
                        if (isToolbarClick && actionElement) {
                            _unlistSelected(actionName)
                        }
                        else {
                            _insertList(listStyleType, false);
                        }
                    }
                    else {
                        _insertList(listStyleType, false);
                    }
                }
            },

            insertUnorderedList: {
                tag: 'ul',
                allowTags: ['li'],
                variants: {
                    '': 'По умолчанию',
                    'circle': 'Маркер в виде круга',
                    'disc': 'Маркер в виде жирной точки',
                    'square': 'Маркер в виде квадрата',
                    'none': 'Без маркеров'
                },
                hintText: 'Маркерованый список',
                showVariants: function (event) {
                    _showVariants(event)
                },
                func: function (actionName, event) {
                    var isToolbarClick = !event;
                    var listStyleType = event ? event.target.getAttribute('data-value') : '';
                    listStyleType = listStyleType ? listStyleType : '';
                    if (_actionState(actionName)) {
                        var actionElement = _findParentActionElement(actionName, _getCursorNode());
                        if (isToolbarClick && actionElement) {
                            _unlistSelected(actionName)
                        }
                        else {
                            _insertList(listStyleType, true);
                        }
                    }
                    else {
                        _insertList(listStyleType, true);
                    }
                }
            },

            setStyle: {
                isSelect: true,
                classes: ['wysiwyg-h1', 'wysiwyg-h2', 'wysiwyg-h3'],
                variants: {
                    '': 'Стиль по умолчанию',
                    'wysiwyg-h1': 'Заголовок 1',
                    'wysiwyg-h2': 'Заголовок 2',
                    'wysiwyg-h3': 'Заголовок 3'
                },
                func: function (actionName, event) {
                    var className = event ? event.target.getAttribute('data-value') : '';
                    var elements = _getRangeTopElements();
                    var i;
                    if (elements) {
                        if (!className) {
                            for (i = 0; i < elements.length; i++) {
                                elements[i].className = elements[i].className.replace(new RegExp(this.classes.join('|')), '');
                                if (elements[i].className == '') elements[i].removeAttribute('class');
                            }
                        }
                        else {
                            for (i = 0; i < elements.length; i++) {
                                elements[i].className = elements[i].className.replace(new RegExp(this.classes.join('|')), '');
                                _addClass(elements[i], className);
                            }
                        }
                    }
                    _syncCode();
                }
            },

            resetStyles: {
                hintText: 'Сбросить стили',
                func: function (actionName) {
                    var rootElement = _getRootElement();
                    var element;
                    if (rootElement) {
                        for (var i = 0; i < rootElement.childNodes.length; i++) {
                            element = rootElement.childNodes[i];
                            if (['OL', 'UL'].indexOf(element.tagName) >= 0) {
                                var listItem, listItemChild, textNode, items = element.querySelectorAll('li');
                                for (var j = 0; j < items.length; j++) {
                                    listItem = items[j];
                                    if (listItem && listItem.childNodes) {
                                        for (var k = 0; k < listItem.childNodes.length; k++) {
                                            listItemChild = listItem.childNodes[k];
                                            if (listItemChild && listItemChild.tagName && ['OL', 'UL'].indexOf(listItemChild.tagName) < 0) {
                                                textNode = self.iframeDocument.createTextNode(listItemChild.textContent);
                                                _replace(listItemChild, textNode)
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                element.innerHTML = rootElement.childNodes[i].innerText;
                            }
                            element.removeAttribute('class');
                            element.removeAttribute('style');
                        }
                        _syncCode();
                    }
                }
            },

            showBlocks: {
                hintText: 'Показать блоки',
                func: function (actionName) {
                    var rootElement = _getRootElement();
                    var actionButtonElement = _getActionButtonElement(actionName);
                    if (rootElement.className.indexOf('show-blocks') >= 0) {
                        _removeClass(rootElement, 'show-blocks');
                        _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                    }
                    else {
                        _addClass(rootElement, 'show-blocks');
                        _addClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                    }
                }
            },

            editCode: {
                ignoreCodeView: true,
                hintText: 'Редактирование кода',
                func: function (actionName) {
                    var actionButtonElement = _getActionButtonElement(actionName);
                    if (!self.codeView) {
                        _syncCode();
                        _addClass(self.formatterFrame, 'formatter-hidden');
                        _removeClass(self.formatterCode, 'formatter-hidden');
                        _addClass(self.footerElement, 'formatter-toolbar_inactive');
                        _addClass(self.toolbarElement, 'formatter-toolbar_inactive');
                        _addClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                        if (_hasClass(formatterElement, 'formatter-block_full-screen')) {
                            var toolbar = formatterElement.querySelector('.formatter-toolbar');
                            var footer = formatterElement.querySelector('.formatter-footer');
                            var height = window.innerHeight - toolbar.offsetHeight - footer.offsetHeight;
                            self.formatterCode.style.width = '100%';
                            self.formatterCode.style.height = String(height) + 'px';
                        }
                    }
                    else {
                        _syncDOM();
                        _addClass(self.formatterCode, 'formatter-hidden');
                        _removeClass(self.formatterFrame, 'formatter-hidden');
                        _removeClass(self.footerElement, 'formatter-toolbar_inactive');
                        _removeClass(self.toolbarElement, 'formatter-toolbar_inactive');
                        _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                    }
                    self.codeView = !self.codeView
                }
            },

            fullScreen: {
                ignoreCodeView: true,
                hintText: 'Полный экран',
                func: function (actionName) {
                    var actionButtonElement = _getActionButtonElement(actionName);
                    if (_hasClass(formatterElement, 'formatter-block_full-screen')) {
                        if (_hasClass(formatterWrapper, 'formatter-wrapper-full-screen')) _removeClass(formatterWrapper, 'formatter-wrapper-full-screen');
                        _removeClass(formatterElement, 'formatter-block_full-screen');
                        self.workSpace.style.width = self.options.width ? self.options.width + 'px' : '600px';
                        self.workSpace.style.height = self.options.height ? self.options.height + 'px' : '200px';
                        _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                        _removeClass(actionButtonElement, 'formatter-toolbar__button_exit-full-screen');
                    }
                    else {
                        var toolbar = formatterElement.querySelector('.formatter-toolbar');
                        var footer = formatterElement.querySelector('.formatter-footer');
                        var height = window.innerHeight - toolbar.offsetHeight - footer.offsetHeight;
                        _addClass(formatterElement, 'formatter-block_full-screen');
                        _addClass(formatterWrapper, 'formatter-wrapper-full-screen');
                        self.workSpace.style.width = '100%';
                        self.workSpace.style.height = String(height) + 'px';
                        _addClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                        _addClass(actionButtonElement, 'formatter-toolbar__button_exit-full-screen');
                    }
                }
            }
        };

        this.popUpTemplate = {
            link:
                '<div class="formatter-link-popup">' +
                '<div class="formatter-popup__input-line">' +
                '<label for="url" class="formatter-popup__label">URL</label>' +
                '<input name="url" type="text" class="formatter-popup__input">' +
                '</div>' +
                '<div class="formatter-popup__input-line formatter-popup__input-line_text">' +
                '<label for="text" class="formatter-popup__label">Текст</label>' +
                '<input name="text" type="text" class="formatter-popup__input">' +
                '</div>' +
                '<div class="formatter-popup__input-line">' +
                '<label for="title" class="formatter-popup__label">Title</label>' +
                '<input name="title" type="text" class="formatter-popup__input">' +
                '</div>' +
                '<div class="formatter-popup__input-line">' +
                '<label for="target" class="formatter-popup__label">В новом окне</label>' +
                '<input name="target" id="target" type="checkbox">' +
                '</div>' +
                '</div>' +
                '<div class="formatter-popup-buttons">' +
                '<div class="formatter-popup-buttons__button formatter-popup-buttons__button_apply">Применить</div>' +
                '<div class="formatter-popup-buttons__button formatter-popup-buttons__button_cancel">Отмена</div>' +
                '</div>',

            footnote:
                '<div class="formatter-link-popup">' +
                '<div class="formatter-popup__input-line formatter-popup__input-line_text">' +
                '<label for="text" class="formatter-popup__label">Текст</label>' +
                '<input name="text" type="text" class="formatter-popup__input">' +
                '</div>' +
                '<div class="formatter-popup__input-line">' +
                '<label for="description" class="formatter-popup__label">Сноска</label>' +
                '<textarea id="description" class="formatter-popup__textarea" rows="4"></textarea>' +
                '</div>' +
                '</div>' +
                '<div class="formatter-popup-buttons">' +
                '<div class="formatter-popup-buttons__button formatter-popup-buttons__button_apply">Применить</div>' +
                '<div class="formatter-popup-buttons__button formatter-popup-buttons__button_cancel">Отмена</div>' +
                '</div>'
        };

        if (options && _isObject(options)) {
            _extend(this.options, options)
        }
        var formatterWrapper = document.createElement('div');
        formatterWrapper.className = 'formatter-wrapper';
        var formatterElement = document.createElement('div');
        formatterElement.className = 'formatter-block';
        formatterElement.id = 'formatter-block__' + element.id;
        formatterElement.style.width = self.options.width ? self.options.width + 'px' : '600px';
        formatterWrapper.appendChild(formatterElement);

        //var value;
        var tempElement = document.createElement('span');
        _insertBefore(element, tempElement);

        //if(element.value) value = element.value;

        _addToolbar();
        _addWorkSpace();
        _addFrame();
        _addCode();
        _addPreloader();
        _addFooter();
        _replace(tempElement, formatterWrapper);

        //if(value){
        //    self.formatterCode.value = value;
        //    _syncDOM();
        //    value = null;
        //}

        // Build


        function _addToolbar() {
            // Создает и добавляет toolbar
            var toolbarButtons = self.options.toolbar;
            if (toolbarButtons.length > 0) {
                self.toolbarElement = document.createElement('div');
                self.toolbarElement.className = 'formatter-toolbar';

                var buttons, toolbarLineElement, buttonsList;

                for (var l = 0; l < toolbarButtons.length; l++) {
                    buttons = toolbarButtons[l];
                    toolbarLineElement = document.createElement('div');
                    toolbarLineElement.className = 'formatter-toolbar__line';
                    buttonsList = _generateToolbarButtonsList(buttons);
                    buttonsList.map(function (el) { toolbarLineElement.appendChild(el) });
                    self.toolbarElement.appendChild(toolbarLineElement);
                }
                formatterElement.appendChild(self.toolbarElement);
                window.addEventListener('click', function (event) {
                    if (!event.target.closest('.formatter-popup')) {
                        _removePopUps();
                    }

                });
            }
        }

        function _updateToolbar() {
            var toolbarButtons = self.options.toolbar;
            if (toolbarButtons.length > 0) {
                var actionName, line, button, actionValue, actionObject;
                for (var l = 0; l < toolbarButtons.length; l++) {
                    line = toolbarButtons[l];
                    for (var i = 0; i < line.length; i++) {
                        actionName = line[i];
                        if (self.options.excludeToolbarButtons.indexOf(actionName) >= 0) {
                            continue;
                        }
                        if (actionName && actionName != '|') {
                            let sheet = document.styleSheets[0];
                            var actionNode = _findParentActionElement(actionName, _getCursorNode());
                            button = self.toolbarElement.querySelector('.formatter-toolbar__button_' + _camelCaseToDash(actionName));
                            if (_actionState(actionName)) {
                                if (_hasClass(button, 'formatter-toolbar__select')) {
                                    actionObject = _getActionObject(actionName);
                                    actionValue = _getActionValue(actionName);
                                    actionValue = actionValue ? actionValue : '';
                                    button.querySelector('.formatter-toolbar__select-text').innerText = actionObject.variants[actionValue];
                                }
                                else {
                                    _addClass(button, 'formatter-toolbar__button_active');
                                    if (button.nextSibling) _addClass(button.nextSibling, 'formatter-toolbar__button_active');
                                    if (actionName == 'fontColor') {
                                        if (sheet.insertRule) {
                                            sheet.insertRule('.formatter-toolbar__button_' + _camelCaseToDash(actionName) + ':after { background-color: ' + actionNode.style.color + ' !important; }', sheet.cssRules.length);
                                        } else {
                                            sheet.addRule('.formatter-toolbar__button_' + _camelCaseToDash(actionName) + ':after', 'background-color: ' + actionNode.style.color + ' !important;');
                                        }
                                    }
                                    if (actionName == 'backgroundColor') {
                                        if (sheet.insertRule) {
                                            sheet.insertRule('.formatter-toolbar__button_' + _camelCaseToDash(actionName) + ':after { background-color: ' + actionNode.style['backgroundColor'] + ' !important; }', sheet.cssRules.length);
                                        } else {
                                            sheet.addRule('.formatter-toolbar__button_' + _camelCaseToDash(actionName) + ':after', 'background-color: ' + actionNode.style['backgroundColor'] + ' !important;');
                                        }
                                    }
                                }
                            }
                            else {
                                if (_hasClass(button, 'formatter-toolbar__select')) {
                                    actionObject = _getActionObject(actionName);
                                    button.querySelector('.formatter-toolbar__select-text').innerText = actionObject.variants[''];
                                }
                                else {
                                    _removeClass(button, 'formatter-toolbar__button_active');
                                    if (button.nextSibling) _removeClass(button.nextSibling, 'formatter-toolbar__button_active');
                                    if (actionName == 'fontColor') {
                                        if (sheet.insertRule) {
                                            sheet.insertRule('.formatter-toolbar__button_' + _camelCaseToDash(actionName) + ':after { background-color: #000000 !important; }', sheet.cssRules.length);
                                        } else {
                                            sheet.addRule('.formatter-toolbar__button_' + _camelCaseToDash(actionName) + ':after', 'background-color: #000000 !important;');
                                        }
                                    }
                                    if (actionName == 'backgroundColor') {
                                        if (sheet.insertRule) {
                                            sheet.insertRule('.formatter-toolbar__button_' + _camelCaseToDash(actionName) + ':after { background-color: #ffffff !important; }', sheet.cssRules.length);
                                        } else {
                                            sheet.addRule('.formatter-toolbar__button_' + _camelCaseToDash(actionName) + ':after', 'background-color: #ffffff !important;');
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }


        function _addWorkSpace() {
            self.workSpace = document.createElement('div');
            self.workSpace.className = 'formatter-workspace';
            self.workSpace.style.width = self.options.width ? self.options.width + 'px' : '600px';
            self.workSpace.style.height = self.options.height ? self.options.height + 'px' : '200px';
            formatterElement.appendChild(self.workSpace);
        }


        function _addFrame() {
            // Создает и добавляет iFrame
            self.formatterFrame = document.createElement('iframe');
            self.formatterFrame.className = 'formatter-content';
            self.formatterFrame.style.display = 'block';
            self.formatterFrame.addEventListener('load', function () {
                _setIFrameDocument();
                self.iframeDocument.designMode = 'on';
                var iframeHead = self.iframeDocument.getElementsByTagName('head')[0];
                var iframeStyle = self.iframeDocument.createElement('link');
                iframeStyle.rel = 'stylesheet';
                iframeStyle.type = 'text/css';
                iframeStyle.href = self.options.formatterFrameCssPath;
                iframeHead.appendChild(iframeStyle);
                self.iframeDocument.addEventListener('click', _onclick);
                self.iframeDocument.addEventListener('paste', _onpaste);
                self.iframeDocument.addEventListener('keyup', _onkeyup);
                self.iframeDocument.addEventListener('keydown', _onkeydown);
                self.iframeDocument.addEventListener('keypress', _onkeypress);
                if (self.formatterCode && !self.formatterCode.value) {
                    var rootElement = _getRootElement();
                    rootElement.appendChild(_getNewLineElement());
                    _syncCode();
                }
                else {
                    _syncDOM();
                }
            });
            self.workSpace.appendChild(self.formatterFrame);
        }


        function _addFooter() {
            self.footerElement = document.createElement('div');
            self.footerElement.className = 'formatter-footer';
            var cursorPathElement = document.createElement('div');
            cursorPathElement.className = 'formatter-footer__cursor-path';
            var footerToolbarElement = document.createElement('div');
            footerToolbarElement.className = 'formatter-footer__toolbar';
            var toolbarButtons = _generateToolbarButtonsList(self.options.footerToolbar);
            toolbarButtons.map(function (el) { footerToolbarElement.appendChild(el) });

            self.footerElement.appendChild(cursorPathElement);
            self.footerElement.appendChild(footerToolbarElement);
            formatterElement.appendChild(self.footerElement);
        }


        function _addCode() {
            // Создает и добавляет textarea для кода
            self.formatterCode = element; // document.createElement('textarea');
            self.formatterCode.className = 'formatter-code formatter-hidden';
            self.workSpace.appendChild(self.formatterCode);
        }


        function _addPreloader() {
            self.preloaderWrapper = document.createElement('div');
            self.preloaderWrapper.className = 'formatter-preloader-wrapper formatter-hidden';

            var preloaderElement = document.createElement('img');
            preloaderElement.className = 'formatter-preloader';
            preloaderElement.src = self.options.imagesPath + 'loading-bubbles.svg';
            self.preloaderWrapper.appendChild(preloaderElement);
            self.workSpace.appendChild(self.preloaderWrapper);
        }


        function _setIFrameDocument() {
            // Устанавливает document для iFrame в this
            self.iframeDocument = self.formatterFrame.contentWindow.document;
        }


        function _generateToolbarButtonsList(buttons) {
            // Генерит массив элементов кнопок для тулбара
            var separatorElement = document.createElement('div');
            separatorElement.className = 'formatter-toolbar__separator';

            var buttonWrapper, element, buttonVariants, buttonName, actionObject, textElement, arrowElement;
            var buttonsList = [];
            for (var i = 0; i < buttons.length; i++) {
                buttonName = buttons[i];
                if (self.options.excludeToolbarButtons.indexOf(buttonName) >= 0) {
                    continue;
                }
                actionObject = self.actions.hasOwnProperty(buttonName) ? self.actions[buttonName] : {};
                if (buttonName && buttonName != '|') {
                    buttonWrapper = document.createElement('div');
                    buttonWrapper.className = 'formatter-toolbar__button-wrapper';
                    buttonWrapper.addEventListener('mouseenter', function (event) {
                        _showHint(event)
                    });
                    buttonWrapper.addEventListener('mouseleave', function () {
                        _removeHint()
                    });
                    element = document.createElement('div');
                    if (actionObject.isSelect) {
                        element.className = 'formatter-toolbar__select formatter-toolbar__button_' + _camelCaseToDash(buttonName);

                        element.addEventListener('click', _showVariants);
                        textElement = document.createElement('div');
                        textElement.className = 'formatter-toolbar__select-text';
                        textElement.innerText = actionObject.variants[''];
                        textElement.setAttribute('data-action', buttonName);
                        arrowElement = document.createElement('div');
                        arrowElement.className = 'formatter-toolbar__select-arrow';
                        arrowElement.setAttribute('data-action', buttonName);
                        element.appendChild(textElement);
                        element.appendChild(arrowElement);
                        buttonWrapper.appendChild(element);
                    }
                    else {
                        element.className = 'formatter-toolbar__button formatter-toolbar__button_' + _camelCaseToDash(buttonName);
                        element.setAttribute('data-action', buttonName);
                        element.addEventListener('click', _actionButton);
                        buttonWrapper.appendChild(element);
                        if (actionObject.showVariants) {
                            buttonVariants = document.createElement('div');
                            buttonVariants.className = 'formatter-toolbar__button-variants';
                            buttonVariants.setAttribute('data-action', buttonName);
                            buttonVariants.addEventListener('click', actionObject.showVariants);
                            buttonWrapper.appendChild(buttonVariants);
                        }
                    }

                    if (actionObject.ignoreCodeView) {
                        element.className = element.className + ' formatter-toolbar__button_ignore-code-view';
                    }
                    buttonsList.push(buttonWrapper);
                }
                else if (buttonName == '|') {
                    buttonsList.push(separatorElement.cloneNode(false));
                }
            }

            return buttonsList

        }


        function _showPopUp(template, actionName) {
            // Создает попап из шаблона и показывает его
            _removeHint();
            var buttonElement = _getActionButtonElement(actionName);
            var actionObject = _getActionObject(actionName);
            var popUp = _createPopUp(template);
            popUp.className = popUp.className + ' formatter-popup_' + _camelCaseToDash(actionName);
            formatterElement.appendChild(popUp);
            _setPopUpPosition(buttonElement, popUp);
            if (actionObject.isSelect) {
                popUp.style.width = String(buttonElement.offsetWidth) + 'px';
            }
            return popUp
        }


        function _setPopUpPosition(button, popUp) {
            var formatterWidth = formatterElement.offsetWidth;
            var buttonLeftEdge = button.offsetLeft;
            var buttonRightEdge = (button.offsetLeft + button.offsetWidth);
            var popUpWidth = popUp.offsetWidth;
            if (buttonLeftEdge + popUpWidth > formatterWidth) {
                popUp.style.left = String(buttonRightEdge - popUpWidth) + 'px';
            }
            else {
                popUp.style.left = String(buttonLeftEdge) + 'px';
            }
            popUp.style.top = String(button.offsetTop + button.offsetHeight - 1) + 'px';
        }


        function _removePopUps() {
            // Удаляет все PopUp
            var popUps = formatterElement.querySelectorAll('.formatter-popup');
            if (popUps) {
                for (var i = 0; i < popUps.length; i++) {
                    _removeNode(popUps[i]);
                }
            }
            _resetActiveButtons();
        }


        function _resetActiveButtons() {
            var buttons = self.toolbarElement.querySelectorAll('.formatter-toolbar__button_click-active');
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    _removeClass(buttons[i], 'formatter-toolbar__button_click-active');
                }
            }

        }


        function _showVariants(event) {
            if (self.codeView) return;
            event.stopPropagation();
            _removeHint();
            if (_hasClass(event.target, 'formatter-toolbar__button_click-active')) {
                _removePopUps();
            }
            else {
                _removePopUps();
                var actionValue;
                var action = event.target.getAttribute('data-action');
                var actionButtonElement = _getActionButtonElement(action);
                var actionObject = _getActionObject(action);
                if (actionObject && actionObject.variants) {
                    actionValue = _getActionValue(action);
                    actionValue = actionValue ? actionValue : '';
                    _addClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                    if (actionButtonElement.nextSibling) _addClass(actionButtonElement.nextSibling, 'formatter-toolbar__button_click-active');
                    else _addClass(event.target, 'formatter-toolbar__button_click-active');

                    var block = document.createElement('div');
                    block.className = 'formatter-variants';
                    var variantElement, variant;
                    for (var key in actionObject.variants) {
                        variantElement = document.createElement('div');
                        variantElement.className = 'formatter-variants__item';
                        variantElement.innerHTML = actionObject.variants[key];
                        variantElement.setAttribute('data-value', key);
                        variantElement.addEventListener('click', function (event) {
                            actionObject.func(action, event);
                            _focusFrame();
                            _updateCursorPosition();
                            _removePopUps();
                            _syncCode();
                        });
                        if (actionValue == key) {
                            variantElement.className = variantElement.className + ' formatter-variants__item_active'
                        }
                        block.appendChild(variantElement);
                    }
                    _showPopUp(block, action);
                }
            }
        }


        function _createPopUp(template) {
            // Создает элемент PopUp по шаблону
            var popUpElement = document.createElement('div');
            popUpElement.className = 'formatter-popup';

            if (typeof template === 'string') {
                popUpElement.innerHTML = template;
            }
            else {
                popUpElement.appendChild(template);
            }

            return popUpElement
        }


        function _showHint(event) {
            // Показывает подсказку
            var buttonWrapperElement = event.target;
            var buttonElement = event.target.querySelector('.formatter-toolbar__button');
            if (buttonElement && !_hasClass(buttonElement, 'formatter-toolbar__button_click-active')) {
                var actionName = buttonElement.getAttribute('data-action');
                if (actionName) {
                    var actionObject = _getActionObject(actionName);
                    var hintText = actionObject.hasOwnProperty('hintText') ? actionObject['hintText'] : null;
                    if (hintText) {
                        var isFooterButton = self.options.footerToolbar.indexOf(actionName) >= 0;
                        var arrowElement = document.createElement('div');
                        arrowElement.className = 'formatter-hint-arrow';
                        arrowElement.style.top = isFooterButton ? '0px' : '-23px';
                        var hintElement = document.createElement('div');
                        hintElement.className = 'formatter-hint';
                        var hintTextElement = document.createElement('div');
                        hintTextElement.innerText = hintText;

                        hintElement.appendChild(hintTextElement);
                        hintElement.appendChild(arrowElement);
                        formatterElement.appendChild(hintElement);
                        var position = {
                            left: String(buttonWrapperElement.offsetLeft + (buttonWrapperElement.offsetWidth / 2 - hintElement.offsetWidth / 2)) + 'px'
                        };
                        if (isFooterButton) {
                            position['top'] = String(buttonWrapperElement.offsetTop - buttonWrapperElement.offsetHeight - 2) + 'px';
                        }
                        else {
                            position['top'] = String(buttonWrapperElement.offsetTop + buttonWrapperElement.offsetHeight + 9) + 'px';
                        }
                        _extend(hintElement.style, position);
                    }
                }
            }
        }


        function _removeHint() {
            // Скрывает подсказку
            _removeNode(formatterElement.querySelector('.formatter-hint'))
        }


        function _showPreloader() {
            _removeClass(self.preloaderWrapper, 'formatter-hidden')
        }


        function _hidePreloader() {
            _addClass(self.preloaderWrapper, 'formatter-hidden')
        }

        // Actions

        function _actionButton(event) {
            // Вызывается по клику на кнопку в тулбаре
            // Запускает действие над выделением
            event.stopPropagation();
            var action = event.target.getAttribute('data-action');
            var actionObject = _getActionObject(action);
            if (actionObject && !actionObject.preventRemovePopUp) {
                _removePopUps();
            }
            _action(action, event);
        }


        function _action(action, event) {
            // Выполняет действие
            if (action) {
                var actionObject = self.actions[action];
                var ignoreCodeView = actionObject && actionObject.ignoreCodeView;

                if (self.codeView && !ignoreCodeView) return;

                if (_isCustomAction(action)) {
                    actionObject.func(action, event);
                    _syncCode();
                }
                else {
                    _execCommand(action);
                }
                var rootElement = _getRootElement();
                rootElement.normalize();
                _focusFrame();
                _updateCursorPosition();
            }
        }


        function _execCommand(command, value) {
            // Обертка для execCommand
            if (!value) value = null;
            self.iframeDocument.execCommand(command, false, value);
            _syncCode();
        }


        function _shortcut(event, command) {
            // Функция для горячих клавиш
            event.preventDefault();
            _action(command);
        }


        function _isCustomAction(action) {
            // Проверяет есть ли фунция у действия в actions
            return self.actions.hasOwnProperty(action) && self.actions[action].hasOwnProperty('func')
        }


        function _getActionObject(action) {
            return self.actions.hasOwnProperty(action) ? self.actions[action] : null;
        }


        function _actionState(actionName) {
            // Возвращет состояние события для выделения или курсора
            // true - событие применено для выделения
            // false - событие не применено для выделения
            var state = false;
            if (_isCustomAction(actionName)) {
                var node = _getCursorNode();
                state = Boolean(_findParentActionElement(actionName, node));
            }
            else {
                state = self.iframeDocument.queryCommandState(actionName);
            }
            return state
        }


        function _getActionValue(actionName) {
            var value, re;
            var node = _getCursorNode();
            var actionObject = _getActionObject(actionName);
            if (actionObject && actionObject.variants) {
                var actionElement = _findParentActionElement(actionName, node);
                var values = Object.keys(actionObject.variants);
                if (actionElement) {
                    for (var i = 0; i < values.length; i++) {
                        if (values[i]) {
                            re = new RegExp(values[i], 'ig');
                            if (re.test(actionElement.className)) {
                                value = values[i];
                                break;
                            }
                        }
                    }
                }
            }

            return value
        }


        function _getActionButtonElement(actionName) {
            return formatterElement.querySelector('.formatter-toolbar__button_' + _camelCaseToDash(actionName))
        }


        function _getActionSelector(action) {
            var actionObject = _getActionObject(action);
            var selector = '';
            if (actionObject) {

                if (actionObject.selector) {
                    selector = actionObject.selector;
                }
                else if (actionObject.classes) {
                    selector = '.' + actionObject.classes.join(', .')
                }
                else {
                    if (actionObject.tag) {
                        selector = actionObject.tag
                    }
                    if (actionObject.style) {
                        var elm = self.iframeDocument.createElement('span');
                        _extend(elm.style, actionObject.style);
                        var styleString = elm.getAttribute('style');
                        selector = selector + '[style*="' + styleString + '"]';
                    }
                }
            }
            return selector
        }


        function _getAvailableActions() {
            var actions = [];
            var line;
            for (var i = 0; i < self.options.toolbar.length; i++) {
                line = self.options.toolbar[i];
                for (var j = 0; j < line.length; j++) {
                    if (line[j] != '|') {
                        actions.push(line[j])
                    }
                }
            }
            if (self.options.footerToolbar) {
                for (var k = 0; k < line.length; k++) {
                    if (line[k] != '|') {
                        actions.push(line[k])
                    }
                }
            }
            return actions
        }


        function _findParentActionElement(action, node) {
            // Ищет элемент для действия вверх по дереву от положения курсора.
            var element = null;
            var selector = _getActionSelector(action);
            if (selector && node) {
                element = node.closest(selector);
            }
            return element
        }


        function _findChildrenActionElements(action, node) {
            var elements = [];
            var selector = _getActionSelector(action);
            if (selector && node) {
                elements = node.querySelectorAll(selector);
            }
            return elements
        }


        function _getRangeActionElements(action, range) {
            var container = range.commonAncestorContainer.nodeType == 3 ? null : range.commonAncestorContainer;
            var nodes = Array.prototype.slice.call(_findChildrenActionElements(action, container));

            return nodes.filter(function (node) {
                return _rangeIntersectsNode(range, node)
            })
        }


        function _getRangeTopElements() {
            var rangeParams = _getCurrentRangeParams();
            var elements = [];
            if (rangeParams) {
                var startTopElement = _getTopElement(rangeParams.startContainer);
                var endTopElement = _getTopElement(rangeParams.endContainer);
                if (startTopElement == endTopElement) {
                    elements = [startTopElement];
                }
                else {
                    elements = _getNeighborsBetween(startTopElement, endTopElement, true);
                }
            }
            return elements
        }


        function _textDecoration(actionName, element) {
            var actionObject = _getActionObject(actionName);
            var currentRange;
            var rangeParams = _getCurrentRangeParams();
            var isCollapsed = rangeParams.collapsed;
            var cursorWordParams = _getCursorWordParts();

            if (!element && _actionState(actionName)) {
                if (!element) {
                    element = self.iframeDocument.createElement(actionObject.tag);
                    if (actionObject.style) {
                        _extend(element.style, actionObject.style);
                    }
                }
                _unwrapSelectionByAction(actionName, element);
            }
            else {
                if (!element) {
                    element = self.iframeDocument.createElement(actionObject.tag);
                    if (actionObject.style) {
                        _extend(element.style, actionObject.style);
                    }
                }
                _selectCursorWord();
                _wrapSelection(element);
                if (isCollapsed && cursorWordParams.leftPart && cursorWordParams.rightPart) {
                    currentRange = _getCurrentRange();
                    var cursorPosition = cursorWordParams.leftPart && cursorWordParams.leftPart.length > 0 ? cursorWordParams.leftPart[0].length : 0;
                    var textNode = _getFirstTextNode(currentRange.startContainer);
                    _setSelection(textNode, cursorPosition, textNode, cursorPosition);
                }
                else if (isCollapsed) {
                    _setSelection(element, element.textContent.length, element, element.textContent.length);
                }
            }
            _normalizeHTML(_getParentParagraph(_getCursorNode()), true);
            _focusFrame();
        }


        function _setJustify(actionName) {
            var actionObject = _getActionObject(actionName);
            var elements = _getRangeTopElements();
            if (_actionState(actionName)) {
                _removeStylesForElements(elements, actionObject.style)
            }
            else {
                _setStylesForElements(elements, actionObject.style)
            }
        }


        function _setStylesForElements(elements, styleObject) {
            for (var i = 0; i < elements.length; i++) {
                _extend(elements[i].style, styleObject);
            }
        }


        function _removeStylesForElements(elements, styleObject) {
            for (var i = 0; i < elements.length; i++) {
                for (var key in styleObject) {
                    elements[i].style[key] = null;
                }
            }
        }


        function _insertList(listStyleType, isUnordered) {
            // Добавляет список
            var listItem;
            var tagName = isUnordered ? 'UL' : 'OL';
            var selection = self.iframeDocument.getSelection();
            var range = _getCurrentRange();
            if (!range) {
                _focusFrame();
                range = _getCurrentRange()
            }
            var newRange = self.iframeDocument.createRange();
            var rangeParams = _getCurrentRangeParams();
            var startParentElement = _findParentNode(rangeParams.startContainer, 'ol, ul, p');
            var endParentElement = _findParentNode(rangeParams.endContainer, 'ol, ul, p');

            var list = self.iframeDocument.createElement(isUnordered ? 'ul' : 'ol');
            list.style.listStyleType = listStyleType;

            if (range.collapsed || startParentElement === endParentElement) {
                if (startParentElement && startParentElement.tagName && ['OL', 'UL'].indexOf(startParentElement.tagName) >= 0) {
                    if (startParentElement.tagName == tagName) {
                        startParentElement.style.listStyleType = listStyleType;
                    }
                    else {
                        _replaceChildNodes(startParentElement, list);
                        _replace(startParentElement, list);
                        newRange.setStart(rangeParams.startContainer, rangeParams.startOffset);
                        newRange.setEnd(rangeParams.endContainer, rangeParams.endOffset);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    }

                }
                else {
                    listItem = self.iframeDocument.createElement('li');
                    if (_isEmptyNode(startParentElement)) {
                        listItem.innerHTML = '&#8203';
                        newRange.selectNodeContents(listItem);
                        newRange.collapse();
                    }
                    else {
                        _replaceChildNodes(startParentElement, listItem);
                        newRange.setStart(rangeParams.startContainer, rangeParams.startOffset);
                        newRange.setEnd(rangeParams.endContainer, rangeParams.endOffset);
                    }
                    list.appendChild(listItem);
                    _replace(startParentElement, list);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
            else {
                var items = _getNeighborsBetween(startParentElement, endParentElement, true);
                var currentElement;

                for (var j = 0; j < items.length; j++) {
                    currentElement = items[j];

                    if (currentElement.tagName && ['OL', 'UL'].indexOf(currentElement.tagName) >= 0) {
                        _replaceChildNodes(currentElement, list);
                    }
                    else {
                        listItem = self.iframeDocument.createElement('li');
                        _replaceChildNodes(currentElement, listItem);
                        list.appendChild(listItem);
                    }
                    if (currentElement !== startParentElement) {
                        _removeNode(currentElement);
                    }
                }
                _replace(startParentElement, list);

                newRange.setStart(rangeParams.startContainer, rangeParams.startOffset);
                newRange.setEnd(rangeParams.endContainer, rangeParams.endOffset);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
            _joinNeighborsList(list);
        }


        function _joinNeighborsList(list) {
            // Объеденяет соседние списки
            if (list) {
                var prevElement = list.previousSibling;
                var nextElement = list.nextSibling;
                if (prevElement && prevElement.tagName && ['OL', 'UL'].indexOf(prevElement.tagName) >= 0) {
                    while (prevElement.firstChild) {
                        _insertBefore(list.firstChild, prevElement.lastChild);
                    }
                    _removeNode(prevElement);
                }
                if (nextElement && nextElement.tagName && ['OL', 'UL'].indexOf(nextElement.tagName) >= 0) {
                    _replaceChildNodes(nextElement, list);
                    _removeNode(nextElement);
                }
            }
        }


        function _unlistSelected(actionName) {
            // Убирает список у выделения
            var selection = self.iframeDocument.getSelection();
            var range = _getCurrentRange();
            if (!range) return;
            var actionElement = _findParentActionElement(actionName, _getCursorNode());
            var rangeParams = _getCurrentRangeParams();
            var newRange = self.iframeDocument.createRange();
            var startParentElement = _getTopElement(rangeParams.startContainer);
            var endParentElement = _getTopElement(rangeParams.endContainer);
            var fragment = self.iframeDocument.createDocumentFragment();
            var paragraph, listItem, currentElement, element;
            var startListItem = (rangeParams.startContainer.nodeType == 3 ? rangeParams.startContainer.parentNode : rangeParams.startContainer).closest('li');
            var endListItem = (rangeParams.endContainer.nodeType == 3 ? rangeParams.endContainer.parentNode : rangeParams.endContainer).closest('li');

            range.setStartBefore(startListItem);
            range.setEndAfter(endListItem);
            selection.removeAllRanges();
            selection.addRange(range);

            if (startParentElement !== endParentElement) {
                var startElement = _splitNode(range.startContainer, range.startOffset, startParentElement);
                var endElement = _splitNode(range.endContainer, range.endOffset, endParentElement);
                var items = _getNeighborsBetween(startElement, endElement, true);
                for (var j = 0; j < items.length; j++) {
                    currentElement = items[j];
                    if (currentElement.tagName && ['OL', 'UL'].indexOf(currentElement.tagName) >= 0) {
                        for (var k = 0; k < currentElement.childNodes.length; k++) {
                            paragraph = self.iframeDocument.createElement('p');
                            _replaceChildNodes(currentElement.childNodes[k], paragraph);
                            fragment.appendChild(paragraph);
                        }
                    }
                    else {
                        paragraph = self.iframeDocument.createElement('p');
                        _replaceChildNodes(currentElement, paragraph);
                        fragment.appendChild(paragraph);
                    }
                    if (currentElement !== startElement) {
                        _removeNode(currentElement)
                    }
                }
                _replace(startElement, fragment);
                newRange.setStart(rangeParams.startContainer, rangeParams.startOffset);
                newRange.setEnd(rangeParams.endContainer, rangeParams.endOffset);
            }
            else {
                if (_isEmptyNode(startParentElement)) {
                    paragraph = _getNewLineElement();
                    _replace(startParentElement, paragraph);
                    newRange.selectNodeContents(paragraph);
                    newRange.collapse();
                }
                else {
                    if (!startListItem.previousSibling && !endListItem.nextSibling) {
                        element = startParentElement;
                    }
                    else {
                        element = _cutSelection(actionElement);
                    }

                    for (var i = 0; i < element.childNodes.length; i++) {
                        listItem = element.childNodes[i];
                        paragraph = self.iframeDocument.createElement('p');
                        while (listItem.firstChild) {
                            paragraph.appendChild(listItem.firstChild)
                        }
                        fragment.appendChild(paragraph);
                    }

                    _removeEmptyChildNodes(fragment);
                    _removeEmptyChildNodes(element.previousSibling);
                    _removeEmptyChildNodes(element.nextSibling);

                    if (element.previousSibling && element.previousSibling.tagName == element.tagName && _isEmptyNode(element.previousSibling)) _removeNode(element.previousSibling);
                    if (element.nextSibling && element.nextSibling.tagName == element.tagName && _isEmptyNode(element.nextSibling)) _removeNode(element.nextSibling);

                    if (rangeParams.collapsed && _isEmptyNode(rangeParams.startContainer)) {
                        rangeParams.startContainer = fragment.firstChild;
                        rangeParams.startOffset = fragment.firstChild.textContent.length;
                        rangeParams.endContainer = fragment.firstChild;
                        rangeParams.endOffset = fragment.firstChild.textContent.length;
                    }
                    _replace(element, fragment);
                    newRange.setStart(rangeParams.startContainer, rangeParams.startOffset);
                    newRange.setEnd(rangeParams.endContainer, rangeParams.endOffset);

                }
            }
            selection.removeAllRanges();
            selection.addRange(newRange);
        }


        function _indentListItem(listItemNode) {
            // Сдвигает пункт списка на уровень ниже
            var parentList = listItemNode.parentNode;
            var prevListItem = listItemNode.previousSibling;
            if (parentList && prevListItem) {
                var list = self.iframeDocument.createElement(parentList.tagName.toLowerCase());
                if (!_isEmptyNode(listItemNode)) {
                    list.appendChild(listItemNode);
                }
                else {
                    listItemNode.innerHTML = '&#8203';
                    list.appendChild(listItemNode);
                }
                prevListItem.appendChild(list);
                _joinNeighborsList(list);
            }
        }


        function _removeIndentListItem(listItemNode) {
            // Сдвигает пункт списка на уровень выше
            var listNode = listItemNode.parentNode;
            var parentListItem = listNode.closest('li');
            if (parentListItem) {
                _insertAfter(parentListItem, listItemNode)
            }
            else {
                _selectNode(listItemNode);
                var cutElement = _cutSelection(listNode);
                var paragraph;
                for (var i = 0; i < cutElement.childNodes.length; i++) {
                    paragraph = self.iframeDocument.createElement('p');
                    _replaceChildNodes(cutElement.childNodes[i], paragraph);
                    _insertBefore(cutElement, paragraph);
                }
                _removeNode(cutElement);
            }
        }


        function _setColorStyle(actionName, styleName, event) {
            var actionButtonElement = _getActionButtonElement(actionName);

            function __createColorPopUp() {
                var item, itemBlock, itemColorBlock;
                var popUpWrapper = document.createElement('div');
                var colorBlock = document.createElement('div');
                colorBlock.className = 'formatter-color-picker';
                var inputBlock = document.createElement('div');
                inputBlock.className = 'formatter-color-popup-input';
                inputBlock.innerHTML = '' +
                    '<div class="formatter-popup__input-line">' +
                    '<label for="color" class="formatter-popup__label">Hex Color #</label>' +
                    '<input id="color" name="color" type="text" class="formatter-popup__input">' +
                    '</div>';
                var buttons = document.createElement('div');
                buttons.innerHTML = '' +
                    '<div class="formatter-popup-buttons">' +
                    '<div class="formatter-popup-buttons__button formatter-popup-buttons__button_apply">Применить</div>' +
                    '<div class="formatter-popup-buttons__button formatter-popup-buttons__button_cancel">Отмена</div>' +
                    '</div>';
                var dividerBlock = document.createElement('div');
                dividerBlock.className = 'formatter-popup-bottom-line';

                var clearColorBlock = document.createElement('div');
                clearColorBlock.className = 'formatter-color-picker__item formatter-color-picker__item_clear';
                clearColorBlock.addEventListener('click', function (event) {
                    var inputElement = popUpWrapper.querySelector('input[name="color"]');
                    inputElement.value = '';
                    __applyColor();
                });
                colorBlock.appendChild(clearColorBlock);

                for (var i = 0; i < self.options.colors.length; i++) {
                    item = self.options.colors[i];
                    itemBlock = document.createElement('div');
                    itemBlock.className = 'formatter-color-picker__item';
                    itemBlock.setAttribute('data-value', item);
                    itemColorBlock = document.createElement('div');
                    itemColorBlock.className = 'formatter-color-picker__item-color';
                    itemColorBlock.setAttribute('data-value', item);
                    _extend(itemColorBlock.style, { 'background-color': item });
                    itemBlock.appendChild(itemColorBlock);
                    itemBlock.addEventListener('click', function (event) {
                        var inputElement = popUpWrapper.querySelector('input[name="color"]');
                        inputElement.value = event.target.getAttribute('data-value').substring(1);
                        __applyColor();
                    });
                    itemBlock.setAttribute('title', item);
                    colorBlock.appendChild(itemBlock);

                }
                popUpWrapper.appendChild(inputBlock);
                popUpWrapper.appendChild(dividerBlock);
                popUpWrapper.appendChild(colorBlock);
                popUpWrapper.appendChild(buttons);
                var popUp = _showPopUp(popUpWrapper, actionName);
                if (_actionState(actionName)) {
                    var cursorNode = _getCursorNode();
                    var actionNode = _findParentActionElement(actionName, cursorNode);
                    var colorInputElement = popUp.querySelector('input[name="color"]');
                    colorInputElement.value = _rgbToHex(actionNode.style[styleName]);
                }
                return popUp
            }

            function __applyColor() {
                var colorInputElement = formatterElement.querySelector('.formatter-color-popup-input input[name="color"]');
                var range = _getCurrentRange();
                if (!range) _focusFrame();
                if (colorInputElement.value) {
                    var styleObject = {};
                    styleObject[styleName] = colorInputElement.value;
                    _unwrapSelectionByAction(actionName);
                    var wrapperElement = self.iframeDocument.createElement('span');
                    _extend(wrapperElement.style, styleObject);
                    _textDecoration(actionName, wrapperElement);
                }
                else {
                    _unwrapSelectionByAction(actionName);
                    _normalizeHTML(_getParentParagraph(_getCursorNode()), true);
                    _focusFrame();
                }
                _updateToolbar();
                _removePopUps();
                _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                _syncCode();
            }

            if (self.codeView) return;
            event.stopPropagation();
            if (_hasClass(event.target, 'formatter-toolbar__button_click-active')) {
                _removePopUps();
            }
            else {
                _removePopUps();
                _addClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                if (actionButtonElement.nextSibling) _addClass(actionButtonElement.nextSibling, 'formatter-toolbar__button_click-active');
                else _addClass(event.target, 'formatter-toolbar__button_click-active');

                var popUp = __createColorPopUp();

                var applyButton = popUp.querySelector('.formatter-popup-buttons__button_apply');
                var cancelButton = popUp.querySelector('.formatter-popup-buttons__button_cancel');
                applyButton.addEventListener('click', function () {
                    __applyColor();
                });
                cancelButton.addEventListener('click', function () {
                    _removeClass(actionButtonElement, 'formatter-toolbar__button_click-active');
                    _removePopUps();
                });

            }
        }


        // Clean html

        function _cleanHtml(html) {
            // Точка входа чистильщика. Вызывает методы чистки и возвращает чистый html
            html = _cleanTags(html);
            html = _cleanAttributes(html);
            html = _cleanStyle(html);
            html = _cleanClass(html);
            html = _removeBlockWithoutStyles(html);
            html = _wrapToParagraph(html);
            return html
        }


        function _cleanTags(html) {
            // Удаляет лишние и пустые теги.
            var availableTags = [];
            var tag, allowTags, action;
            var availableActions = _getAvailableActions();
            for (var a = 0; a < availableActions.length; a++) {
                action = availableActions[a];
                if (self.actions.hasOwnProperty(action)) {
                    if (self.actions[action].hasOwnProperty('tag')) {
                        tag = self.actions[action]['tag'];
                        if (tag && availableTags.indexOf(tag) < 0) {
                            availableTags.push(tag);
                        }
                    }
                    if (self.actions[action].hasOwnProperty('allowTags')) {
                        allowTags = self.actions[action]['allowTags'];
                        if (allowTags && allowTags.length > 0) {
                            for (var i = 0; i < allowTags.length; i++) {
                                if (allowTags[i] && availableTags.indexOf(allowTags[i]) < 0) {
                                    availableTags.push(allowTags[i]);
                                }
                            }
                        }
                    }
                }
            }

            var availableTagsString = availableTags.join('|');
            var notavailableTagsRE = new RegExp('(?:<(?!\/?(p|br|' + availableTagsString + ')(?:\\s|\/*>)))(?:.+?)>', 'ig');

            var styleTag = new RegExp('<style[^>]*>(?:(?!<\/style>)[^])*<\/style>', 'ig');
            var scriptTag = new RegExp('<script[^>]*>(?:(?!<\/script>)[^])*<\/script>', 'igm');

            var conditionalCommentRE = new RegExp('<!-*\\[.*?\\]>*?[^!]*!-*\\[.*?\\]-*>', 'igm');
            var htmlCommentRE = new RegExp('<!--[^-\2]*?-->', 'igm');

            html = html.replace(new RegExp('\n', 'ig'), ' ');
            html = html.replace(new RegExp('<br>', 'ig'), ' ');

            html = html.replace(htmlCommentRE, '');

            html = html.replace(scriptTag, '');
            html = html.replace(styleTag, '');

            html = html.replace(conditionalCommentRE, '');

            html = html.replace(notavailableTagsRE, '');

            return _removeEmptyTags(html)
        }


        function _removeEmptyTags(html) {
            // Удаляет пустые и не закрытые теги
            var fragment = self.iframeDocument.createElement('div');
            fragment.innerHTML = html;
            _removeEmptyChildNodes(fragment);
            html = fragment.innerHTML;
            return html
        }


        function _removeEmptyChildNodes(node) {
            // Удаляет пустые элементы
            if (node) {
                var i, j, currentNode, childNodes = _getChildNodes(node);
                var ignoreNodes = ['br'];
                var emptyNodes = [];
                if (childNodes) {
                    for (i = 0; i < childNodes.length; i++) {
                        currentNode = childNodes[i];
                        if (((currentNode.nodeType != 3 && currentNode.tagName && ignoreNodes.indexOf(currentNode.tagName.toLowerCase()) < 0) || currentNode.nodeType == 3) && _isEmptyNode(currentNode)) {
                            emptyNodes.push(currentNode);
                        }
                        else if (currentNode.childNodes.length > 0) {
                            _removeEmptyChildNodes(currentNode)
                        }
                    }
                    for (j = 0; j < emptyNodes.length; j++) {
                        _removeNode(emptyNodes[j])
                    }
                }
            }
        }


        function _removeBlockWithoutStyles(html) {
            var emptyNodes = [];

            function __collectNodes(node) {
                var i, currentNode, childNodes = _getChildNodes(node);

                for (i = 0; i < childNodes.length; i++) {
                    currentNode = childNodes[i];
                    if (currentNode && currentNode.tagName && currentNode.tagName == 'SPAN' && !currentNode.getAttribute('style') && !currentNode.getAttribute('class')) {
                        emptyNodes.push(currentNode);
                    }
                    if (currentNode.childNodes.length > 0) {
                        emptyNodes.concat(__collectNodes(currentNode));
                    }
                }
            }
            var fragment = self.iframeDocument.createElement('div');
            fragment.innerHTML = html;
            if (fragment) {
                __collectNodes(fragment);
                for (var j = 0; j < emptyNodes.length; j++) {
                    if (emptyNodes[j] && emptyNodes[j].childNodes) {
                        while (emptyNodes[j].firstChild) {
                            _insertBefore(emptyNodes[j], emptyNodes[j].firstChild);
                        }
                        _removeNode(emptyNodes[j]);
                    }
                    else _removeNode(emptyNodes[j]);
                }
            }
            html = fragment.innerHTML;
            return html
        }


        function _cleanAttributes(html) {
            // Удаляет лишние атрибуты
            var attributes, action;
            var availableAttributes = [];
            var availableActions = _getAvailableActions();
            for (var a = 0; a < availableActions.length; a++) {
                action = availableActions[a];
                if (self.actions.hasOwnProperty(action) && self.actions[action].hasOwnProperty('attributes')) {
                    attributes = self.actions[action]['attributes'];
                    for (var i = 0; i < attributes.length; i++) {
                        if (availableAttributes.indexOf(attributes[i]) < 0) availableAttributes.push(attributes[i])
                    }
                }
            }
            var attributesRe = new RegExp('\\s+(?!style|class|' + availableAttributes.join('|') + ')(?:\\b[-a-z]+\\b=(?:"|\').*?(?:"|\'))', 'ig');
            //html = html.replace(/\s*(?!style|class|href|title|target)(?:\b[-a-z]+\b=(?:"|').*?(?:"|'))/ig, '');
            html = html.replace(attributesRe, '');
            html = html.replace(/\s*[a-z]+=(?:"|')(?:"|')/ig, '');
            return html
        }


        function _cleanStyle(html) {
            // Удаляет лишние стили
            var styleObject,
                action,
                availableStyles = [],
                availableActions = _getAvailableActions();

            for (var a = 0; a < availableActions.length; a++) {
                action = availableActions[a];
                if (self.actions.hasOwnProperty(action) && self.actions[action].hasOwnProperty('style')) {
                    styleObject = self.actions[action]['style'];
                    for (var styleName in styleObject) {
                        var styleValue = styleObject[styleName];
                        style = _camelCaseToDash(styleName) + ':\s*' + styleValue;
                        if (availableStyles.indexOf(style) < 0) availableStyles.push(style)
                    }
                }
            }
            var availableStylesString = availableStyles.join('|');

            var styleRe1 = new RegExp(';*\\s*(?!(' + availableStylesString + '))(?:[a-z\\-]+?):\\s*[^;]+', 'ig');
            var styleRe2 = new RegExp('"(?!(' + availableStylesString + '))(?:[a-z\\-]+?):\\s*[^;]+;', 'ig');
            var styleRe3 = new RegExp("'(?!(" + availableStylesString + "))(?:[a-z\\-]+?):\\s*[^;]+;", 'ig');
            // проверка на приходящие свойства, должны быть в формате ключ-значение, учитывая что в значении могут быть "", которые могут закрыть атрибут style
            var styleRe4 = new RegExp("[\\w-]*:\\s*(([\\w\\d\\s-#!,()]*)|((['\\\"])(.*?)\4))[,\\s*\\w+\\-]*;", 'ig');
            var colorRe = new RegExp("((((background-)?color)|(background)):\s*)(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\));", 'ig');


            var defaultIframeTextColor;
            if (document.getElementsByTagName('iframe').length === 1) {
                defaultIframeTextColor = getComputedStyle(document.getElementsByTagName('iframe')[0].contentWindow.document.body).color;
            }
            else {
                for (let i = 0; i < document.getElementsByTagName('iframe').length; i++) {
                    var className = document.getElementsByTagName('iframe')[i].className;
                    if (className.indexOf('formatter-content') !== -1)
                        defaultIframeTextColor = getComputedStyle(document.getElementsByTagName('iframe')[i].contentWindow.document.body).color;
                }
            }

            // // экранирование скобок для подстановки в регулярное выражение
            defaultIframeTextColor = defaultIframeTextColor.replace(/\(/ig, '\\(');
            defaultIframeTextColor = defaultIframeTextColor.replace(/\)/ig, '\\)');

            var defaultTextColorRe = new RegExp("color:\\s*" + defaultIframeTextColor + ";", 'ig');

            html = html.replace(/\s*style="[a-zA-Zа-яА-Я0-9\-,._':;&\(\)\s\!#]*"/ig, function (str) {
                str = str.replace(/&[a-z0-9#]*;/ig, ''); //убирает символы юникода, например &quot; кавычки в правиле font-family
                str = str.replace('&quot;', '');
                str = str.replace(styleRe4, '$&');
                str = str.replace(new RegExp('\n', 'ig'), ' ');

                // удалет недопустимые стили формата "style: propertie;"
                str = str.replace(/(?:[a-z-]+?):\s*([^;|"]*?)*;{0,1}/ig, function (str) {
                    var re = new RegExp('^(\s*' + availableStylesString + ')', 'ig');

                    if (str.search(re) == -1) {
                        var re2 = new RegExp('\s*' + str + ';*', 'ig')
                        str = str.replace(re2, '');
                    }
                    else {
                        str = str;
                    }
                    return str
                })

                str = str.replace(styleRe2, '"');
                str = str.replace(styleRe3, "'");
                str = str.replace(colorRe, '');  // проверяет валидность формата цвета hex или rgb(a)
                str = str.replace(defaultTextColorRe, '');
                str = str.replace(/="\s/ig, '="');
                str = str.replace(/='\s/ig, '=');

                if (str && str.match(/:/g) === null) {
                    str = str.replace(str, '');
                }
                return str
            });
            //проверка на <span|b|i style="text-align: ;">
            var styleRe5 = new RegExp('<(span|b|i|)[\\s\\n\\w=";]*(text-align:\\s*(center|left|right|justify|initial)*);">', 'ig');

            html = html.replace(styleRe5, '');
            html = html.replace(/\s*style=";*\s*"/ig, '');
            html = html.replace(/\s*style="\s*"/ig, '');
            html = html.replace(/\s*style=""/ig, '');
            html = html.replace(/\s*style=">/ig, '>');
            return html
        }


        function _cleanClass(html) {
            // Удаляет лишние классы
            var classes, action;
            var availableClasses = [];
            var availableActions = _getAvailableActions();
            for (var a = 0; a < availableActions.length; a++) {
                action = availableActions[a];
                if (self.actions.hasOwnProperty(action) && self.actions[action].hasOwnProperty('classes')) {
                    classes = self.actions[action]['classes'];
                    for (var i = 0; i < classes.length; i++) {
                        if (availableClasses.indexOf(classes[i]) < 0) availableClasses.push(classes[i])
                    }
                }
            }
            var cleanClasses;
            html = html.replace(/\s*class="[a-zA-Z0-9_\-\s]*"/ig, function (str) {
                var classesRe = new RegExp('(?:' + availableClasses.join('|') + ')', 'ig');
                cleanClasses = str.match(classesRe);
                if (cleanClasses) {
                    cleanClasses = ' class="' + cleanClasses.join(' ') + '"';
                }
                else {
                    cleanClasses = ''
                }
                return cleanClasses
            });
            html = html.replace(/\s*class=""/ig, '');
            return html
        }


        function _removeZeroWidthSpace(node) {
            // Удаляет символ zero-width space
            var re = /[\u200B-\u200D\uFEFF]/g;
            if (re.test(node.textContent)) {
                if (node.nodeType == 3) {
                    node.textContent = node.textContent.replace(re, '')
                }
                else {
                    for (var i = 0; i < node.childNodes.length; i++) {
                        _removeZeroWidthSpace(node.childNodes[i]);
                    }
                }
            }

        }


        function _removeIdenticalElements(node) {
            // Удаляет идентичные дочернии элементы.
            // Например <b><i><b>текст</b></i></b> превратит в  <b><i>текст<i/></b>

            var identicalElements = _findIdenticalElements(node);
            var currentNode;
            if (identicalElements.length > 0) {
                for (var i = 0; i < identicalElements.length; i++) {
                    currentNode = identicalElements[i];
                    for (var j = 0; j < currentNode.childNodes.length; j++) {
                        currentNode.parentNode.insertBefore(currentNode.childNodes[j], currentNode);
                    }
                    _removeNode(currentNode);
                }
            }
        }


        function _wrapToParagraph(html) {
            var tempBlock = self.iframeDocument.createElement('div');
            tempBlock.innerHTML = html;
            var resultBlock = self.iframeDocument.createElement('div');
            var currentNode;
            var paragraphNode = self.iframeDocument.createElement('p');
            var nodes = Array.prototype.slice.call(tempBlock.childNodes);
            for (var i = 0; i < nodes.length; i++) {
                currentNode = nodes[i];
                if (!(currentNode.tagName && blockTags.indexOf(currentNode.tagName.toLowerCase()) >= 0)) {
                    paragraphNode.appendChild(currentNode);
                    if (i + 1 == nodes.length && !_isEmptyNode(paragraphNode)) {
                        resultBlock.appendChild(paragraphNode);
                    }
                }
                else {
                    if (!_isEmptyNode(paragraphNode)) {
                        resultBlock.appendChild(paragraphNode);
                    }
                    resultBlock.appendChild(currentNode);
                    paragraphNode = self.iframeDocument.createElement('p');
                }

            }
            return resultBlock.innerHTML
        }


        function _normalizeHTML(node, ignoreEmptyNodes) {
            if (node) {
                var child;
                _removeIdenticalElements(node);
                if (!ignoreEmptyNodes) {
                    _removeEmptyChildNodes(node);
                }

                if (node.childNodes) {
                    for (var i = 0; i < node.childNodes.length; i++) {
                        child = node.childNodes[i];
                        if (child.nodeType == 1) {
                            _normalizeHTML(child, ignoreEmptyNodes)
                        }
                    }
                }
            }
        }


        // Events


        function _onpaste(event) {
            _showPreloader();
            event.preventDefault();


            function __setCursorToEnd(element){
                var range = document.createRange();
                var selection = self.iframeDocument.getSelection();
                range.setStart(element, 1);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            var iframe = document.getElementsByClassName('formatter-content')[0];
            var selection = self.iframeDocument.getSelection();
            var range = _getCurrentRange();
            var rootElement = _getRootElement();
            var text = event.clipboardData.getData('text/plain');
            var html = event.clipboardData.getData('text/html');
            var pasteData = html != "" ? html : text;
            var cleanedHtml = _cleanHtml(pasteData);

            var pasteBlock = self.iframeDocument.createElement('div');
            pasteBlock.innerHTML = cleanedHtml;


            var fragment = self.iframeDocument.createDocumentFragment();
            while (pasteBlock.firstChild) {
                fragment.appendChild(pasteBlock.firstChild);
            }

            var contentTypeIndex = 0; // 0 - text, 1 - stringHTML, 2 - blockHTML
            if (fragment.querySelectorAll(blockTags.join(', ')).length > 0) {
                contentTypeIndex = 2;
            }
            else if (fragment.querySelectorAll(inlineTags.join(', ')).length > 0) {
                contentTypeIndex = 1;
            }

            // Проверка вставляемых списков, чтобы вложенные списки всегда были внутри li, если это не так, то переместить в ближайший предыдущий li
            if (fragment.querySelectorAll('ul, ol').length > 0) {
                var fragmentFirstLevelLists = fragment.querySelectorAll('ul, ol');

                fragmentFirstLevelLists.forEach(function (firstLevelList) {
                    if (firstLevelList.querySelectorAll('ul, ol').length > 0) {
                        var fragmentLists = firstLevelList.querySelectorAll('ul, ol');

                        fragmentLists.forEach(function (list) {
                            if (list.parentNode.nodeName == 'UL' || list.parentNode.nodeName == 'OL') { // проверка, что список вложен в другой список
                                if (list.previousSibling && list.previousSibling.nodeName == 'LI') { // если вложенный список не единственный элемент
                                    list.previousSibling.appendChild(list); // то переместить в ближайший предыдущий li
                                }
                                else {
                                    _unwrapElement(list); // то убрать родительский список
                                }
                            }
                        });
                    }
                })
            }

            if (!range.collapsed) {
                _execCommand('delete');
            }

            var currentRange = _getCurrentRange();
            var startContainer = currentRange.startContainer;
            var parentParagraph = _getParentParagraph(startContainer);
            var parentNode = _getParentNode(startContainer);

            // условия на то, куда вставляется: текст, параграф, элемент списка, остальные элементы(b, i, span)
            if (startContainer.nodeName == '#text') {

                if (contentTypeIndex == 2) { //если вставляется блочный элемент, то текст разрывается и блок встает между ним
                    var leftPart = _splitNode(range.startContainer, range.startOffset, parentNode);

                    var markerNode = _createMarkerNode();

                    if (_findParentNode(startContainer, 'li')) { // если текст в li
                        _findParentNode(leftPart, 'li').appendChild(fragment);
                        _insertAfter(leftPart.nextSibling, markerNode);
                        if (_isEmptyNode(leftPart.nextSibling)) {
                            _removeNode(leftPart.nextSibling);
                        }
                    }
                    else {
                        if (_isEmptyNode(leftPart)) {
                            _insertAfter(leftPart, markerNode);
                            _replace(leftPart, fragment);
                        }
                        else if (_isEmptyNode(leftPart.nextSibling)) {
                            _insertAfter(leftPart.nextSibling, markerNode);
                            _replace(leftPart.nextSibling, fragment);
                        }
                        else {
                            _insertAfter(leftPart, markerNode);
                            _insertAfter(leftPart, fragment);
                        }
                    }

                    var iframeMarker = iframe.contentWindow.document.getElementById(markerNode.id);
                    __setCursorToEnd(iframeMarker.previousSibling)
                    iframeMarker.remove();
                }
                else if (contentTypeIndex < 2) { //если вставляется текст или строчный элемент, то текст встает на место курсора
                    currentRange.insertNode(fragment);
                }
            }
            else if (startContainer.nodeName == 'P') {
                _replace(currentRange.startContainer, fragment);
                _normalizeHTML(parentParagraph);
                parentParagraph.normalize();
                selection.addRange(currentRange);
            }
            else if (startContainer.nodeName == 'LI') {
                var fragmentList = (fragment.querySelector('ul, ol')) ? fragment.querySelector('ul, ol') : null;
                if (fragmentList !== null) { //если вставляется список, то вставляются только новые элементы li
                    var fragmentListItems = ((fragmentList) && ((fragmentList.nodeName == 'UL') || (fragmentList.nodeName == 'OL'))) ? fragmentList.childNodes : null;
                    for (var i = fragmentListItems.length - 1; i > 0; i--) {
                        _insertAfter(startContainer, fragmentListItems[i].cloneNode(true));
                    }
                    _replace(startContainer, fragmentListItems[0].cloneNode(true));
                    selection.addRange(currentRange);
                    _setFocusNodeContent(selection.anchorNode);
                }
                else { // вставляется скопированный фрагмент
                    currentRange.insertNode(fragment);
                    currentRange.selectNodeContents(startContainer);
                }
            }
            else {
                if (_findParentNode(startContainer, 'li')) {
                    _insertAfter(startContainer, fragment);
                }
                else {
                    currentRange.insertNode(fragment);
                    currentRange.selectNodeContents(startContainer);
                }
            }

            _updateCursorPosition();
            _removeEmptyChildNodes(rootElement);
            _setFocusNodeContent(selection.anchorNode);

            self.formatterCode.value = rootElement.innerHTML;
            _hidePreloader();
        }


        function _findIdenticalElements(element) {
            var result = [];
            if (element) {
                var selector = element.tagName.toLowerCase();
                if (element.hasAttribute('class')) {
                    var classList = element.className.split(' ');
                    selector = selector + '.' + classList.join('.');
                }
                if (element.hasAttribute('style')) {
                    var styleString = element.getAttribute('style');
                    selector = selector + '[style="' + styleString + '"]';
                }
                result = element.querySelectorAll(selector);
            }
            return result
        }


        function _onkeyup(event) {
            var keyCode = event.keyCode || event.which;
            if (keyCode == 8 || keyCode == 46) return _formatEmpty(event);
            _syncCode();
        }


        function _onkeydown(event) {
            var keyCode = event.keyCode || event.which;
            var isMac = navigator.platform == 'MacIntel';
            if (keyCode == 8 || keyCode == 46) return _formatDelete(event);
            if ((event.ctrlKey && !isMac) || (event.metaKey && isMac)) {
                if (keyCode == 66) _shortcut(event, 'bold'); // Ctrl + b
                else if (keyCode == 73) _shortcut(event, 'italic'); // Ctrl + i
                else if (keyCode == 13) _formatNewLineBr(); // Ctrl + Enter
            }
            _updateCursorPosition();
        }


        function _onkeypress(event) {
            var keyCode = event.keyCode || event.which;
            var textNode;
            if ((event.altKey || event.metaKey || event.ctrlKey) && keyCode == 13) {
                _formatNewLineBr();
            }
            else if (keyCode == 13) return _formatNewLine(event);
            else if (keyCode == 9) return _formatTab(event);
            else if (!event.ctrlKey && !event.metaKey) {
                var cursorNode = _getCursorNode();
                if (Object.keys(cursorNode.dataset).length > 0) {
                    textNode = self.iframeDocument.createTextNode('\u200B');
                    _insertAfter(cursorNode, textNode);
                    _setSelection(textNode, 1, textNode, 1);
                }
                setTimeout(function () {
                    var range = _getCurrentRange();
                    var startContainer = range.startContainer;
                    var endContainer = range.endContainer;
                    var cursorNode = _getCursorNode();
                    var re = /[\u200B-\u200D\uFEFF]/g;
                    if (re.test(cursorNode.textContent)) {
                        _removeZeroWidthSpace(cursorNode);
                        _setSelection(startContainer, startContainer.textContent.length, endContainer, endContainer.textContent.length);
                    }
                }, 0)
            }
        }


        function _onclick(event) {
            _removePopUps();
            _updateCursorPosition();
        }


        // Selection

        function _getCursorNode() {
            // Возвращает элемент где находится стартовая позиция выделения
            var selection = self.iframeDocument.getSelection();
            var range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            if (!range) return null;
            return range.startContainer.nodeType == 3 ? range.startContainer.parentNode : range.startContainer;
        }


        function _selectCursorWord() {
            // Выделяет слово по положению каретки
            var range = _getCurrentRange();
            var cursorWordParams = _getCursorWordParts();
            if (cursorWordParams.leftPart && cursorWordParams.rightPart) {
                var startWordMatch = cursorWordParams.leftPart;
                var startWord = startWordMatch && startWordMatch.length > 0 ? startWordMatch[0] : '';
                var startOffset = startWordMatch ? startWordMatch.index : range.startOffset;

                var endWordMatch = cursorWordParams.rightPart;
                var endWord = endWordMatch && endWordMatch.length > 0 ? endWordMatch[0] : '';
                var endOffset = endWord ? endWord.length + range.startOffset : range.startOffset;
                if (startWord && endWord) {
                    _setSelection(range.startContainer, startOffset, range.endContainer, endOffset);
                }
            }
        }


        function _getCursorWordParts() {
            // Возвращает объект параметров для слова внутри которго находится курсор

            var checkExistsMatch = function (matchObject) {
                return matchObject.length > 0 && matchObject[0] != ''
            };

            var range = _getCurrentRange();
            var params = {};
            if (range && range.collapsed) {
                var text = range.startContainer.nodeType == 3 ? range.startContainer.textContent : range.startContainer.innerText;
                if (text) {
                    var endPart = text.substring(range.startOffset);
                    var startPart = text.substring(0, range.startOffset);
                    var leftPart = startPart.match(/[0-9a-zA-Zа-яА-Я_]*$/i);
                    var rightPart = endPart.match(/^[0-9a-zA-Zа-яА-Я_]*/i);
                    if (checkExistsMatch(leftPart)) {
                        params.leftPart = leftPart;
                    }
                    if (checkExistsMatch(rightPart)) {
                        params.rightPart = rightPart;
                    }
                }
            }
            return params
        }


        function _cursorInWord() {
            // Возвращает true - если курсор внутри слова, иначе false
            var cursorWordParts = _getCursorWordParts();
            return cursorWordParts && cursorWordParts.leftPart && cursorWordParts.rightPart
        }


        function _setSelection(startContainer, startOffset, endContainer, endOffset) {
            // Ставит выделенеие по переданым параметрам
            var selection = self.iframeDocument.getSelection();
            var range = self.iframeDocument.createRange();
            range.setStart(startContainer, startOffset);
            range.setEnd(endContainer, endOffset);
            selection.removeAllRanges();
            selection.addRange(range);
        }


        function _selectNode(node) {
            // Выделяет переданный элемент
            var selection = self.iframeDocument.getSelection();
            var range = self.iframeDocument.createRange();
            range.selectNode(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }


        function _selectNodeContents(node) {
            // Выделяет переданный элемент
            var selection = self.iframeDocument.getSelection();
            var range = self.iframeDocument.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }


        function _replaceSelection(node) {
            // Заменяет выделение на переданный узел
            var selection = self.iframeDocument.getSelection();
            if (!selection) return;
            var range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

            if (selection.anchorNode == selection.focusNode) {
                var markerNode = _createMarkerNode();
                range.insertNode(markerNode);
                range.setStartAfter(markerNode);
                range.deleteContents();
                selection.collapseToEnd();
                selection.removeAllRanges();
                _replace(markerNode, node);
                range.selectNodeContents(node);
                selection.addRange(range);
            }
        }


        function _getCurrentRange() {
            // Возвращает текущий range
            var selection = self.iframeDocument.getSelection();
            return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        }


        function _isCollapsedSelection() {
            var selection = self.iframeDocument.getSelection();
            return selection.anchorNode == selection.focusNode && selection.anchorOffset == selection.focusOffset
        }


        function _setFocusNodeContent(node) {
            // Ставит фокус в переданный элемент
            var range = self.iframeDocument.createRange();
            var selection = self.iframeDocument.getSelection();
            if (selection !== null) {
                range.selectNodeContents(node);
                range.collapse();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }


        function _getCurrentRangeParams() {
            // Возвращает текущии параметры выделения.
            var params = {};
            var range = _getCurrentRange();
            if (!range) _focusFrame();
            range = _getCurrentRange();
            params.startContainer = range.startContainer;
            params.startOffset = range.startOffset;
            params.endOffset = range.endOffset;
            params.endContainer = range.endContainer;
            params.collapsed = range.collapsed;

            return params
        }


        // Cursor

        function _updateCursorPosition() {
            setTimeout(function () {
                var cursorPathElement = formatterElement.querySelector('.formatter-footer__cursor-path');
                cursorPathElement.innerHTML = '';
                var cursorPathItemElement = document.createElement('div');
                cursorPathItemElement.className = 'formatter-footer__cursor-path-item';

                var separatorNode = cursorPathItemElement.cloneNode(false);
                separatorNode.innerHTML = '&raquo;';
                separatorNode.className = 'formatter-footer__cursor-path-separator';

                var startContainer = _getCursorNode();
                var parents = _getParents(startContainer, true).reverse();
                var currentNode, currentPathNode, nodeClass;

                for (var i = 0; i < parents.length; i++) {
                    currentNode = parents[i];
                    currentPathNode = cursorPathItemElement.cloneNode(false);
                    currentPathNode.dataset.index = i;
                    nodeClass = currentNode.classList.length > 0 ? ' » ' + currentNode.className.split(' ').join('.') : '';
                    currentPathNode.innerText = currentNode.tagName.toLowerCase() + nodeClass;
                    currentPathNode.addEventListener('click', function (event) {
                        if (self.codeView) return;

                        var element = event.target;
                        var index = element.dataset.index;
                        if (index && index < parents.length) {
                            _selectNode(parents[index]);
                            _focusFrame();
                        }
                    });
                    cursorPathElement.appendChild(currentPathNode);
                    if (i < parents.length - 1) {
                        cursorPathElement.appendChild(separatorNode.cloneNode(true));
                    }
                }

                _updateToolbar();
            }, 1);
        }


        // Other

        function _createMarkerNode() {
            // Создает и возвращает маркированый элемент
            var id = "marker_" + ("" + Math.random()).slice(2);
            var node = self.iframeDocument.createElement('span');
            node.id = id;
            return node
        }


        function _getRootElement() {
            // Возвращает корневой элемент редактора. В данном слкчае  это body
            return self.iframeDocument.getElementsByTagName('body')[0]
        }


        function _getNewLineElement() {
            // Создает и возвращает элемент пустой строки
            var newLineElement = self.iframeDocument.createElement('p');
            newLineElement.innerHTML = '&#8203';
            return newLineElement
        }


        function _formatNewLine(event) {
            // Добавляет элемент новой строки
            var cursorNode = _getCursorNode();
            var listItemNode = cursorNode.closest('li');
            var listNode = cursorNode.closest('ol, ul');
            var parentListItemNode, newLineElement, splitElement;

            if (listItemNode && _isEmptyNode(listItemNode)) {
                event.preventDefault();
                parentListItemNode = listNode.closest('li');
                if (parentListItemNode) {
                    newLineElement = self.iframeDocument.createElement('li');
                    newLineElement.innerHTML = '&#8203';
                    if (_isEmptyNode(listNode)) {
                        _removeNode(listNode);
                        _insertAfter(parentListItemNode, newLineElement)
                    }
                    else if (listItemNode.nextSibling) {
                        splitElement = _splitNode(listItemNode, 0, listNode);
                        _removeNode(listItemNode);
                        _removeEmptyChildNodes(splitElement);
                        newLineElement.appendChild(splitElement.nextSibling);
                        _insertAfter(parentListItemNode, newLineElement);
                        newLineElement = newLineElement.firstChild;
                    }
                    else {
                        _removeNode(listItemNode);
                        _insertAfter(parentListItemNode, newLineElement)
                    }
                }
                else {
                    newLineElement = _getNewLineElement();
                    if (_isEmptyNode(listNode)) {
                        _removeNode(listItemNode);
                        _replace(listNode, newLineElement)
                    }
                    else if (listItemNode.nextSibling) {
                        splitElement = _splitNode(listItemNode, 0, listNode);
                        _removeNode(listItemNode);
                        _removeEmptyChildNodes(splitElement);
                        _insertAfter(splitElement, newLineElement)
                    }
                    else {
                        _removeNode(listItemNode);
                        _insertAfter(listNode, newLineElement)
                    }
                }
                _setFocusNodeContent(newLineElement);
            }


            setTimeout(function () {
                var range = _getCurrentRange();
                var startContainer = range.startContainer;
                if (_isEmptyNode(startContainer)) {
                    startContainer.innerHTML = '&#8203';
                    _setSelection(startContainer, startContainer.textContent.length, startContainer, startContainer.textContent.length)
                }
            }, 0);
        }


        function _formatEmpty() {
            // Если тело редактора пустое, добавлет элемент пустой строки.
            var rootElement = _getRootElement();
            var text = rootElement.innerText.trim();
            if (text == '') {
                var newLineElement = _getNewLineElement();
                rootElement.innerHTML = '';
                rootElement.appendChild(newLineElement);
                _setFocusNodeContent(newLineElement);
            }
            _syncCode();
            _updateCursorPosition();
        }


        function _formatTab(event) {
            event.preventDefault();
            var cursorNode = _getCursorNode();
            var listItemNode = cursorNode.closest('li');
            var listNode = cursorNode.closest('ol, ul');
            if (listItemNode && !_isEmptyNode(listNode)) {
                var range = _getCurrentRange();
                var rangeParams = _getCurrentRangeParams();
                var startRangeListItemNode = _findParentNode(rangeParams.startContainer, 'li');
                var endRangeListItemNode = _findParentNode(rangeParams.endContainer, 'li');

                if (!startRangeListItemNode && !endRangeListItemNode) return;

                if (startRangeListItemNode == endRangeListItemNode) {
                    if (event.shiftKey) {
                        _removeIndentListItem(listItemNode);
                    }
                    else {
                        _indentListItem(listItemNode);
                    }
                }
                else {
                    var commonList = range.commonAncestorContainer;
                    if (startRangeListItemNode.previousSibling || event.shiftKey) {
                        var items;
                        items = Array.prototype.slice.call(commonList.querySelectorAll('li')).filter(function (el) {
                            return _rangeIntersectsNode(range, el);
                        });
                        items.map(function (li) {
                            if (event.shiftKey) {
                                _removeIndentListItem(li);
                            }
                            else {
                                _indentListItem(li);
                            }
                        });
                    }
                }
                _setSelection(rangeParams.startContainer, rangeParams.startOffset, rangeParams.endContainer, rangeParams.endOffset);
            }
        }


        function _formatDelete(event) {
            var range = _getCurrentRange();
            var listItemNode = _findParentNode(range.startContainer, 'li');
            var cursorNode = _getCursorNode();

            if (_isEmptyNode(cursorNode)) {
                cursorNode.innerHTML = '<br>';
            }

            if (listItemNode) {
                var listNode = listItemNode.parentNode;

                if (!listItemNode.previousSibling && _isEmptyNode(listItemNode) && !listNode.previousSibling) {
                    event.preventDefault();
                    var emptyParagraph = _getNewLineElement();
                    _insertBefore(listNode, emptyParagraph);
                    _removeNode(listItemNode);
                    _setFocusNodeContent(emptyParagraph);
                    return false;
                }

                setTimeout(function () {
                    var childList = listItemNode.querySelector('ul, ol');
                    if (listItemNode && childList) {
                        var previousListItem = listItemNode.previousSibling;
                        var text = listItemNode.textContent.replace(childList.textContent, '');
                        if (!/[^\s]/g.test(text)) {
                            if (previousListItem) {
                                previousListItem.appendChild(childList);
                                _removeNode(listItemNode);
                            }
                            else {
                                _removeNode(listItemNode);
                                if (listNode.childNodes.length > 1) {
                                    while (childList.firstChild) {
                                        _insertBefore(listNode.firstChild, childList.firstChild)
                                    }
                                }
                                else {
                                    _replaceChildNodes(childList, listNode)
                                }
                            }

                            if (previousListItem) {
                                _setFocusNodeContent(previousListItem);
                            }
                            else {
                                var selection = self.iframeDocument.getSelection();
                                var newRange = self.iframeDocument.createRange();
                                newRange.setStart(_getFirstTextNode(listNode.firstChild), 0);
                                newRange.collapse();
                                selection.removeAllRanges();
                                selection.addRange(newRange)
                            }

                        }

                    }
                    _joinNeighborsList(childList);
                }, 0);
            }

            if (!_isCollapsedSelection() && range.startContainer.nodeName == '#text') {
                event.preventDefault();
                range.deleteContents();
                var pNode = _findParentNode(range.startContainer, 'p');
                if (pNode && pNode.innerText.length == 0) {
                    pNode.innerHTML = '&#8203';
                }
            }


            var rangeStartNode = range.startContainer.nodeName == '#text' ? range.startContainer.parentNode : range.startContainer;
            if (inlineTags.indexOf(rangeStartNode.nodeName.toLowerCase()) != -1) {
                if (rangeStartNode.nodeName !== 'BODY') {
                    var currentRangeAllParents = _getParents(range.startContainer, false);
                    var currentRangeClosestParent = rangeStartNode.parentNode;
                    var currentRangeParentNode;

                    currentRangeAllParents.forEach(function (item) {
                        if (inlineTags.indexOf(item.nodeName.toLowerCase()) != -1) {
                            return currentRangeParentNode = item;
                        }
                    })

                    setTimeout(function() {
                        var timeoutRange = _getCurrentRange();
                        var timeoutRangeParentNode = timeoutRange.startContainer.parentNode;

                        if (rangeStartNode.nodeName !== timeoutRangeParentNode.nodeName) {
                            var lastNode;
                            if (timeoutRangeParentNode.nodeName == 'P') {
                                var lastNode = currentRangeParentNode.cloneNode(true);
                            }
                            else {
                                var lastNode = currentRangeClosestParent.cloneNode(true);
                            }

                            lastNode.innerHTML = '&#8203';
                            timeoutRange.insertNode(lastNode);
                            _setFocusNodeContent(lastNode)
                        }
                    }, 1);
                }
            }

            var rootElement = _getRootElement();
            _removeEmptyChildNodes(rootElement);
        }


        function _formatNewLineBr() {
            var range = _getCurrentRange();
            var brElement = self.iframeDocument.createElement('br');
            range.deleteContents();
            range.insertNode(brElement);
            var textNode = self.iframeDocument.createTextNode('\u200B');
            _insertAfter(brElement, textNode);
            _setSelection(textNode, 1, textNode, 1);
            _focusFrame();
            _syncCode();
        }


        function _syncCode() {
            // Устанавливает код из iFrame в texarea
            var rootElement = _getRootElement();
            self.formatterCode.value = rootElement.innerHTML;
            _dispatchChangeCodeEvent();
            _formateCode();
        }


        function _syncDOM() {
            // Устанавливает код из textarea в iFrame
            _showPreloader();
            var cleanedHtml = _cleanHtml(self.formatterCode.value);
            cleanedHtml = _wrapToParagraph(cleanedHtml);
            if (cleanedHtml == '') {
                cleanedHtml = _getNewLineElement().outerHTML;
            }
            var rootElement = _getRootElement();
            rootElement.innerHTML = cleanedHtml;
            self.formatterCode.value = cleanedHtml;
            _dispatchChangeCodeEvent();
            _hidePreloader();
        }


        function _dispatchChangeCodeEvent() {
            if ('createEvent' in document) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                self.formatterCode.dispatchEvent(event);
            }
            else
                self.formatterCode.fireEvent('onchange');
        }


        function _focusFrame() {
            self.formatterFrame.contentWindow.document.body.focus();
        }


        function _formateCode() {
            function __getListMatch(listNode) {
                var listTagRegExp = new RegExp('(<(?:ul|ol)(?:[^>]*)>)(.*)(<\/(?:ul|ol)>)', 'gi');
                    listMatch = listTagRegExp.exec(listNode);

                return listMatch;
            }

            function __insertTab(node, level, i) {
                var childNodes = node.childNodes,
                    currentNode,
                    parentCurrentNode,
                    fragment = '',
                    listNodeHTML = node.outerHTML.replace(new RegExp('\n', 'ig'), ' '),
                    listMatch = __getListMatch(listNodeHTML);

                // проверка, если это вообще первый ul или ol в textarea, то первая часть вставляется без переноса строки \n
                if (i == 0) fragment += '    '.repeat(level) + listMatch[1];
                else fragment += '\n' + '    '.repeat(level) + listMatch[1];

                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i].nodeName !== '#text') {
                        currentNode = childNodes[i];

                        var liTagRegExp = new RegExp('(<(?:li)(?:[^>]*)>)(.*)(<\/(?:li)>)', 'gi'),
                            liNodeHTML = currentNode.outerHTML.replace(new RegExp('\n', 'ig'), ' '),
                            liMatch = liTagRegExp.exec(liNodeHTML);

                        if (liMatch) {
                            fragment += '\n' + '    '.repeat(1 + level) + liMatch[1];
                            if ((currentNode.nodeType == 1) && ((currentNode.querySelector('ol') || currentNode.querySelector('ul')))) {
                                parentCurrentNode = currentNode.querySelector('ul, ol');
                                currentNode.removeChild(parentCurrentNode);
                                fragment += '\n' + '    '.repeat(2 + level) + currentNode.innerHTML.trim();
                                fragment += __insertTab(parentCurrentNode, level + 2);
                                fragment += '\n' + '    '.repeat(1 + level) + liMatch[3];
                            }
                            else {
                                fragment += currentNode.innerHTML.trim();
                                fragment += liMatch[3];
                            }
                        }
                    }
                }

                fragment += '\n' + '    '.repeat(level) + listMatch[3];
                return fragment;
            }

            var formatterCodeValue = self.formatterCode.value,
                originalCode = self.iframeDocument.createElement('div'),
                originalChildNodes = originalCode.childNodes,
                currentOriginalNode,
                transformedCode = ''; // переменная для общего отформатированного кода

            originalCode.innerHTML = formatterCodeValue;

            for (var i = 0; i < originalChildNodes.length; i++) {
                currentOriginalNode = originalChildNodes[i];

                if ((currentOriginalNode.tagName == 'UL') || (currentOriginalNode.tagName == 'OL')) {
                    if (i == 0) transformedCode += __insertTab(currentOriginalNode, 0, 0);
                    else transformedCode += __insertTab(currentOriginalNode, 0);
                }
                else transformedCode += (i == 0 ? '' : '\n') + currentOriginalNode.outerHTML;
            }
            self.formatterCode.value = transformedCode;
        }

        // Wrap

        function _rangesIntersect(rangeA, rangeB) {
            // Полифил range.intersectsNode
            return rangeA.compareBoundaryPoints(Range.END_TO_START, rangeB) === -1 &&
                rangeA.compareBoundaryPoints(Range.START_TO_END, rangeB) === 1
        }


        function _rangeIntersectsNode(range, node) {
            // Проверяет пересечение узла и выделения
            if (range.intersectsNode) {
                return range.intersectsNode(node)
            } else {
                var nodeRange = self.iframeDocument.createRange();
                nodeRange.selectNode(node);
                return _rangesIntersect(range, nodeRange)
            }
        }


        function _isNonEmptyTextNode(node) {
            // Проверяет тектовый узел на пустоту
            return node.textContent.length > 0
        }


        function _getRangeTextNodes(range) {
            // Возвращает массив непустых текстовых узлов входящих в выделение
            var container = range.commonAncestorContainer;
            var nodes = _getTextNodes(container.parentNode || container);

            return nodes.filter(function (node) {
                return _rangeIntersectsNode(range, node) && _isNonEmptyTextNode(node)
            })
        }


        function _getTextNodes(el) {
            // Возвращает массив текстовых узлов входящих в перданный элемент
            el = el || self.iframeDocument.body;

            var doc = self.iframeDocument;
            var walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            var textNodes = [];
            var node;

            while (node = walker.nextNode()) {
                textNodes.push(node)
            }
            return textNodes
        }


        function _getFirstTextNode(el) {
            if (el) {
                if (el.nodeType == 3) return el;
                var textNodes = _getTextNodes(el);
                return textNodes.length > 0 ? textNodes[0] : null;
            }
            return null
        }


        function _getLastTextNode(el) {
            if (el) {
                if (el.nodeType == 3) return el;
                var textNodes = _getTextNodes(el);
                return textNodes.length > 0 ? textNodes[textNodes.length - 1] : null;
            }
            return null
        }


        function _createWrapperFunction(wrapperEl, range) {
            // Конструктор фунции обертки для текстового узла
            var startNode = range.startContainer;
            var endNode = range.endContainer;
            var startOffset = range.startOffset;
            var endOffset = range.endOffset;

            return function wrapNode(node) {
                // Заворачивает переданный узел в wrapperEl
                var currentRange = self.iframeDocument.createRange();
                var currentWrapper = wrapperEl.cloneNode(false);
                var textNode;
                currentRange.selectNodeContents(node);
                if (node === startNode && startNode.nodeType === 3) {
                    currentRange.setStart(node, startOffset);
                    currentRange.surroundContents(currentWrapper);
                    textNode = _getFirstTextNode(currentWrapper);
                    if (textNode) {
                        range.setStart(textNode, 0)
                    }
                    else {
                        range.setStart(currentWrapper, 0)
                    }

                }
                else if (node === endNode && endNode.nodeType === 3) {
                    currentRange.setEnd(node, endOffset);
                    currentRange.surroundContents(currentWrapper);
                    textNode = _getLastTextNode(currentWrapper);
                    if (textNode) {
                        range.setEnd(textNode, textNode.length)
                    }
                    else {
                        range.setEnd(currentWrapper, 1)
                    }
                }
                else {
                    currentRange.surroundContents(currentWrapper);
                }
                return currentWrapper
            }
        }


        function _wrapSelection(node) {
            // Заворачивает выделенный текст в переданный элемент
            var selection = self.iframeDocument.getSelection();
            if (!selection) return;
            var range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

            if (selection.anchorNode == selection.focusNode) {
                var fragment = range.extractContents();
                node.append(fragment);
                if (!node.hasChildNodes()) {
                    node.innerHTML = '&#8203';
                }
                var markerNode = _createMarkerNode();
                range.insertNode(markerNode);
                range.setStartAfter(markerNode);
                range.deleteContents();
                selection.collapseToEnd();
                selection.removeAllRanges();
                _replace(markerNode, node);
                range.selectNodeContents(node);
                selection.addRange(range);
            }
            else {
                var nodes = _getRangeTextNodes(range);
                var wrapFunc = _createWrapperFunction(node, range);
                nodes.map(wrapFunc);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }


        function _unwrapSelectionByAction(action) {
            var selectionNode, edgeNode;
            var selection = self.iframeDocument.getSelection();
            if (!selection) return;

            var range = _getCurrentRange();
            var rangeParams = _getCurrentRangeParams();
            var cursorNode = _getCursorNode();
            var actionNode = _findParentActionElement(action, cursorNode);
            var commonContainer = range.commonAncestorContainer;
            var newRange = range.cloneRange();

            var __setRangeStart = function (node) {
                var textNode = _getFirstTextNode(node);
                if (textNode) {
                    rangeParams.startContainer = textNode;
                    rangeParams.startOffset = 0;
                }
                else {
                    newRange.setStartBefore(node.firstChild);
                    rangeParams.startContainer = newRange.startContainer;
                    rangeParams.startOffset = newRange.startOffset;
                }
            };

            var __setRangeEnd = function (node) {
                textNode = _getLastTextNode(node);
                if (textNode) {
                    rangeParams.endContainer = textNode;
                    rangeParams.endOffset = textNode.length;
                }
                else {
                    newRange.setEndAfter(node.lastChild);
                    rangeParams.endContainer = newRange.endContainer;
                    rangeParams.endOffset = newRange.endOffset;
                }
            };

            if (_isCollapsedSelection()) {
                if (!actionNode) return;

                if (_cursorInWord()) {
                    _selectCursorWord();
                    selectionNode = _cutSelection(actionNode);
                    rangeParams.startContainer = _getFirstTextNode(selectionNode);
                    rangeParams.endContainer = _getFirstTextNode(selectionNode);
                    _unwrapElement(selectionNode);
                    _setSelection(rangeParams.startContainer, rangeParams.startOffset, rangeParams.endContainer, rangeParams.endOffset);
                }
                else {
                    var contentElement;
                    var lastElement = actionNode.childNodes.length > 0 ? actionNode.childNodes[actionNode.childNodes.length - 1].cloneNode(true) : null;
                    lastElement = lastElement && lastElement.nodeType != 3 ? lastElement : null;
                    if (lastElement) {
                        var textNodes = _getTextNodes(lastElement);
                        for (var i = 0; i < textNodes.length; i++) {
                            _removeNode(textNodes[i]);
                        }
                        contentElement = _getDeepLastChild(lastElement);
                        contentElement.innerHTML = '&#8203';
                    }
                    else {
                        lastElement = self.iframeDocument.createTextNode('\u200B');
                        contentElement = lastElement;
                    }
                    _insertAfter(actionNode, lastElement);
                    range.setStart(contentElement, 1);
                    range.setEnd(contentElement, 1);
                    range.collapse();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
            else if (selection.anchorNode == selection.focusNode || actionNode == commonContainer) {
                if (!actionNode) return;
                selectionNode = _cutSelection(actionNode);
                __setRangeStart(selectionNode);
                __setRangeEnd(selectionNode);
                _unwrapElement(selectionNode);
                _setSelection(rangeParams.startContainer, rangeParams.startOffset, rangeParams.endContainer, rangeParams.endOffset);
            }
            else {
                var actionElements = Array.prototype.slice.call(_getRangeActionElements(action, range));
                var currentElement, textNode;
                for (var j = 0; j < actionElements.length; j++) {
                    currentElement = actionElements[j];
                    if (currentElement == rangeParams.startContainer || (rangeParams.startContainer.nodeType == 3 && _isDescendant(currentElement, rangeParams.startContainer) && currentElement.innerText.length == rangeParams.startContainer.length - rangeParams.startOffset)) {
                        __setRangeStart(currentElement);
                        _unwrapElement(currentElement);
                    }
                    else if (currentElement == rangeParams.endContainer || (rangeParams.endContainer.nodeType == 3 && _isDescendant(currentElement, rangeParams.endContainer) && currentElement.innerText.length == rangeParams.endOffset)) {
                        __setRangeEnd(currentElement);
                        _unwrapElement(currentElement);
                    }
                    else if (_isDescendant(currentElement, rangeParams.startContainer)) {
                        edgeNode = _splitNode(rangeParams.startContainer, rangeParams.startOffset, currentElement);
                        selectionNode = edgeNode.nextSibling;
                        __setRangeStart(selectionNode);
                        _unwrapElement(selectionNode);

                    }
                    else if (_isDescendant(currentElement, rangeParams.endContainer)) {
                        selectionNode = _splitNode(rangeParams.endContainer, rangeParams.endOffset, currentElement);
                        __setRangeEnd(selectionNode);
                        _unwrapElement(selectionNode);
                    }
                    else {
                        _unwrapElement(currentElement)
                    }
                }
                _setSelection(rangeParams.startContainer, rangeParams.startOffset, rangeParams.endContainer, rangeParams.endOffset);
            }
        }


        function _cutSelection(stopNode) {
            // Вырезает выделение с сохранением структуры.
            // Возвращает вырезанный Node
            var currentRange = _getCurrentRange();
            var leftPart = _splitNode(currentRange.startContainer, currentRange.startOffset, stopNode);
            if (_isEmptyNode(leftPart)) {
                _removeNode(leftPart)
            }
            leftPart = _splitNode(currentRange.endContainer, currentRange.endOffset, stopNode);
            if (leftPart.nextSibling && _isEmptyNode(leftPart.nextSibling)) {
                _removeNode(leftPart.nextSibling)
            }
            return leftPart;
        }


        function _unwrapElement(el) {
            var parent = el.parentNode;
            while (el.firstChild) parent.insertBefore(el.firstChild, el);
            parent.removeChild(el);
        }


        function _splitNode(node, offset, limit) {
            // Разбивает элемент node по смещению offset, ограничиваясь родителем limit.
            // Возвращает левый элемент от точки разбиения.
            var parent = limit.parentNode;
            var parentOffset = _getNodeIndex(parent, limit);

            var leftRange = self.iframeDocument.createRange();
            leftRange.setStart(parent, parentOffset);
            leftRange.setEnd(node, offset);
            var left = leftRange.extractContents();
            _insertBefore(limit, left);
            return limit.previousSibling;
        }


        function _getNodeIndex(parent, node) {
            var index = parent.childNodes.length;
            while (index--) {
                if (node === parent.childNodes[index]) {
                    break;
                }
            }
            return index;
        }


        // Utils

        function _isObject(obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        }


        function _extend(target, source) {
            if (_isObject(target) && _isObject(source)) {
                for (var key in source) {
                    target[key] = source[key]
                }
            }
        }


        function _getNeighborsBetween(startNode, endNode, includeSelf) {
            var items = [];
            var element = startNode;
            if (includeSelf) items.push(startNode);
            while (element.nextSibling && element.nextSibling !== endNode) {
                element = element.nextSibling;
                items.push(element);
            }
            if (includeSelf) items.push(endNode);
            return items
        }


        function _insertBefore(referenceNode, newNode) {
            // Вставляет newNode перед элементом referenceNode
            referenceNode.parentNode.insertBefore(newNode, referenceNode);
        }


        function _insertAfter(referenceNode, newNode) {
            // Вставляет newNode после элемента referenceNode
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }


        function _replace(oldNode, newNode) {
            oldNode.parentNode.replaceChild(newNode, oldNode);
        }


        function _replaceChildNodes(fromNode, toNode) {
            if (fromNode && fromNode.childNodes && toNode) {
                while (fromNode.firstChild) {
                    toNode.appendChild(fromNode.firstChild)
                }
            }
            return toNode
        }


        function _isDescendant(parent, child) {
            // Проверяет относится ли child к parent
            var node = child.parentNode;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }


        function _isEmptyNode(node) {
            return node && /^[\u0020\u200B-\u200D\uFEFF]*$/g.test(node.textContent);
        }


        function _removeNode(node) {
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }


        function _getParentNode(node) {
            return node.parentNode ? node.parentNode : null
        }


        function _getParents(node, self) {
            // Возвращает массив родительских элементов
            var parents = [];
            if (node && node.tagName != 'BODY') {
                self = self ? true : false;
                var parentNode;
                var currentNode = node;
                var walk = true;
                if (self) {
                    parents.push(node);
                }
                while (walk) {
                    parentNode = _getParentNode(currentNode);
                    if (parentNode && parentNode.tagName && parentNode.tagName != 'BODY') {
                        parents.push(parentNode);
                        currentNode = parentNode
                    }
                    else {
                        walk = false;
                        break;
                    }
                }
            }
            return parents
        }


        function _addClass(node, className) {
            var classList = node.className.split(' ').filter(function (el) { return el != '' });
            if (classList.lastIndexOf(className) < 0) {
                classList.push(className);
                node.className = classList.join(' ')
            }
        }


        function _removeClass(node, className) {
            var classList = node.className.split(' ');
            var index = classList.lastIndexOf(className);
            if (index >= 0) classList.splice(index, 1);
            node.className = classList.join(' ')
        }


        function _hasClass(node, className) {
            var classList = node.className.split(' ');
            return classList.lastIndexOf(className) >= 0
        }


        function _findParentNode(node, selector) {
            var result;
            if (node) {
                result = (node.nodeType == 3 ? node.parentNode : node).closest(selector);
            }
            return result;
        }


        function _getChildNodes(node) {
            return node && node.childNodes ? node.childNodes : null
        }


        function _getDeepLastChild(node) {
            return node.lastChild ? _getDeepLastChild(node.lastChild) : node;
        }


        function _camelCaseToDash(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }


        function _getParentParagraph(node) {
            var result;
            if (node) {
                var el = node.nodeType == 3 ? node.parentNode : node;
                result = el.closest('body p');
            }
            return result;
        }


        function _getTopElement(node) {
            var result;
            if (node) {
                var el = node.nodeType == 3 ? node.parentNode : node;
                result = el.closest('body > p, body > ul, body > ol');
            }
            return result;
        }


        function _rgbToHex(rgb) {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }


        self.getValue = function () {
            // Возвращает значение
            var rootElement = _getRootElement();
            var value = '';
            if (!_isEmptyNode(rootElement)) {
                value = self.formatterCode.value;
            }
            return value
        }


    }

    return Formatter
});