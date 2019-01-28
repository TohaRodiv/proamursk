var notificationHideDelay = 4000,
    notificationTimeout;

$(function() {
    if (notificationCookieDetected()) showNotificationCookie();
})

$('.notification-wrapper').on('mouseenter', function() {
    clearTimeout(notificationTimeout);
})

$('.notification-wrapper').on('mouseleave', function() {
    notificationTimeout = setTimeout(hideNotification, notificationHideDelay / 4);
})

$('body').on('click', '.show-notification', function() {
    showNotification($(this).data('notification-message'), $(this).data('notification-type'));
})

$('body').on('click', '.notification__close', function() {
    hideNotification();
})

// Показывает уведомление
function showNotification(message, type) {
    if (message && type) {
        $('.notification-wrapper .notification__message').html(message);

        $('.notification-wrapper').removeClass('success error').addClass(type).addClass('visible');
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(hideNotification, notificationHideDelay);
    }
}

// Скрывает уведомление
function hideNotification() {
    $('.notification-wrapper').removeClass('visible');
}

// Проверка на существование в куках уведомлений для отображения
function notificationCookieDetected() {
    return (getCookie('notificationMessage') && getCookie('notificationType')) ? true : false;
}

// Записывает в куки сообщение на 10 сек, чтобы показать его после, например, после перезагрузки страницы
function setNotificationCookie(message, type) {
    setCookie('notificationMessage', message, {'expires' : 10 / (24 * 60 * 60), 'path' : '/', 'encode': true});
    setCookie('notificationType', type, {'expires' : 10 / (24 * 60 * 60), 'path' : '/'});
}

// Показывает сообщение из куков
function showNotificationCookie() {
    showNotification(getCookie('notificationMessage'), getCookie('notificationType'));
    deleteCookie('notificationMessage', {'path' : '/'});
    deleteCookie('notificationType', {'path' : '/'});
}