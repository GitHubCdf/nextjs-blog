"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSortedPostsData = getSortedPostsData;
exports.getAllPostIds = getAllPostIds;
exports.getPostData = getPostData;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _grayMatter = _interopRequireDefault(require("gray-matter"));

var _remark = require("remark");

var _remarkHtml = _interopRequireDefault(require("remark-html"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var postsDirectory = _path["default"].join(process.cwd(), 'posts');

function getSortedPostsData() {
  var fileNames = _fs["default"].readdirSync(postsDirectory);

  var allPostsData = fileNames.map(function (fileName) {
    // remove .md extension
    var id = fileName.replace(/\.md$/, ''); // read markdown as string

    var fullPath = _path["default"].join(postsDirectory, fileName);

    var fileContents = _fs["default"].readFileSync(fullPath, 'utf-8'); // use gray-matter to parse the post metadata section


    var matterResult = (0, _grayMatter["default"])(fileContents); // combine the data with id

    return _objectSpread({
      id: id
    }, matterResult.data);
  }); // sort posts by date

  allPostsData.sort(function (_ref, _ref2) {
    var a = _ref.date;
    var b = _ref2.date;

    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
  return allPostsData;
}

function getAllPostIds() {
  var fileNames = _fs["default"].readdirSync(postsDirectory);

  return fileNames.map(function (fileName) {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    };
  });
}

function getPostData(id) {
  var fullPath, fileContents, matterResult, processedContent, contentHtml;
  return regeneratorRuntime.async(function getPostData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          fullPath = _path["default"].join(postsDirectory, "".concat(id, ".md"));
          fileContents = _fs["default"].readFileSync(fullPath, 'utf-8'); // Use gray-matter to parse the post metadata section 

          matterResult = (0, _grayMatter["default"])(fileContents); // Use remark to convert markdown conetent into HTML string

          _context.next = 5;
          return regeneratorRuntime.awrap((0, _remark.remark)().use(_remarkHtml["default"]).process(matterResult.content));

        case 5:
          processedContent = _context.sent;
          contentHtml = processedContent.toString();
          return _context.abrupt("return", _objectSpread({
            id: id,
            contentHtml: contentHtml
          }, matterResult.data));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}