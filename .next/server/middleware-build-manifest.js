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
    "/unauthorized": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/unauthorized.js"
    ],
    "/user/videoCourses/[id]/modules/dashboard/notes/[noteId]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user/videoCourses/[id]/modules/dashboard/notes/[noteId].js"
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