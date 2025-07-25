import { FishRecord, OfflineStorageData } from '@/src/assets/types';
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
      CREATE TABLE IF NOT EXISTS fish_catch (
        code TEXT PRIMARY KEY NOT NULL,
        team TEXT NOT NULL,
        registered_by TEXT NOT NULL,
        species TEXT NOT NULL,
        size INTEGER NOT NULL,
        point INTEGER NOT NULL,
        ticket_number TEXT NOT NULL,
        card_image TEXT NOT NULL,
        fish_image TEXT NOT NULL,
        fish_video TEXT NOT NULL,
        synchronized BOOLEAN NOT NULL DEFAULT false
      );
    `);
    }

    // Garante que o banco foi inicializado
    private getDb() {
        if (!this.db) throw new Error('Banco de dados ainda não foi inicializado');
        return this.db;
    }

    // Armazena pontuação offline
    async setFishRecord(data: FishRecord) {
        const db = this.getDb();

        await db.runAsync(
            `INSERT INTO fish_catch (
                code, team, registered_by, species,
                size, point, ticket_number, card_image,
                fish_image, fish_video, synchronized
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.code,
                data.team,
                data.registered_by,
                data.species,
                data.size,
                data.point,
                data.ticket_number,
                data.card_image,
                data.fish_image,
                data.fish_video,
                data.synchronized || false
            ]
        );

    }

    // Recupera todas as equipes
    async getAllFishRecord(data: FishRecord) {
        const db = this.getDb();
        return await db.getAllAsync('SELECT * FROM teams');
    }

    async getTeamByCode(code: string) {
        const db = this.getDb();
        return await db.getFirstAsync('SELECT * FROM teams WHERE code = ?', [code]);
    }
}

export default OfflineStorage;
