import knex from 'knex';
import path from 'path';


const connection = knex({
    client:'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'), //NOME DO DIRETORIO __dirname
    },
    useNullAsDefault: true,
});

export default connection; //PADRONIZAR EXPORTAÇÃO CONEXÃO COM BANCO DE DADOS

// Migrations = Histórico do banco de dados
