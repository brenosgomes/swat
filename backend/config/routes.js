const multer = require("multer");
const multerConfig = require("../config/multer");
const multerCongigTCC = require("../config/multerTCC");

module.exports = app => {
    app.route("/teacher")
        .get(app.api.teacher.get)
        .post(multer(multerConfig).single("file"), app.api.teacher.post)

    app.route("/tcc")
        .get(app.api.tcc.get)
        .post(multer(multerCongigTCC).fields([{name: "file", maxCount: "1"}, {name: "cover", maxCount: "1"}]), app.api.tcc.post)

    app.route("/auth").post(app.api.teacherAuth.signIn)
    app.route("/validateToken").post(app.api.teacherAuth.validateToken)
}