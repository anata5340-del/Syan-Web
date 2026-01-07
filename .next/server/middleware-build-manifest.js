self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/admin": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin.js"
    ],
    "/admin/library": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/library.js"
    ],
    "/admin/videoCourses": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/videoCourses.js"
    ],
    "/admin/videoCourses/modules": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/videoCourses/modules.js"
    ],
    "/admin/videoCourses/modules/addContent": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/videoCourses/modules/addContent.js"
    ],
    "/login": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/login.js"
    ],
    "/user": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user.js"
    ],
    "/user/videoCourses": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user/videoCourses.js"
    ],
    "/user/videoCourses/[id]/modules": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user/videoCourses/[id]/modules.js"
    ],
    "/user/videoCourses/[id]/modules/dashboard": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user/videoCourses/[id]/modules/dashboard.js"
    ],
    "/user/videoCourses/[id]/modules/dashboard/videos/[videoId]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user/videoCourses/[id]/modules/dashboard/videos/[videoId].js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];