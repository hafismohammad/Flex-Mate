"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Example route
router.get('/signup', (req, res) => {
    res.send('User registration');
});
exports.default = router;
