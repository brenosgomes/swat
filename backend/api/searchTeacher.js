const knex = require("../config/db");

module.exports = (app) => {
    const { existsOrError } = app.api.validator;

    const get = async (req, res) => {
        try {
            existsOrError(req.params.id, "tcc does not exist!");

            const TCCs = await knex("tcc")
                .where({ teacher_id: req.params.id });
            TCCs ? res.json(TCCs) : res.json("");

        } catch (msg) {
            return res.status(400).send(msg);
        }
    };
  
    return { get };
};
