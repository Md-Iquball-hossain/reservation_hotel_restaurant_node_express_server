import App from './app/app';
import config from './config/config';

const app = new App(config.PORT);
app.startServer();
