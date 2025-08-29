import { FishRecord } from '@/assets/types';
import * as SQLite from 'expo-sqlite';

class OfflineStorage {
    private static instance: OfflineStorage;
    private db: SQLite.SQLiteDatabase | null = null;
    private isInitialized: boolean = false;

    static async getInstance() {
        if (!OfflineStorage.instance) {
            OfflineStorage.instance = new OfflineStorage();
            await OfflineStorage.instance.init();
        }
        return OfflineStorage.instance;
    }

    private async init() {
        try {
            this.db = await SQLite.openDatabaseAsync('FipeFiscalApp.db');
            await this.db.execAsync(`PRAGMA journal_mode = WAL;`);

            await this.createTables();
            this.isInitialized = true;

        } catch (error) {
            console.error('Erro ao inicializar banco de dados:', error);
            throw error;
        }
    }

    private async createTables() {
        await this.db!.execAsync(`
      CREATE TABLE IF NOT EXISTS fish_catch (
        code TEXT PRIMARY KEY NOT NULL,
        team TEXT NOT NULL,
        category TEXT NOT NULL,
        modality TEXT NOT NULL,
        registered_by TEXT NOT NULL,
        species_id TEXT NOT NULL,
        size INTEGER NOT NULL,
        total_points INTEGER NOT NULL,
        card_number TEXT NOT NULL,
        card_image TEXT NOT NULL,
        fish_image TEXT NOT NULL,
        fish_video TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        synchronizedData BOOLEAN NOT NULL DEFAULT false,
        synchronizedMedia BOOLEAN NOT NULL DEFAULT false,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );
    `);
    }

    private getDb() {
        if (!this.db || !this.isInitialized) {
            throw new Error('Banco de dados não inicializado');
        }
        return this.db;
    }

    async setFishRecord(data: FishRecord) {
        try {
            const db = this.getDb();
            await db.runAsync(
                `INSERT OR REPLACE INTO fish_catch (
          code, team, category, modality, registered_by, species_id,
          size, total_points, card_number, card_image,
          fish_image, fish_video, latitude, longitude,  synchronizedData, synchronizedMedia, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.code,
                    data.team,
                    data.category,
                    data.modality,
                    data.registered_by,
                    data.species_id,
                    data.size,
                    data.total_points,
                    data.card_number,
                    data.card_image,
                    data.fish_image,
                    data.fish_video,
                    data.latitude || 0,
                    data.longitude || 0,
                    data.synchronizedData ? 1 : 0,
                    data.synchronizedMedia ? 1 : 0,
                    data.created_at || new Date().toISOString()
                ]
            );
        } catch (error) {
            console.error('Erro ao salvar registro:', error);
            throw error;
        }
    }

    async getAllFishRecords(): Promise<FishRecord[]> {
        try {
            const db = this.getDb();
            const records = await db.getAllAsync('SELECT * FROM fish_catch');
            return records as FishRecord[];
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
            throw error;
        }
    }

    async getFishRecordByCode(code: string): Promise<FishRecord | null> {
        try {
            const db = this.getDb();
            const records = await db.getAllAsync(
                'SELECT * FROM fish_catch WHERE code = ?',
                [code]
            );
            return records.length > 0 ? records[0] as FishRecord : null;
        } catch (error) {
            console.error('Erro ao buscar registro:', error);
            throw error;
        }
    }

    async getUnsynchronizedRecords(): Promise<FishRecord[]> {
        try {
            const db = this.getDb();
            const records = await db.getAllAsync(
                'SELECT * FROM fish_catch WHERE synchronized = ?',
                [0]
            );
            return records as FishRecord[];
        } catch (error) {
            console.error('Erro ao buscar registros não sincronizados:', error);
            throw error;
        }
    }

    async updateFishRecord(data: FishRecord) {
        try {
            const db = this.getDb();
            await db.runAsync(
                `UPDATE fish_catch SET
          team = ?, category = ?, modality = ?, registered_by = ?,
          species_id = ?, size = ?, total_points = ?, card_number = ?,
          card_image = ?, fish_image = ?, fish_video = ?,
          latitude = ?, longitude = ?,synchronizedData = ?, synchronizedMedia = ?
        WHERE code = ?`,
                [
                    data.team,
                    data.category,
                    data.modality,
                    data.registered_by,
                    data.species_id,
                    data.size,
                    data.total_points,
                    data.card_number,
                    data.card_image,
                    data.fish_image,
                    data.fish_video,
                    data.latitude || 0,
                    data.longitude || 0,
                    data.synchronizedData ? 1 : 0,
                    data.synchronizedMedia ? 1 : 0,
                    data.code
                ]
            );
        } catch (error) {
            console.error('Erro ao atualizar registro:', error);
            throw error;
        }
    }

    async deleteFishRecord(code: string) {
        try {
            const db = this.getDb();
            await db.runAsync(
                'DELETE FROM fish_catch WHERE code = ?',
                [code]
            );
        } catch (error) {
            console.error('Erro ao deletar registro:', error);
            throw error;
        }
    }

    async markAsSynchronizedData(code: string) {
        try {
            const db = this.getDb();
            await db.runAsync(
                'UPDATE fish_catch SET synchronizedData = ? WHERE code = ?',
                [1, code]
            );
        } catch (error) {
            console.error('Erro ao marcar como sincronizado:', error);
            throw error;
        }
    }

    async markAsSynchronizedMedia(code: string) {
        try {
            const db = this.getDb();
            await db.runAsync(
                'UPDATE fish_catch SET synchronizedMedia = ? WHERE code = ?',
                [1, code]
            );
        } catch (error) {
            console.error('Erro ao marcar como sincronizado:', error);
            throw error;
        }
    }

    async close() {
        if (this.db) {
            await this.db.closeAsync();
            this.db = null;
            this.isInitialized = false;
        }
    }

    async clearDatabase() {
        try {
            const db = this.getDb();
            await db.execAsync('DELETE FROM fish_catch');
        } catch (error) {
            console.error('Erro ao limpar banco:', error);
            throw error;
        }
    }
}

export default OfflineStorage;