const connect = require("../db/connect");

module.exports = class ingressoController{
    static async createIngresso (req, res){
        const {preco, tipo, fk_id_evento} = req.body;

        if (!preco || !tipo || !fk_id_evento) {
            return res.status(400).json({error: "Todos os campos devem ser preenchidos!"});
        }
        if (tipo.toLowerCase() != "vip" && tipo.toLowerCase() != "pista"){
            return res.status(400).json({error: "Tipo de ingresso não compativel!"});
        }

        const query = `INSERT INTO ingresso (preco, tipo, fk_id_evento) VALUES (?, ?, ?)`;
        const values = [preco, tipo,fk_id_evento];

        try{
            connect.query(query, values, (err) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao criar ingresso!"});

                }
                return res.status(201).json({message: "Ingresso criado com sucesso!"});
            })
        } catch (error){
            console.log("Erro ao executar consulta: ", error);
            return res.status(500).json({error: "Error interno do servidor!"});
        }

    }

    static async getAllIngresso(req, res){
        const query = `SELECT * FROM ingresso`;

        try{
            connect.query(query, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao buscar ingresso!"});
                }
                return res.status(200).json({message:"Ingressos listados com sucesso", events: results})
            })
        } catch(error){
            console.log("Erro ao execultar a consulta!", error);
            return res.status(500).json({error: "Error interno no servidor!"});
        }

    }

    static async updateIngresso (req, res){
        const {id_ingresso, preco, tipo, fk_id_evento} = req.body

        if (!id_ingresso || !preco || !tipo || !fk_id_evento){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos!"});
        } 
        if (tipo.toLowerCase() != "vip" && tipo.toLowerCase() != "pista"){
            return res.status(400).json({error: "Tipo de ingresso não compativel!"});
        }

        const query = `UPDATE ingresso SET preco=?, tipo=?, fk_id_evento=? WHERE id_ingresso=?`;
        const values = [preco, tipo, fk_id_evento, id_ingresso];

        try{
            connect.query(query, values, (err, results) => {
                console.log("Resultados:", results);
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao atualizar ingresso!"});
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({error: "Ingresso não encontrado!"});
                }
                return res.status(201).json({message: "Ingresso atualizado com sucesso!"});
            })
        } catch (error){
            console.log("Erro ao executar consulta: ", error);
            return res.status(500).json({error: "Error interno do servidor!"});
        }
    }

    static async deleteingresso(req, res){
        const idIngresso = req.params.id;

        const query = `DELETE FROM ingresso WHERE id_ingresso=?`;

        try{
            connect.query(query, idIngresso, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao excluir ingresso!"});
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({error:"Ingresso não encontrado"});
                }
                return res.status(200).json({message: "Ingresso excluido com sucesso!"});
            })
        }catch(error){
            console.log("Erro ao executar consulta!", error);
            return res.status(500).json({error: "Erro interno do servidor!"});
        }
    }
}