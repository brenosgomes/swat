const { authSecret } = require("../.env");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const knex = require("../config/db");

module.exports = (app) => {
  const signIn = async (req, res) => {
    if (!req.body.teacher_email || !req.body.teacher_password) {
      return res.status(400).send("Insira teacher, senha");
    }

    const user = await knex("teacher")
      .where({ teacher_email: req.body.teacher_email })
      .first();

    if (!user) return res.status(400).send("teacher não encontrado");

    const isMatch = bcrypt.compareSync(
      req.body.teacher_password,
      user.teacher_password
    );
    if (!isMatch)
      return res.status(401).send("Combinação de teacher e senha inválida!");

    const now = Date.now();

    payload = {
      id: user.teacher_id,
      email: user.teacher_email,
      password: user.teacher_password,
      name: user.teacher_name,
      departament: user.teacher_departament,
      collegiate: user.teacher_collegiate,
      iat: now,
      exp: now + 1000 * 60 * 60 * 24,
    };

    res.json({
      ...payload,
      token: jwt.encode(payload, authSecret),
    });
  };

  const validateToken = (req, res) => {
    const { userData } = req.body || null;

    try {
      if (userData) {
        const token = jwt.decode(userData.token, authSecret);
        if (new Date(token.exp * 1000) > new Date()) {
          return res.status(200).json({
            success: true,
            name: token.name,
            departament: token.departament,
            collegiate: token.collegiate,
          });
        }
      }
    } catch (e) {
      res.status(401);
    }
    res.send(false);
  };

  return { signIn, validateToken };
};
