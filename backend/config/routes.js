const multer = require("multer");
const multerConfig = require("../config/multer");

module.exports = app => {
    app.route("/teacher")
        .get(app.api.teacher.get)
        .post(multer(multerConfig).single("photograph"), app.api.teacher.post)

    app.route("/teacher/:id")
        .get(app.api.teacher.getById)
        .delete(app.api.teacher.remove)
        .put(app.api.teacher.put)

    app.route("/tcc")
        .get(app.api.tcc.get)
        .post(multer(multerConfig).fields([{name: "file", maxCount: "1"}, {name: "cover", maxCount: "1"}]), app.api.tcc.post)

    app.route("/tcc/:id")
        .get(app.api.tcc.getById)
        .delete(app.api.tcc.remove)

    app.route("/searchAuthor/:query").get(app.api.searchAuthor.get)
    app.route("/searchYear/:query").get(app.api.searchYear.get)
    app.route("/searchTitle/:query").get(app.api.searchTitle.get)
    app.route("/searchArea/:query").get(app.api.searchArea.get)
    app.route("/searchStatus/:query").get(app.api.searchStatus.get)

    app.route("/auth").post(app.api.teacherAuth.signIn)
    app.route("/validateToken").post(app.api.teacherAuth.validateToken)
}