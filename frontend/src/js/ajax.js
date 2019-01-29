// Добавление товара в Корзину и изменение кол-ва позиций товара в Корзине
function ajaxAddToCart(product_id, amount, callback) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'id=' + product_id + '&amount=' + amount + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/add-to-basket/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {

                if ($('.checkout').length > 0) {
                    ajaxGetDeliveryInfo();
                }

                updateBasketPage(
                    responseObj.data.basket_total_amount,
                    responseObj.data.basket_available_amount,
                    responseObj.data.basket_not_available_amount,
                    responseObj.data.basket_total_price,
                    responseObj.data.basket_total_price_str,
                    responseObj.data.basket_discount,
                    responseObj.templates.basket_goods_list);

                setCalculatedCashback();

                updateBasketPreview(
                    responseObj.data.basket_total_amount,
                    responseObj.data.basket_available_amount,
                    responseObj.data.basket_not_available_amount,
                    responseObj.data.basket_total_price_str,
                    responseObj.templates.basket_preview);

                if (callback) callback(product_id);

                // обязательно уведомление об успешом добавлении в корзину
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }

        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// Удаление товара из Корзины
function ajaxDeleteFromBasket(product_id) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'id=' + product_id + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/delete-from-basket/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                if ($('.checkout').length > 0) {
                    ajaxGetDeliveryInfo();
                }

                if (responseObj.data.basket_not_available_amount > 0) {
                    updateNotAvailableList(product_id)
                }

                updateBasketPage(
                    responseObj.data.basket_total_amount,
                    responseObj.data.basket_available_amount,
                    responseObj.data.basket_not_available_amount,
                    responseObj.data.basket_total_price,
                    responseObj.data.basket_total_price_str,
                    responseObj.data.basket_discount,
                    responseObj.templates.basket_goods_list);

                setCalculatedCashback();

                if (responseObj.data.basket_total_amount === 0) {
                    removeBasketPreview();
                }
                else {
                    updateBasketPreview(
                        responseObj.data.basket_total_amount,
                        responseObj.data.basket_available_amount,
                        responseObj.data.basket_not_available_amount,
                        responseObj.data.basket_total_price_str,
                        responseObj.templates.basket_preview);
                }

                updateProductAfterDelete(product_id);
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

