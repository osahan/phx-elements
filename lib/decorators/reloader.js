import Timer from '../utils/timer';

const Reloader = function (options = {}) {
    if (!options || !options.reloaderMethodName) {
        throw new Error(
            'You need to pass reloaderMethodName for the reloader to work'
        );
    }

    return (target, name, descriptor) => {
        const connectedCallback =
            target.prototype.connectedCallback || function () {};
        const disconnectedCallback =
            target.prototype.disconnectedCallback || function () {};
        const browserVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                target.prototype?.reloadTimer?.pause();
            } else {
                target.prototype?.reloadTimer?.resume();
            }
        };

        let observer;

        target.prototype.connectedCallback = function () {
            connectedCallback.call(this);
            const reloadFn = target.prototype[options.reloaderMethodName].bind(
                this
            );

            target.prototype.reloadTimer = new Timer(() => {
                reloadFn();
                target.prototype.reloadTimer.resume();
            }, options.timer || 30000);

            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            target.prototype?.reloadTimer?.resume();
                        } else {
                            target.prototype?.reloadTimer?.pause();
                        }
                    });
                },
                {
                    threshold: [0.25, 0.5, 0.75, 1]
                }
            );

            // Browser Visibility
            document.addEventListener(
                'visibilitychange',
                browserVisibilityChange
            );
            // Intersection Observer
            observer.observe(this);
        };

        target.prototype.disconnectedCallback = function () {
            disconnectedCallback.call(this);
            target?.prototype?.reloadTimer?.cancel();
            observer?.unobserve(this);
            document.removeEventListener(
                'visibilitychange',
                browserVisibilityChange
            );
        };
    };
};

export default Reloader;
