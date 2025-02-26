const connect = require("../db/connect");

module.exports = class eventoController {
    //criação de um evento 
    static async createEvento (req, res){
        const {nome, descricao, data_hora, local, fk_id_organizador} = req.body;

        //validação genérica de todos atributos 
        if (!nome || !descricao || !data_hora || !local || !fk_id_organizador){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos!"});
        } 

        const query = `INSERT INTO evento (nome, descricao, data_hora, local, fk_id_organizador) VALUES (?, ?, ?, ?, ?)`;
        const values = [nome, descricao, data_hora, local, fk_id_organizador];

        try{
            connect.query(query, values, (err) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao criar o evento!"});

                }
                return res.status(201).json({message: "Evento criado com sucesso!"});
            })
        } catch (error){
            console.log("Erro ao executar consulta: ", error);
            return res.status(500).json({error: "Error interno do servidor!"});
        }
    }//fim do create 

    //listar os o eventos cadastrados
    static async getAllEventos(req, res){
        const query = `SELECT * FROM evento`;

        try{
            connect.query(query, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao buscar eventos!"});
                }
                return res.status(200).json({message:"Eventos listados com sucesso", events: results})
            })
        } catch(error){
            console.log("Erro ao execultar a consulta!", error);
            return res.status(500).json({error: "Error interno no servidor!"});
        }
    }

    static async updateEvento (req, res){
        const {id_evento, nome, descricao, data_hora, local, fk_id_organizador} = req.body;

        //validação genérica de todos atributos 
        if (!id_evento || !nome || !descricao || !data_hora || !local || !fk_id_organizador){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos!"});
        } 

        const query = `UPDATE evento SET nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=? WHERE id_evento=?`;
        const values = [nome, descricao, data_hora, local, fk_id_organizador, id_evento];

        try{
            connect.query(query, values, (err, results) => {
                console.log("Resultados:", results);
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao atualizar o evento!"});
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({error: "Evento não encontrado!"});
                }
                return res.status(201).json({message: "Evento atualizado com sucesso!"});
            })
        } catch (error){
            console.log("Erro ao executar consulta: ", error);
            return res.status(500).json({error: "Error interno do servidor!"});
        }
    }//fim do update 


    //exclusão de eventos
    static async deleteEvento(req, res){
        const idEvento = req.params.id;

        const query = `DELETE FROM evento WHERE id_evento=?`;

        try{
            connect.query(query, idEvento, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao excluir evento!"});
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({error:"Evento não encontrado"});
                }
                return res.status(200).json({message: "Evento excluido com sucesso!"});
            })
        }catch(error){
            console.log("Erro ao executar consulta!", error);
            return res.status(500).json({error: "Erro interno do servidor!"});
        }
    }


    static async getEventosPorData(req, res){
        const query = `SELECT * FROM evento`
        try{
            connect.query(query, (err,results)=>{
                if(err){
                    console.error(err);
                    return res.status(500).json({error: "Erro ao buscar eventos"})
                }
                //retorna o dia do evento que esta nessa posição no array
                //evento 1
                const dataEvento = new Date(results[0].data_hora);
                const dia = dataEvento.getDate()
                const mes = dataEvento.getMonth()+1
                const ano = dataEvento.getFullYear()
                console.log('Evento 1: '+dia+'/'+mes+'/'+ano)
                //passado e futuro da data atual do momento
                const now = new Date()
                const eventosPassados = results.filter(evento => new Date(evento.data_hora)<now)
                const eventosFuturos = results.filter(evento => new Date(evento.data_hora)>=now)

                const diferencaMs = eventosFuturos[0].data_hora.getTime() - now.getTime();
                const dias = Math.floor(diferencaMs/(1000*60*60*24));
                const horas = Math.floor((diferencaMs%(1000*60*60*24))/(1000*60*60));
                console.log(diferencaMs, 'Falta: '+dias+ ' dias, : ' +horas+ ' horas para o evento')

                //comparando datas
                const dataFiltro = new Date('2024-12-15').toISOString().split("T");
                const eventoDia = results.filter(evento => new Date (evento.data_hora).toISOString().split("T")[0] === dataFiltro[0]);
                console.log("Eventos: ", eventoDia);

                return res.status(200).json({message:"OK", eventosPassados, eventosFuturos})
            })

        }catch(error){
            console.error(error);
            return res.status(500).json({error: "Erro ao buscar eventos"})
        }
        

    }


    static async getEventosAgendados(req, res){
        const query = `SELECT * FROM evento`

        try{
            connect.query(query, (err, results)=> {
                if(err){
                    console.error(err);
                    return res.status(500).json({error: "Erro ao buscar eventos"})
                }
                const dataEvento = req.params.data;
                const now = new Date;
                const eventosDentre7dias = results.filter(evento => new Date(evento.data_hora)>now<7)
                const eventosFora7dias = results.filter(evento => new Date(evento.data_hora)<now>7)
                console.log("eventos que aconteceram em 7 dias: ", eventosDentre7dias);
                console.log("eventos que não aconteceram em 7 dias: ", eventosFora7dias);


            })
        }catch(error){
            console.error(error);
            return res.status(500).json({error: "Erro ao buscar eventos"})
        }
    }

   
}



