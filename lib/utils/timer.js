export default function (callback, delay) {
    var timerId = null,
        start,
        remaining = Number(delay);

    this.delay = delay;

    this.remaining = () => {
        return Math.max(remaining + start - Number(new Date()), 0);
    };

    this.cancel = () => {
        clearTimeout(timerId);
        this.cancelled = true;
    };

    this.pause = () => {
        clearTimeout(timerId);
        remaining -= Number(new Date()) - start;
        this.paused = true;
    };

    this.resume = () => {
        start = Number(new Date());
        clearTimeout(timerId);
        timerId = setTimeout(callback, remaining);
        this.paused = false;
    };

    this.resume();
}
