class ResizeObserver {
    constructor(callback) {
        this.observables = [];
        // Array of observed elements that looks like this:
        // [{
        //   el: domNode,
        //   size: {height: x, width: y}
        // }]
        this.boundCheck = this.check.bind(this);
        this.boundCheck();
        this.callback = callback;
    }

    observe(el) {
        if (this.observables.some((observable) => observable.el === el)) {
            return;
        }
        const newObservable = {
            el: el,
            size: {
                height: el.clientHeight,
                width: el.clientWidth,
            },
        };
        this.observables.push(newObservable);
    }

    unobserve(el) {
        this.observables = this.observables.filter((obj) => obj.el !== el);
    }

    disconnect() {
        this.observables = [];
    }

    check() {
        const changedEntries = this.observables.filter((obj) => {
            const currentHeight = obj.el.clientHeight;
            const currentWidth = obj.el.clientWidth;
            if (obj.size.height !== currentHeight || obj.size.width !== currentWidth) {
                obj.size.height = currentHeight;
                obj.size.width = currentWidth;
                return true;
            }
        }).map((obj) => obj.el);
        if (changedEntries.length > 0) {
            this.callback(changedEntries);
        }
        window.requestAnimationFrame(this.boundCheck);
    }
}

let lazyImageOuter = document.querySelectorAll('.lazy-image-outer');

function setProportionalSize(item) {
    let itemWidth = item.offsetWidth;
    let itemMaxWidth = item.dataset.width;
    let itemMaxHeight = item.dataset.height;

    if (itemWidth > itemMaxWidth) {
        item.style.maxWidth = itemMaxWidth + 'px';
        item.style.height = itemMaxHeight + 'px';
    }
    else {
        item.style.height = (itemWidth * itemMaxHeight / itemMaxWidth) + 'px';
    }
}

const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach( item => {
        setProportionalSize(item);
    });
});

lazyImageOuter.forEach( item => {
    setProportionalSize(item);
    resizeObserver.observe(item);
});