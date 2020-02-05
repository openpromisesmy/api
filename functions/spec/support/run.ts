import jasmine from 'jasmine';

const jasmineEnv = new Jasmine();

jasmineEnv.loadConfigFile('./spec/support/jasmine.json');

jasmineEnv.onComplete(haveAllTestsPassed => {
  if (haveAllTestsPassed) {
    process.exit(0);
  } else {
    process.exit(1);
  }

  return;
});

jasmineEnv.execute();
