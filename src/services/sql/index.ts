import { OfflineStorageData } from '@/src/assets/types';
import * as SQLite from 'expo-sqlite';

class OfflineStorage {
    private db: SQLite.SQLiteDatabase | null = null;

    constructor() {
        this.init();
    }

    // Inicializa e configura o banco
    async init() {
        this.db = await SQLite.openDatabaseAsync('FipeFiscalApp');
        await this.db.execAsync(`PRAGMA journal_mode = WAL;`);

        // Criação das tabelas
        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY NOT NULL,
        code TEXT NOT NULL,
        team_name TEXT NOT NULL,
        id_member_1 INTEGER NOT NULL,
        name_member_1 TEXT NOT NULL,
        id_member_2 INTEGER,
        name_member_2 TEXT,
        id_member_3 INTEGER,
        name_member_3 TEXT,
        id_member_4 INTEGER,
        name_member_4 TEXT
      );
    `);

        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS fish (
        id TEXT PRIMARY KEY NOT NULL,
        species TEXT NOT NULL,
        photo TEXT NOT NULL,
        point INTEGER NOT NULL
      );
    `);
    }

    // Garante que o banco foi inicializado
    private getDb() {
        if (!this.db) throw new Error('Banco de dados ainda não foi inicializado');
        return this.db;
    }

    // Armazena equipes offline
    async setTeams(data: OfflineStorageData) {
        if (data.column !== 'teams') return;

        const db = this.getDb();
        await db.execAsync('DELETE FROM teams');


        for (const item of data.value) {
            await db.runAsync(
                `INSERT INTO teams (
            id, code, team_name,
            id_member_1, name_member_1,
            id_member_2, name_member_2,
            id_member_3, name_member_3,
            id_member_4, name_member_4
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    item.id,
                    item.code,
                    item.team_name,
                    item.id_member_1,
                    item.name_member_1,
                    item.id_member_2 ?? null,
                    item.name_member_2 ?? null,
                    item.id_member_3 ?? null,
                    item.name_member_3 ?? null,
                    item.id_member_4 ?? null,
                    item.name_member_4 ?? null,
                ]
            );
        }

    }

    // Armazena peixes offline
    async setFish(data: OfflineStorageData) {
        if (data.column !== 'fish') return;

        const db = this.getDb();
        await db.execAsync('DELETE FROM fish');


        for (const item of data.value) {
            await db.runAsync(
                `INSERT INTO fish (
            id, species, photo, point
          ) VALUES (?, ?, ?, ?)`,
                [
                    item.id,
                    item.species,
                    item.photo,
                    item.point,
                ]
            );
        }
    }

    // Recupera todas as equipes
    async getAllTeams() {
        const db = this.getDb();
        return await db.getAllAsync('SELECT * FROM teams');
    }

    // Recupera todos os peixes
    async getAllFish() {
        const db = this.getDb();
        return await db.getAllAsync('SELECT * FROM fish');
    }

    // Limpa os dados de uma tabela
    async clear(column: string) {
        const db = this.getDb();

        if (column === 'teams') {
            await db.execAsync('DELETE FROM teams');
        } else if (column === 'fish') {
            await db.execAsync('DELETE FROM fish');
        } else {
            console.warn(`Coluna desconhecida: ${column}`);
        }
    }
}

export default OfflineStorage;
