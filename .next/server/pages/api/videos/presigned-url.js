"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/videos/presigned-url";
exports.ids = ["pages/api/videos/presigned-url"];
exports.modules = {

/***/ "@aws-sdk/client-s3":
/*!*************************************!*\
  !*** external "@aws-sdk/client-s3" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-s3");

/***/ }),

/***/ "@aws-sdk/s3-request-presigner":
/*!************************************************!*\
  !*** external "@aws-sdk/s3-request-presigner" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/s3-request-presigner");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fvideos%2Fpresigned-url&preferredRegion=&absolutePagePath=.%2Fsrc%2Fpages%2Fapi%2Fvideos%2Fpresigned-url%2Findex.ts&middlewareConfigBase64=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fvideos%2Fpresigned-url&preferredRegion=&absolutePagePath=.%2Fsrc%2Fpages%2Fapi%2Fvideos%2Fpresigned-url%2Findex.ts&middlewareConfigBase64=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/future/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(api)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _src_pages_api_videos_presigned_url_index_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/pages/api/videos/presigned-url/index.ts */ \"(api)/./src/pages/api/videos/presigned-url/index.ts\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_src_pages_api_videos_presigned_url_index_ts__WEBPACK_IMPORTED_MODULE_3__, \"default\"));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_src_pages_api_videos_presigned_url_index_ts__WEBPACK_IMPORTED_MODULE_3__, \"config\");\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/videos/presigned-url\",\n        pathname: \"/api/videos/presigned-url\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\"\n    },\n    userland: _src_pages_api_videos_presigned_url_index_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRnZpZGVvcyUyRnByZXNpZ25lZC11cmwmcHJlZmVycmVkUmVnaW9uPSZhYnNvbHV0ZVBhZ2VQYXRoPS4lMkZzcmMlMkZwYWdlcyUyRmFwaSUyRnZpZGVvcyUyRnByZXNpZ25lZC11cmwlMkZpbmRleC50cyZtaWRkbGV3YXJlQ29uZmlnQmFzZTY0PWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDTDtBQUMxRDtBQUMwRTtBQUMxRTtBQUNBLGlFQUFlLHdFQUFLLENBQUMseUVBQVEsWUFBWSxFQUFDO0FBQzFDO0FBQ08sZUFBZSx3RUFBSyxDQUFDLHlFQUFRO0FBQ3BDO0FBQ08sd0JBQXdCLGdIQUFtQjtBQUNsRDtBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxZQUFZO0FBQ1osQ0FBQzs7QUFFRCIsInNvdXJjZXMiOlsid2VicGFjazovL3N5YW4vP2VmYjkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZXNBUElSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL3BhZ2VzLWFwaS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBob2lzdCB9IGZyb20gXCJuZXh0L2Rpc3QvYnVpbGQvdGVtcGxhdGVzL2hlbHBlcnNcIjtcbi8vIEltcG9ydCB0aGUgdXNlcmxhbmQgY29kZS5cbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIuL3NyYy9wYWdlcy9hcGkvdmlkZW9zL3ByZXNpZ25lZC11cmwvaW5kZXgudHNcIjtcbi8vIFJlLWV4cG9ydCB0aGUgaGFuZGxlciAoc2hvdWxkIGJlIHRoZSBkZWZhdWx0IGV4cG9ydCkuXG5leHBvcnQgZGVmYXVsdCBob2lzdCh1c2VybGFuZCwgXCJkZWZhdWx0XCIpO1xuLy8gUmUtZXhwb3J0IGNvbmZpZy5cbmV4cG9ydCBjb25zdCBjb25maWcgPSBob2lzdCh1c2VybGFuZCwgXCJjb25maWdcIik7XG4vLyBDcmVhdGUgYW5kIGV4cG9ydCB0aGUgcm91dGUgbW9kdWxlIHRoYXQgd2lsbCBiZSBjb25zdW1lZC5cbmV4cG9ydCBjb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBQYWdlc0FQSVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5QQUdFU19BUEksXG4gICAgICAgIHBhZ2U6IFwiL2FwaS92aWRlb3MvcHJlc2lnbmVkLXVybFwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3ZpZGVvcy9wcmVzaWduZWQtdXJsXCIsXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgYXJlbid0IHVzZWQgaW4gcHJvZHVjdGlvbi5cbiAgICAgICAgYnVuZGxlUGF0aDogXCJcIixcbiAgICAgICAgZmlsZW5hbWU6IFwiXCJcbiAgICB9LFxuICAgIHVzZXJsYW5kXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnZXMtYXBpLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fvideos%2Fpresigned-url&preferredRegion=&absolutePagePath=.%2Fsrc%2Fpages%2Fapi%2Fvideos%2Fpresigned-url%2Findex.ts&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./src/pages/api/videos/presigned-url/index.ts":
