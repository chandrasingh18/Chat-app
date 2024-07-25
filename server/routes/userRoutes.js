const { register, login, setAvatar } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);

router.get("/allUsers/:id", )

module.exports = router;