'use strict';

const Handlebars = require('handlebars');

Handlebars.strict = false;

Handlebars.registerHelper('isAdmin', function(options) {
    if (this.isAdminOrManager) {
        return options.fn(this.isAdminOrManager);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('isActive', function(expectedPath, currentPath) {
    return expectedPath === currentPath;
});

// Handlebars.registerHelper('isManager', function(role, options) {
//     return role === 'manager' ? options.fn(this) : options.inverse(this);
// });

module.exports = Handlebars;
