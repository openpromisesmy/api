const promisify = (f: any, ...params: any[]) => {
  return new Promise((resolve, reject) => {
    f(...params, (e: ErrorEvent, result: any) => {
      if (e) {
        return reject(e);
      }

      return resolve(result);
    });
  });
};

module.exports = promisify;
