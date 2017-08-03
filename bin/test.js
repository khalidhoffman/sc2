const fs = require('fs'),
    path = require('path'),
    Mocha = require('mocha'),

    mocha = new Mocha({ui: 'bdd'}),
    testDir = path.join(process.cwd(), 'test/'),
    testDirFiles = fs.readdirSync(testDir).filter(file => {
        return file.match(/-spec.js$/);
    });

testDirFiles.forEach(file => {
    mocha.addFile(path.join(testDir, file));
});

mocha.run();