/*!*****************************************************!*\
  !*** ./src/pages/api/videos/presigned-url/index.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aws-sdk/client-s3 */ \"@aws-sdk/client-s3\");\n/* harmony import */ var _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _aws_sdk_s3_request_presigner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aws-sdk/s3-request-presigner */ \"@aws-sdk/s3-request-presigner\");\n/* harmony import */ var _aws_sdk_s3_request_presigner__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_s3_request_presigner__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst s3 = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.S3Client({\n    region: process.env.AWS_REGION,\n    credentials: {\n        accessKeyId: process.env.AWS_ACCESS_KEY_ID,\n        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY\n    }\n});\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        const { fileName, fileType } = req.body;\n        try {\n            const command = new _aws_sdk_client_s3__WEBPACK_IMPORTED_MODULE_0__.PutObjectCommand({\n                Bucket: process.env.AWS_BUCKET_NAME,\n                Key: fileName,\n                ContentType: fileType\n            });\n            const signedUrl = await (0,_aws_sdk_s3_request_presigner__WEBPACK_IMPORTED_MODULE_1__.getSignedUrl)(s3, command, {\n                expiresIn: 3600\n            });\n            res.status(200).json({\n                signedUrl,\n                url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`\n            });\n        } catch (error) {\n            console.error(\"Error generating signed URL:\", error);\n            res.status(500).json({\n                error: \"Failed to generate signed URL\"\n            });\n        }\n    } else {\n        res.status(405).json({\n            error: \"Method not allowed\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3ZpZGVvcy9wcmVzaWduZWQtdXJsL2luZGV4LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQWdFO0FBQ0g7QUFHN0QsTUFBTUcsS0FBSyxJQUFJSCx3REFBUUEsQ0FBQztJQUN0QkksUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxVQUFVO0lBQzlCQyxhQUFhO1FBQ1hDLGFBQWFKLFFBQVFDLEdBQUcsQ0FBQ0ksaUJBQWlCO1FBQzFDQyxpQkFBaUJOLFFBQVFDLEdBQUcsQ0FBQ00scUJBQXFCO0lBQ3BEO0FBQ0Y7QUFFZSxlQUFlQyxRQUM1QkMsR0FBbUIsRUFDbkJDLEdBQW9CO0lBRXBCLElBQUlELElBQUlFLE1BQU0sS0FBSyxRQUFRO1FBQ3pCLE1BQU0sRUFBRUMsUUFBUSxFQUFFQyxRQUFRLEVBQUUsR0FBR0osSUFBSUssSUFBSTtRQUV2QyxJQUFJO1lBQ0YsTUFBTUMsVUFBVSxJQUFJbkIsZ0VBQWdCQSxDQUFDO2dCQUNuQ29CLFFBQVFoQixRQUFRQyxHQUFHLENBQUNnQixlQUFlO2dCQUNuQ0MsS0FBS047Z0JBQ0xPLGFBQWFOO1lBQ2Y7WUFFQSxNQUFNTyxZQUFZLE1BQU12QiwyRUFBWUEsQ0FBQ0MsSUFBSWlCLFNBQVM7Z0JBQUVNLFdBQVc7WUFBSztZQUVwRVgsSUFBSVksTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztnQkFDbkJIO2dCQUNBSSxLQUFLLENBQUMsUUFBUSxFQUFFeEIsUUFBUUMsR0FBRyxDQUFDZ0IsZUFBZSxDQUFDLElBQUksRUFBRWpCLFFBQVFDLEdBQUcsQ0FBQ0MsVUFBVSxDQUFDLGVBQWUsRUFBRVUsU0FBUyxDQUFDO1lBQ3RHO1FBQ0YsRUFBRSxPQUFPYSxPQUFPO1lBQ2RDLFFBQVFELEtBQUssQ0FBQyxnQ0FBZ0NBO1lBQzlDZixJQUFJWSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO2dCQUFFRSxPQUFPO1lBQWdDO1FBQ2hFO0lBQ0YsT0FBTztRQUNMZixJQUFJWSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVFLE9BQU87UUFBcUI7SUFDckQ7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3N5YW4vLi9zcmMvcGFnZXMvYXBpL3ZpZGVvcy9wcmVzaWduZWQtdXJsL2luZGV4LnRzPzRkMDUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUzNDbGllbnQsIFB1dE9iamVjdENvbW1hbmQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LXMzXCI7XG5pbXBvcnQgeyBnZXRTaWduZWRVcmwgfSBmcm9tIFwiQGF3cy1zZGsvczMtcmVxdWVzdC1wcmVzaWduZXJcIjtcbmltcG9ydCB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tIFwibmV4dFwiO1xuXG5jb25zdCBzMyA9IG5ldyBTM0NsaWVudCh7XG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTiEsXG4gIGNyZWRlbnRpYWxzOiB7XG4gICAgYWNjZXNzS2V5SWQ6IHByb2Nlc3MuZW52LkFXU19BQ0NFU1NfS0VZX0lEISxcbiAgICBzZWNyZXRBY2Nlc3NLZXk6IHByb2Nlc3MuZW52LkFXU19TRUNSRVRfQUNDRVNTX0tFWSEsXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2Vcbikge1xuICBpZiAocmVxLm1ldGhvZCA9PT0gXCJQT1NUXCIpIHtcbiAgICBjb25zdCB7IGZpbGVOYW1lLCBmaWxlVHlwZSB9ID0gcmVxLmJvZHk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBQdXRPYmplY3RDb21tYW5kKHtcbiAgICAgICAgQnVja2V0OiBwcm9jZXNzLmVudi5BV1NfQlVDS0VUX05BTUUhLFxuICAgICAgICBLZXk6IGZpbGVOYW1lLFxuICAgICAgICBDb250ZW50VHlwZTogZmlsZVR5cGUsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2lnbmVkVXJsID0gYXdhaXQgZ2V0U2lnbmVkVXJsKHMzLCBjb21tYW5kLCB7IGV4cGlyZXNJbjogMzYwMCB9KTtcblxuICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICBzaWduZWRVcmwsXG4gICAgICAgIHVybDogYGh0dHBzOi8vJHtwcm9jZXNzLmVudi5BV1NfQlVDS0VUX05BTUV9LnMzLiR7cHJvY2Vzcy5lbnYuQVdTX1JFR0lPTn0uYW1hem9uYXdzLmNvbS8ke2ZpbGVOYW1lfWAsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGdlbmVyYXRpbmcgc2lnbmVkIFVSTDpcIiwgZXJyb3IpO1xuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJGYWlsZWQgdG8gZ2VuZXJhdGUgc2lnbmVkIFVSTFwiIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXMuc3RhdHVzKDQwNSkuanNvbih7IGVycm9yOiBcIk1ldGhvZCBub3QgYWxsb3dlZFwiIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiUzNDbGllbnQiLCJQdXRPYmplY3RDb21tYW5kIiwiZ2V0U2lnbmVkVXJsIiwiczMiLCJyZWdpb24iLCJwcm9jZXNzIiwiZW52IiwiQVdTX1JFR0lPTiIsImNyZWRlbnRpYWxzIiwiYWNjZXNzS2V5SWQiLCJBV1NfQUNDRVNTX0tFWV9JRCIsInNlY3JldEFjY2Vzc0tleSIsIkFXU19TRUNSRVRfQUNDRVNTX0tFWSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJmaWxlTmFtZSIsImZpbGVUeXBlIiwiYm9keSIsImNvbW1hbmQiLCJCdWNrZXQiLCJBV1NfQlVDS0VUX05BTUUiLCJLZXkiLCJDb250ZW50VHlwZSIsInNpZ25lZFVybCIsImV4cGlyZXNJbiIsInN0YXR1cyIsImpzb24iLCJ1cmwiLCJlcnJvciIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/videos/presigned-url/index.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fvideos%2Fpresigned-url&preferredRegion=&absolutePagePath=.%2Fsrc%2Fpages%2Fapi%2Fvideos%2Fpresigned-url%2Findex.ts&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();