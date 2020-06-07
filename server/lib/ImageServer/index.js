import * as Routes from './Routes/index.js';
import path from 'path';

export default class ImageServer extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.options = this.app.config.server;
        this.engine = APP;
        this.label = 'IMAGESERVER';

        LOG(this.label, 'INIT');

        this.on('listen', () => LOG(this.label, 'LISTEN ON PORT:', this.options.port));

        this.registerRoutes();
        this.registerFrontend();

        // listen on the given port
        return this.start();
    }

    start() {
        return new Promise((resolve, reject) => {
            this.engine.listen(this.options.port, () => {
                resolve(this);
                this.emit('listen');
            });
        });
    }

    stop() {
        //..
    }

    registerRoutes() {
        Object.keys(Routes).forEach(route => this.engine.use(`/${this.options.rootURLPath}`, new Routes[route](this)));
    }

    registerFrontend() {
        this.frontendPath = path.resolve('../frontend/dist');
        this.engine.use(EXPRESS.static(this.frontendPath));
    }
}