// Удаление всех товаров, которых нет в наличии, из Корзины
function ajaxDeleteNotAvailableProductsFromBasket() {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/delete-not-available-from-basket/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                if (responseObj.data.basket_total_amount === 0) {
                    updateBasketPage(responseObj.data.basket_total_amount);
                    removeBasketPreview();
                }
                else {
                    removeNotAvailableListBasketPage();
                    updateBasketPreview(responseObj.data.basket_total_amount);
                }
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

// Получение информации о доставке
function ajaxGetDeliveryInfo() {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/delivery-info-for-checkout/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                $('label[for=delivery-type-courier] .icon-input-label__description').text(responseObj.data.delivery_text);
                $('label[for=delivery-type-self] .icon-input-label__description').text(responseObj.data.pickup_text);
                $('.checkout__delivery-points').empty().append(responseObj.templates.delivery_points);
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

// Предпросмотр товара
function ajaxProductPreview(product_id, needShowPopUp) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'id=' + product_id + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/product-preview/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {

                showProductPreview(responseObj.templates.product_preview);
                if (needShowPopUp) {
                    showPopUp('pop-up-product-preview');
                }

                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

function ajaxGetDeliveryResidueInfo(product_id, amount) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'id=' + product_id + '&amount=' + amount + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/delivery-and-residue-info/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                var parentProdict = $('.product[data-product-id=' + product_id+']');
                parentProdict.find('.product-card__availability .hint-wrap').remove();
                parentProdict.find('.product-card__availability').append(responseObj.templates.residue_info);

                parentProdict.find('.product-card__ordering-options .product-card__delivery-info').remove();
                parentProdict.find('.product-card__ordering-options').append(responseObj.templates.delivery_info);

                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

// Избранное
function ajaxAddFavorites(product_id) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'id=' + product_id + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/add-to-favorite/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                $('.wish-list__counter').text(responseObj.data.favorites_amount);

                var currentProduct = $('.product[data-product-id=' + product_id + ']');

                currentProduct.find('.js-btn-favorites').toggleClass('icon-heart-stroke icon-heart-fill js-btn-favorites_add js-btn-favorites_remove active');

                currentProduct.find('.product-card__wish-list').text('В избранном');
                currentProduct.find('.js-btn-favorites').data('hint-text', 'Убрать из избранного');
                if (currentProduct.find('.js-btn-favorites').hasClass('js-show-hint')) {
                    hideHint();
                    showHint(currentProduct.find('.js-btn-favorites'));
                }

                if (responseObj.data.favorites_amount > 0) {
                    $('.header-wish-list__tooltip-text_no-items, .header-wish-list__tooltip-text_has-items').toggleClass('hidden');
                }
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

function ajaxRemoveAllFavorites() {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/clear-favorite/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                $('.wish-list__link .wish-list__counter').text('0');
                $('.account-aside__list-item_current .account-aside__counter').text(responseObj.data.favorites_amount);
                $('.account__favorites-products-wrap').remove();
                $('.js-account__favorites-empty-block').removeClass('hidden');
                $('.js-remove-favorites-list').remove();
                $('.header-wish-list__tooltip-text_no-items, .header-wish-list__tooltip-text_has-items').toggleClass('hidden');

                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

function ajaxRemoveItemFavorites(product, product_id) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'id=' + product_id + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/delete-from-favorite/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                var currentProduct = $('.product[data-product-id=' + product_id + ']');

                $('.wish-list__counter').text(responseObj.data.favorites_amount);
                $('.account-aside__list-item_current .account-aside__counter').text(responseObj.data.favorites_amount);


                currentProduct.find('.js-btn-favorites').toggleClass('icon-heart-stroke icon-heart-fill js-btn-favorites_add js-btn-favorites_remove active');

                currentProduct.find('.product-card__wish-list').text('Избранное');

                currentProduct.find('.js-btn-favorites').data('hint-text', 'Добавить в избранное');
                if (currentProduct.find('.js-btn-favorites').hasClass('js-show-hint')) {
                    hideHint();
                    showHint(currentProduct.find('.js-btn-favorites'));
                }

                $('.account__favorites-products-wrap').find(product).remove();
                if (responseObj.data.favorites_amount === 0) {
                    $('.js-account__favorites-empty-block').removeClass('hidden');
                    $('.js-remove-favorites-list').remove();
                    $('.account__favorites-products-wrap').remove();
                    $('.header-wish-list__tooltip-text_no-items, .header-wish-list__tooltip-text_has-items').toggleClass('hidden');
                }
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

// Пагинация товаров в избранном
function ajaxMoreFavorites(limit, offset) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'limit=' + limit + '&offset=' + offset + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/favourites/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.account__favorites-products-wrap').find('.btn_more').addClass('hidden');
                }

                $('.account__favorites-products').append(responseObj.templates.favorites_list);

                deleteFavoritesAmount = 0;

                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// Сравнение
function ajaxCompare(product_id) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'id=' + product_id + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/add-to-compare/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                $('.compare-list__counter').text(responseObj.data.compare_amount);
                $('.compare-container').empty();
                $('.compare-container').append(responseObj.data.compare_list);

                var currentProduct = $('.product[data-product-id=' + product_id + ']');

                currentProduct.find('.js-btn-compare').toggleClass('js-btn-compare_add js-btn-compare_remove active');
                currentProduct.find('.product-card__compare-list').text('В сравнении');
                currentProduct.find('.js-btn-compare').data('hint-text', 'Убрать из сравнения');
                if (currentProduct.find('.js-btn-compare').hasClass('js-show-hint')) {
                    hideHint();
                    showHint(currentProduct.find('.js-btn-compare'));
                }

                if (responseObj.data.compare_amount > 0) {
                    $('.header-compare-list__tooltip-text_no-items, .header-compare-list__tooltip-text_has-items').toggleClass('hidden');
                }
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

function ajaxRemoveAllCompare() {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = 'csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/clear-compare/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                $('.compare-list__counter').text('0');
                $('.compare-container').empty();
                $('.compare__empty-block').removeClass('hidden');
                $('.header-compare-list__tooltip-text_no-items, .header-compare-list__tooltip-text_has-items').toggleClass('hidden');

                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

function ajaxRemoveItemCompare(product, product_id) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    if ($('.compare-container').length == 1) {
        dataToSend = 'id=' + product_id + '&get_template=true' + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;
    }
    else dataToSend = 'id=' + product_id + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/delete-from-compare/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                $('.compare-list__counter').text(responseObj.data.compare_amount);
                hideHint();

                if (responseObj.data.compare_amount === 0) {
                    $('.header-compare-list__tooltip-text_no-items, .header-compare-list__tooltip-text_has-items').toggleClass('hidden');

                    $('.compare-container').addClass('hidden');
                    $('.compare__empty-block').removeClass('hidden');
                }
                else {
                    $('.compare-container').addClass('visually-hidden');

                    updateCompareProductAfterDelete(product_id);
                    if (responseObj.templates) updateComparePageAfterDelete(responseObj.templates.compare);
                }

                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

// Оформление заказа
function ajaxNewOrder(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(jqForm);
    dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/checkout/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.orderid) {
                    $('.online-payment-form').attr('action', responseObj.data.redirect_url);
                    $('.online-payment-form').find('[name=sum]').val(responseObj.data.sum);
                    $('.online-payment-form').find('[name=orderid]').val(responseObj.data.orderid);
                    $('.online-payment-form').find('[name=client_phone]').val(responseObj.data.client_phone);
                    $('.online-payment-form').submit();
                }
                else window.location.replace(responseObj.data.redirect_url);

                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// Отмена заказа
function ajaxСancelOrder(order_id, reason) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'order_id=' + order_id + '&reason=' + reason + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/cancel-order/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                hidePopUps();
                $('.cancel-order-form').find('input[type=radio]').prop('checked', false);
                $('.cancel-order-form').find('input[type=radio]:first').prop('checked', true);

                $('.account-order__wrap[data-order-id=' + order_id + ']').addClass('canceled');
                $('.account-order__wrap[data-order-id=' + order_id + ']').find('.account-order__status').text(responseObj.data.status_name);
                $('.account-order__wrap[data-order-id=' + order_id + ']').find('.order-body__btn-wrap, .order-summary_cashback').remove();
                $('.account-order__wrap[data-order-id=' + order_id + ']').find('.account-order__payment-wrap').remove();

                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// Товары по фильтру
function ajaxPageProducts(url, category_id, page, form, callback, q) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(form);

    if (q) {
        dataToSend = 'q=' + q + '&category_id=' + category_id + '&page=' + page + '&' + form.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;
    }
    else {
        dataToSend = 'category_id=' + category_id + '&page=' + page + '&' + form.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;
    }
    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/' + url,
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                else {
                    $('.btn_more').removeClass('hidden');
                }

                if (responseObj.data.goods_amount === 0) {
                    $('.category__empty-block').removeClass('hidden');
                }
                else {
                    $('.category__empty-block').addClass('hidden');
                }
                setTimeout(function () {
                    callback(responseObj.templates.goods_grid);
                }, preloaderHideTime);
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
            hideGridPreloader();
        }
    });
}

