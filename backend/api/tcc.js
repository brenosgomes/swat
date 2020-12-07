const knex = require("../config/db");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

module.exports = (app) => {
    const { existsOrError } = app.api.validator;

    const get = async (req, res) => {
        const tcc = await knex("tcc").select("*");
        return res.json(tcc)
    }

    const getById = async (req, res) => {
        try {
            existsOrError(req.params.id, "tcc does not exist!");

            const getIdTcc = await knex("tcc")
                .where({ tcc_id: req.params.id });
            existsOrError(getIdTcc, "tcc not found");

            res.json(getIdTcc);
        } catch (msg) {
            return res.status(400).send(msg);
        }
    };

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, "tcc does not exist!");

            const rows = await knex("tcc")
                .where({ tcc_id: req.params.id })
                .first();

            const removeTcc = await knex("tcc")
                .del()
                .where({ tcc_id: rows.tcc_id });

            existsOrError(removeTcc, "tcc not found");

            fs.unlink(`tmp/tcc/${rows.tcc_key}`, (err) => {
                if (err) {
                    console.log(err);
                } else {
                console.log("removed");
                }
            });

            fs.unlink(`tmp/cover/${rows.tcc_cover_key}`, (err) => {
                if (err) {
                    console.log(err);
                } else {
                console.log("removed");
                }
            });

            res.status(204).send();
        } catch (msg) {
            return res.status(400).send(msg);
        }
    };

    const post = async (req, res) => {
        let {
            teacher_id,
            tcc_title,
            tcc_author,
            tcc_comments,
            tcc_summary,
            tcc_specialization,
            tcc_year,
            tcc_area,
            tcc_status,
        } = req.body;

        if (!req.body.tcc_url) req.body.tcc_url = `http://localhost:5000/files/${req.files['file'][0].filename}`;
        if (!req.body.tcc_cover_url) req.body.tcc_cover_url = `http://localhost:5000/files/${req.files['cover'][0].filename}`;

        try {
            const newtcc = await knex("tcc").insert({
                teacher_id,
                tcc_title,
                tcc_author,
                tcc_comments,
                tcc_summary,
                tcc_specialization,
                tcc_year,
                tcc_area,
                tcc_status,
                tcc_size: req.files['file'][0].size,
                tcc_key: req.files['file'][0].filename,
                tcc_url: req.body.tcc_url,
                tcc_cover_size: req.files['cover'][0].size,
                tcc_cover_key: req.files['cover'][0].filename,
                tcc_cover_url: req.body.tcc_cover_url,
            });
            return res.json(newtcc);
        } catch (err) {
            return res.status(500).send(err);
        }
    };
    
    return { get, getById, post, remove };
};
