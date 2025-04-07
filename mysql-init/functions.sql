-- CRIAÇÃO DE FUNCTION 
delimiter $$
create function calcula_idade(datanascimento date)
returns int 
deterministic 
contains sql 
begin 
    declare idade int;
    set idade = timestampdiff(year, datanascimento, curdate());
    return idade;
end; $$
delimiter ;

-- VERIFICA SE A FUNÇÃO ESPECIFICADA FOI CRIADA 
show create function calcula_idade;

select name, calcula_idade(data_nascimento) AS idade from usuario;

delimiter $$
create function status_sistema()
returns varchar(50)
no sql
begin 
    return 'Sistema operando normalmente';
end; $$
delimiter ;

-- execução de query
select status_sistema();


delimiter $$
create function total_compras_usuario(id_usuario int)
returns int 
reads sql data
begin 
    declare total int;

    select count(*) into total
    from compra 
    where id_usuario = compra.fk_id_usuario;

    return total;
end; $$
delimiter ;

-- execução da function
select total_compras_usuario(1) as compras_por_usuario;

-- apagar uma função 
drop function

-- tabela para criar uma função 
create table log_evento(
    id_log int AUTO_INCREMENT PRIMARY KEY,
    mensagem varchar(255),
    data_log datetime DEFAULT current_timestamp
);

delimiter $$
create function registrar_log_evento(texto varchar(255))
returns varchar(50)
not deterministic
modifies sql data
begin 
    insert into log_evento(mensagem)
    values (texto);

    return 'Log inserido co sucesso';
end; $$   
delimiter ;

-- Visualiza o estado da variavel de controle para permissões de criação de funções
show variables like 'log_bin_trust_function_creators';

--altera a variavel global do MySQL
-- precisa ter permissão de asministrador do banco 
set global log_bin_trust_function_creators = 1;

select registrar_log_evento('teste');


delimiter $$
create function mensagem_boas_vindas(nome_usuario varchar(100))
returns varchar(255)
deterministic
contains sql 
begin 
    declare msg varchar(255);
    set msg = concat('Olá, ', nome_usuario, '! Seja bem vindo(a) ao sistema VIO.');
    return msg;
end; $$
delimiter ; 
