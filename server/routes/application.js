const express = require('express');
const router = express.Router();

// import middleware
const {authCheck} = require("../middleware/auth")

// import controllers
const {createRoleApplication} = require("../controllers/application")


router.post("/application", authCheck, createRoleApplication)

module.exports = router