// Товары в конечной категории
function ajaxLastCategoryProducts(category_id, page, form, callback) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend,
        breakBannersId,
        breakBannersIdArr = [],
        breakBannersLength = $('.break-grid-banner').length;

    trimFormFields(form);
    if (breakBannersLength > 0) {
        $('.break-grid-banner').each(function () {
            var currentBannerId = $(this).data('banner-id');

            breakBannersIdArr.push(currentBannerId)
        })
        breakBannersId = breakBannersIdArr.join(',');

        dataToSend = 'page=' + page + '&banner_id=' + breakBannersId + '&' + form.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;
    }
    else {
        dataToSend = 'page=' + page + '&' + form.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;
    }

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/category/' + category_id + '/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                else {
                    $('.btn_more').removeClass('hidden');
                }

                if (responseObj.data.goods_amount === 0) {
                    $('.category__empty-block').removeClass('hidden');
                }
                else {
                    $('.category__empty-block').addClass('hidden');
                }
                setTimeout(function () {
                    callback(responseObj.templates.goods_grid);
                }, preloaderHideTime);
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
            hideGridPreloader();
        }
    });
}

// Товары по результатам поиска
function ajaxSearchProducts(q, category_id, page, form, callback) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(form);
    dataToSend = 'q=' + q + '&category_id=' + category_id + '&page=' + page + '&' + form.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/search/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                else {
                    $('.btn_more').removeClass('hidden');
                }
                setTimeout(function () {
                    callback(responseObj.templates.goods_grid);
                }, preloaderHideTime)
            }
            else {
                removeSearchResult();
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
            hideGridPreloader();
        }
    });
}

