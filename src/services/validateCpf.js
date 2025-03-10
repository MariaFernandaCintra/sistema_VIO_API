const connect = require('../db/connect');

module.exports = async function validateCpf(cpf, userId){
    const query = "SELECT id_usuario FROM usuario WHERE cpf=?";
    const values = [cpf];

    connect.query(query, values, (err, results) => {
        if(err){
            //Fazer algo
        }
        else if(results.length > 0){
            const id_cpfCadastrado = results[0].id_usuario;

            if(userId && id_cpfCadastrado != userId){
                return {error:"CPF já cadstrado para outro usuário!!"}
            }else if(!userId){
                return {error: "CPF já cadastrado!!"}
            }
        }
        else{
            return null;
        }
    })
}