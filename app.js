import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import { getDb } from './db.js';

export async function criarTabelas() {
    const db = await getDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Titulos (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Capitulos (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            titulo_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            FOREIGN KEY(titulo_id) REFERENCES Titulos(id)
        );

        CREATE TABLE IF NOT EXISTS Artigos (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            capitulo_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            FOREIGN KEY(capitulo_id) REFERENCES Capitulos(id)
        );

        CREATE TABLE IF NOT EXISTS Leis (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            numero TEXT,
            data TEXT,
            descricao TEXT
        );

        CREATE TABLE IF NOT EXISTS ArtigosLeis (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            artigo_id INTEGER,
            lei_id INTEGER,
            FOREIGN KEY(artigo_id) REFERENCES Artigos(id),
            FOREIGN KEY(lei_id) REFERENCES Leis(id)
        );

        CREATE TABLE IF NOT EXISTS ParteGeral (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            artigo_id INTEGER,
            texto TEXT,
            FOREIGN KEY(artigo_id) REFERENCES Artigos(id)
        );
    `);
    await db.close();
}

export async function popularTabelas(dados) {
    console.log("recebido no servidor: ", dados);
  const db = await getDb();

  try {
    console.log("Recebendo dados: ", dados);

    // Inserir o Título do formulário
    const result1 = await db.run(`INSERT INTO Titulos (nome) VALUES (?)`, [dados.titulo]);
    const tituloId = result1.lastID;

    // Inserir o Capítulo
    const result2 = await db.run(
      `INSERT INTO Capitulos (titulo_id, nome) VALUES (?, ?)`,
      [tituloId, dados.capitulo]
    );
    const capituloId = result2.lastID;

    // Inserir o Artigo
    const result3 = await db.run(
      `INSERT INTO Artigos (capitulo_id, nome) VALUES (?, ?)`,
      [capituloId, dados.artigo]
    );
    const artigoId = result3.lastID;

    // Inserir a Lei
    const result4 = await db.run(
      `INSERT INTO Leis (numero, data, descricao) VALUES (?, ?, ?)`,
      [dados.numeroLei, dados.dataLei, dados.descricaoLei]
    );
    const leiId = result4.lastID;

    // Relacionar Artigo com Lei
    await db.run(
      `INSERT INTO ArtigosLeis (artigo_id, lei_id) VALUES (?, ?)`,
      [artigoId, leiId]
    );

    // Inserir o texto do artigo
    await db.run(
      `INSERT INTO ParteGeral (artigo_id, texto) VALUES (?, ?)`,
      [artigoId, dados.textoArtigo]
    );

    console.log('Dados inseridos com sucesso!');
  } catch (erro) {
    console.error('Erro ao inserir dados:', erro);
    throw erro;
  }

  await db.close
}

export async function importarDeJSON(caminhoArquivo) {
    const db = await open({
        filename: "./banco.db",
        driver: sqlite3.Database
    });

    const dadosJson = await fs.readFile(caminhoArquivo, 'utf-8');
    const titulos = JSON.parse(dadosJson);

    for (const titulo of titulos) {
        const { lastID: tituloId } = await db.run(
            `INSERT INTO Titulos (nome) VALUES (?)`,
            [titulo.titulo]
        );

        for (const capitulo of titulo.capitulos) {
            const { lastID: capituloId } = await db.run(
                `INSERT INTO Capitulos (titulo_id, nome) VALUES (?, ?)`,
                [tituloId, capitulo.nome]
            );

            for (const artigo of capitulo.artigos) {
                const { lastID: artigoId } = await db.run(
                    `INSERT INTO Artigos (capitulo_id, nome) VALUES (?, ?)`,
                    [capituloId, artigo.nome]
                );

                if (artigo.parteGeral) {
                    await db.run(
                        `INSERT INTO ParteGeral (artigo_id, texto) VALUES (?, ?)`,
                        [artigoId, artigo.parteGeral]
                    );
                }

                if (artigo.leis && artigo.leis.length > 0) {
                    for (const lei of artigo.leis) {
                        const { lastID: leiId } = await db.run(
                            `INSERT INTO Leis (numero, data, descricao) VALUES (?, ?, ?)`,
                            [lei.numero, lei.data, lei.descricao]
                        );

                        await db.run(
                            `INSERT INTO ArtigosLeis (artigo_id, lei_id) VALUES (?, ?)`,
                            [artigoId, leiId]
                        );
                    }
                }
            }
        }
    }

    console.log('Importação concluída com sucesso!');
}




