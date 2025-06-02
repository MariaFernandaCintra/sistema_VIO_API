const connect = require("../db/connect");

module.exports = class compraController {
  static registrarCompraSimples(req, res) {
    const { id_usuario, id_ingresso, quantidade } = req.body;

    console.log("Body:", id_usuario, id_ingresso, quantidade);

    if (!id_usuario || !id_ingresso || !quantidade) {
      return res
        .status(400)
        .json({ error: "Dados obrigatórios não enviados!" });
    }

    //Chamada da procedure diretamente com os parametros
    connect.query(
      "call register_compra(?, ?, ?);",
      [id_usuario, id_ingresso, quantidade],
      (err, results) => {
        if (err) {
          console.log("erro ao registrar compra: ", err.message);
          return res.status(500).json({ error: err.message });
        }

        return res.status(201).json({
          message: "Compra registrada com sucesso via procedure",
          dados: {
            id_usuario,
            id_ingresso,
            quantidade,
          },
        });
      }
    );
  }

  static registrarCompra(req, res) {
    const { id_usuario, ingressos } = req.body;
    console.log("Body: ", id_usuario, ingressos);

    connect.query(
      "insert into compra (data_compra, fk_id_usuario) values (now(), ?)",
      [id_usuario],
      (err, result) => {
        if (err) {
          console.log("erro ao inserir compra: ", err);
          return res
            .status(500)
            .json({ error: "Erro ao criar a compra no sistema" });
        }

        // Recupera o id da compra recém criada
        const id_compra = result.insertId;
        console.log("Compra criada com o id: ", id_compra);

        //inicializa o indice dos ingressos a serem processados
        let index = 0;

        //Função recursiva para processar cada ingresso sequencialmente
        function processarIngressos() {
          //condição: todos os ingressos foram processados
          if (index >= ingressos.length) {
            return res.status(201).json({
              message: "Compra realizada com sucesso!",
              id_compra,
              ingressos,
            });
          }
          //Obter o ingresso arual com base no indice
          const ingresso = ingressos[index];

          //chamada da procedure para registrar as compras
          connect.query(
            "call registrar_compra2 (?, ?, ?);",
            [ingresso.id_ingresso, id_compra, ingresso.quantidade],
            (err) => {
              if (err) {
                return res.status(500).json({
                  error: `Erro ao registrar ingresso ${index + 1}`,
                  detalhes: err.message,
                });
              }
              index++;
              processarIngressos();
            }
          );
        }
        processarIngressos();
      }
    );
  }
};
