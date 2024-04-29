const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
var hbs = require('hbs');
const exphbs = require('express-handlebars');
const helpers = require('./helpers');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./models/index').sequelize;

const sessionStore = new SequelizeStore({
    db: sequelize,
});

require('./models/index');

dotenv.config({ path: '.env' });

app.use(session({
    secret: 'i am key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials');

app.engine('hbs', exphbs.engine({
    helpers: helpers,
    extname: 'hbs',
    defaultLayout: false,
    runtimeOptions:{allowProtoPropertiesByDefault:true,
        allowedProtoMethodsByDefault:true}
}));
app.set('view engine', 'hbs');

const routesUrl = require ('./routes/route_url');
app.use('/', routesUrl);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0' , () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
