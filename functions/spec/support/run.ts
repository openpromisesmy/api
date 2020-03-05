import Jasmine from 'jasmine';

const jasmineEnv = new Jasmine({});

jasmineEnv.onComplete((haveAllTestsPassed: boolean) => {
  if (haveAllTestsPassed) {
    process.exit(0);
  } else {
    process.exit(1);
  }

  return;
});

jasmineEnv.execute();
