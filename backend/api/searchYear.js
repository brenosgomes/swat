const knex = require("../config/db");

module.exports = (app) => {
    const { existsOrError } = app.api.validator;

    const get = async (req, res) => {
        try {
            existsOrError(req.params.query, "tcc does not exist!");

            const getIdTcc = await knex("tcc")
                .where({ tcc_year: req.params.query });
            existsOrError(getIdTcc, "tcc not found");

            res.json(getIdTcc);
        } catch (msg) {
            return res.status(400).send(msg);
        }
    };
  
    return { get };
};
