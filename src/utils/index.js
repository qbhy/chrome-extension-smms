export function backTop(callback) {
    !window.returnTopTimer || clearInterval(window.returnTopTimer);
    let speed = 20,
        bs = 2;
    window.returnTopTimer = setInterval(function () {
        if (document.body.scrollTop < speed) {
            window.scrollTo(0, 0);
            clearInterval(window.returnTopTimer);
            if (callback) {
                callback();
            }
        } else {
            window.scrollBy(0, -(speed + (speed / 2 * bs++)));
        }
    }.bind(speed), 20);
}
export function delay(timeout = 500) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

export function copyText(value) {
    const save = function (e) {
        e.clipboardData.setData('text/plain', value);
        e.preventDefault();
    };
    document.addEventListener('copy', save);
    document.execCommand('copy');
    document.removeEventListener('copy', save);
}