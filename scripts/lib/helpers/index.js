'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const utils_1 = __importDefault(require('../utils'));
const getAllFromColection = db => collectionName =>
  __awaiter(void 0, void 0, void 0, function*() {
    const snapshot = yield db.collection(collectionName).get();
    return utils_1.default.snapshotToArray(snapshot);
  });
function parseMatchObj(matchObj) {
  const entries = Object.entries(matchObj);
  let result = Object.assign({}, matchObj);
  entries.forEach(entry => {
    const [key, value] = entry;
    if (value === 'true') result[key] = true;
    if (value === 'false') result[key] = false;
  });
  return result;
}
function matchDocuments(documents, matchObj) {
  const parsedMatchObj = parseMatchObj(matchObj);
  const entries = Object.entries(parsedMatchObj);
  let result = documents;
  entries.forEach(entry => {
    const [key, value] = entry;
    result = documents.filter(item => item[key] === value);
  });
  return result;
}
exports.default = {
  getAllFromColection,
  matchDocuments
};
//# sourceMappingURL=index.js.map
