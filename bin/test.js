const path = require('path'),

    Jasmine = require('jasmine'),
    SpecReporter = require('jasmine-spec-reporter');

let jasmine = new Jasmine();

jasmine.loadConfigFile(path.join(process.cwd(), "spec/support/jasmine.json"));

jasmine.env.clearReporters();
// jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL =  24 * 60 * 60 * 1000;
jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;

jasmine.addReporter(new SpecReporter({
    displayStacktrace: true
}));

jasmine.execute();