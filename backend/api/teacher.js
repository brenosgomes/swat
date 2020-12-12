const knex = require("../config/db");
const bcrypt = require("bcryptjs");
const fs = require("fs");

module.exports = (app) => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator;

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    };

    const get = async (req, res) => {
        const teacher = await knex("teacher").select("*");
        return res.json(teacher);
    };

    const getById = async (req, res) => {
        try {
            existsOrError(req.params.id, "teacher não existe!");

            const getIdTeacher = await knex("teacher")
                .where({ teacher_id: req.params.id })
                .first();
            existsOrError(getIdTeacher, "teacher não encontrado");

            res.json(getIdTeacher);
        } catch (msg) {
            return res.status(400).send(msg);
        }
    };

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, "teacher não existe!");

            const rows = await knex("teacher")
                .where({ teacher_id: req.params.id })
                .first();

            const removeTeacher = await knex("teacher")
                .del()
                .where({ teacher_id: req.params.id });

            existsOrError(removeTeacher, "teacher não encontrado");

            fs.unlink(`tmp/uploads/${rows.teacher_key}`, (err) => {
                if (err) {
                    console.log(err);
                } else {
                console.log("removed");
                }
            });

            console.log(rows.tcc_key);

            res.status(204).send();
        } catch (msg) {
            console.log(msg)
            return res.status(400).send(msg);
        }
    };

    const post = async (req, res) => {
        let {
            teacher_name,
            teacher_email,
            teacher_password,
            teacher_department,
            teacher_collegiate,
            teacher_admin,
            teacher_confirm_password,
        } = req.body;
        if (!req.body.url)
        req.body.url = `http://localhost:5000/files/${req.file.filename}`;
        try {
            existsOrError(teacher_email, "teacher não informado");
            existsOrError(teacher_password, "Senha não informada");
            existsOrError(teacher_confirm_password, "Confirmação de senha invalida");
            equalsOrError(teacher_password, teacher_confirm_password, "Senhas não conferem");

            const teacherFromDB = await knex("teacher")
                .where({ teacher_email: teacher_email })
                .first();
            if (!teacher_email) {
                notExistsOrError(teacherFromDB, "teacher já cadastrado");
                res.status(400);
            }

            teacher_password = encryptPassword(teacher_password);
            delete teacher_confirm_password;

            const finalTeacher = await knex("teacher").insert({
                teacher_name,
                teacher_email,
                teacher_password,
                teacher_department,
                teacher_collegiate,
                teacher_admin,
                teacher_size: req.file.size,
                teacher_key: req.file.filename,
                teacher_url: req.body.url,
            });

            res.json({id_teacher:finalTeacher[0], profile_pic: req.body.url});
        } catch (msg) {
            console.log(msg);
            return res.status(400).send(msg);
        }
    };

    const put = async (req, res) => {
        let { teacher_password, teacher_confirm_password } = req.body;
        const teacher_id = req.params.id;
        try {
            existsOrError(teacher_password, "Senha não informada");
            existsOrError(teacher_confirm_password, "Confirmação de senha invalida");
            equalsOrError(teacher_password, teacher_confirm_password, "Senhas não conferem");
            
            teacher_password = encryptPassword(teacher_password);
            delete teacher_confirm_password

            const attTeacher = await knex("teacher")
                .update(teacher_password)
                .where({ teacher_id: teacher_id });
            existsOrError(attTeacher, "teacher not found");

            res.status(200).send(attTeacher);
        } catch (msg) {
            return res.status(400).send(msg);
        }
    };

    return { get, getById, post, put, remove };
};