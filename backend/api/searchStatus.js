const knex = require("../config/db");

module.exports = (app) => {
    const { existsOrError } = app.api.validator;

    const get = async (req, res) => {
        try {
            existsOrError(req.params.query, "tcc does not exist!");

            const TCCs = await knex("tcc")
                .where({ tcc_status: req.params.query });
            TCCs ? res.json(TCCs) : res.json("");

        } catch (msg) {
            return res.status(400).send(msg);
        }
    };
  
    return { get };
};
