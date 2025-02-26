//Importa a instância do Express configurada em index.js
const app = require("./index");
const cors = require('cors');

//configuração do cors com origens permitidas
const corsOptions = {
    origin: '*', //substitua pela origem permitida
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', //metodos http permitidos 
    crendentials: true, //permite o uso de cookies e credenciais 
    optionsSucessStatus: 204, //define o statusde resposta para o metodo OPTIONS
};

//Inicia o servidor na porta 5000, tornando a API acessível em http://localhost:5000
app.use(cors(corsOptions));
app.listen(5000);


// http://localhost:5000/api/v1/user

//http://localhost:5000/api/v1//organizador