// Товары с промо-кэшбэком
function ajaxPromoProducts(category_id, page, form, callback) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(form);
    dataToSend = 'category_id=' + category_id + '&page=' + page + '&' + form.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/promo-products/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                else {
                    $('.btn_more').removeClass('hidden');
                }
                setTimeout(function () {
                    callback(responseObj.templates.goods_grid);
                }, preloaderHideTime)
            }
            else {
                removeSearchResult();
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
            hideGridPreloader();
        }
    });
}

// Товары на странице бренда
function ajaxBrandProducts(category_id, brand_id, page, form, callback) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'category_id=' + category_id + '&page=' + page + '&' + form.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    $.ajax({
        data: dataToSend,
        url: '/api/site/brands/' + brand_id + '/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {

                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                else {
                    $('.btn_more').removeClass('hidden');
                }
                setTimeout(function () {
                    callback(responseObj.templates.goods_grid);
                }, preloaderHideTime)
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
            hideGridPreloader();
        }
    });
}

// Оставить комментарий
function review(jqForm, product_id) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(jqForm);
    dataToSend = jqForm.serialize() + '&product=' + product_id + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/review/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                jqForm[0].reset();
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }

        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// Мгновенный поиск
function ajaxInstantSearch(q) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'q=' + q + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/instant-search/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                showSearchResult(responseObj.templates.search_result, q);
            }
            else {
                removeSearchResult();
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

// Подписаться на рассылку
function ajaxSubscribe(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(jqForm);
    dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/subscribe/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                $('.js-subscribe-form__submited').removeClass('hidden');
                $('.js-subscribe-form__submit').addClass('hidden');
                $('.subscribe-form')[0].reset();
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }

        }
    });
}

// Обратный звонок
function getCallback(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(jqForm);
    dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/get-callback/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                hidePopUps();
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }

        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// Новости
function ajaxNews(page) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/news/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                $('.news-list').append(responseObj.templates.goods_grid);
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// Заказы в ЛК
function ajaxOrders(page, last_year) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&last_year=' + last_year + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    $.ajax({
        data: dataToSend,
        url: '/api/site/profile-orders/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                $('.account-main__orders-list').append(responseObj.templates.orders_list)
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// История списания/начисления кэшбэков в ЛК
function ajaxMoreCashbackHistory(page) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    $.ajax({
        data: dataToSend,
        url: '/api/site/cashback-history/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden')
                }
                $('.cashback-history__table').append(responseObj.templates.cashback_history);
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

// Запросы по кнопке "Показать больше"
$('body').on('click', '.btn_more', function () {
    var pageCount = $(this).data('page-count');

    pageCount++;
    $(this).data('page-count', pageCount);
    $(this).addClass('btn_preloader');

    if ($(this).hasClass('js-more-products')) {
        ajaxLastCategoryProducts(
            $('.category').data('category-id'),
            pageCount,
            $('.products-filter'),
            showMoreFilterItems
        );
    }
    else if ($(this).hasClass('js-more-search-products')) {
        var q = $('.search-result-page').data('search-query');

        ajaxSearchProducts(
            q,
            $('.categories-list__category-btn.active').data('category-id'),
            pageCount,
            $('.sort-filter'),
            showMoreFilterItems
        );
    }
    else if ($(this).hasClass('js-more-promo-products')) {
        ajaxPromoProducts(
            $('.categories-list__category-btn.active').data('category-id'),
            pageCount,
            $('.sort-filter'),
            showMoreFilterItems
        );
    }
    else if ($(this).hasClass('js-more-brand-products')) {
        var brand_id = $('[data-brand-id]').data('brand-id'),
            category_id = $('.categories-list__category-btn.active').data('category-id');

        ajaxBrandProducts(category_id, brand_id, pageCount, $('.sort-filter'), showMoreFilterItems);
    }
    else if ($(this).hasClass('js-more-account-orders')) {
        var last_year = $('.account-order-wrap:last').data('order-year');
        ajaxOrders(pageCount, last_year);
    }
    else if ($(this).hasClass('js-more-cashback-history')) {
        ajaxMoreCashbackHistory(pageCount);
    }
    else if ($(this).hasClass('js-more-news')) {
        ajaxNews(pageCount);
    }
})