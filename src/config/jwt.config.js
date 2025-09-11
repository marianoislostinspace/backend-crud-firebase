require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || process.env.JWTPASSWORD,
  JWT_EXPIRES: "2h"
};
