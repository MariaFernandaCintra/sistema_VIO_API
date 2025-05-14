const router = require('express').Router()
const verifyJWT = require("../services/VerifyJWT")

const organizadorController = require('../controllers/organizadorController');
const userController = require("../controllers/userController")
const eventoController = require("../controllers/eventoController");
const ingressoController = require('../controllers/ingressoController');

router.post("/user", userController.createUser);
router.get("/user",  verifyJWT,userController.getAllUsers);
router.put("/user", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);
router.post("/login", userController.loginUser);

router.post("/organizador", organizadorController.createOrganizador);
router.get("/organizador", organizadorController.getAllOrganizadores);
router.put("/organizador", organizadorController.updateOrganizador);
router.delete("/organizador/:id", organizadorController.deleteOrganizador);

//rotas eventoControler
router.post("/evento", eventoController.createEvento);
router.get("/evento",verifyJWT, eventoController.getAllEventos);
router.put("/evento", eventoController.updateEvento);
router.delete("/evento/:id", eventoController.deleteEvento);
router.get("/evento/data", eventoController.getEventosPorData);
router.get("/evento/:data", verifyJWT, eventoController.getEventosSeteDias)

//rotas ingressoContoller
router.post("/ingresso", ingressoController.createIngresso);
router.get("/ingresso", ingressoController.getAllIngresso);
router.put("/ingresso", ingressoController.updateIngresso);
router.delete("/ingresso/:id", ingressoController.deleteingresso);
router.get("/ingresso/evento/:id_evento", ingressoController.getByIdEvento);

module.exports = router;