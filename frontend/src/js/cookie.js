// Возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Устанавливает cookie с именем name, значением value и доп. настройками в объекте options = { expires, path, domain, secure, encode} expires — количество дней
function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires,
        encode = options.encode;

    if (typeof expires == "number" && expires) {
        var d = new Date();

        d.setTime(d.getTime() + (expires * 24 * 60 * 60 * 1000));
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) options.expires = expires.toUTCString();
    if (encode) value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;

        var propValue = options[propName];

        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

// Удаляет cookie
function deleteCookie(name, options) {
    var options = options;

    options.expires = -1;
    setCookie(name, "", options);
}