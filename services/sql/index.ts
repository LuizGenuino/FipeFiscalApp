import { FishRecord } from '@assets/types';
import * as SQLite from 'expo-sqlite';

class OfflineStorage {
  private static instance: OfflineStorage;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  static async getInstance() {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
      await OfflineStorage.instance.init();
    }
    return OfflineStorage.instance;
  }

  private async init() {
    this.db = await SQLite.openDatabaseAsync('FipeFiscalApp.db');
    await this.db.execAsync(`PRAGMA journal_mode = WAL;`);

    await this.db.execAsync(`
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
        synchronized BOOLEAN NOT NULL DEFAULT false,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );
    `);
  }

  private getDb() {
    if (!this.db) throw new Error('Banco de dados ainda não foi inicializado');
    return this.db;
  }

  async setFishRecord(data: FishRecord) {
    const db = this.getDb();
    await db.runAsync(
      `INSERT INTO fish_catch (
        code, team, category, modality, registered_by, species_id,
        size, total_points, card_number, card_image,
        fish_image, fish_video, latitude, longitude, synchronized, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        data.synchronized ? 1 : 0,
        data.created_at || new Date().toISOString()
      ]
    );
  }

  async getAllFishRecord() {
    const db = this.getDb();
    return await db.getAllAsync('SELECT * FROM fish_catch');
  }

  async getFishRecordByQuery(query: string, parameter: string) {
    const db = this.getDb();
    return await db.getAllAsync(`SELECT * FROM fish_catch WHERE ${query} = ?`, [parameter]);
  }

  async updateFishRecord(data: FishRecord) {
    const db = this.getDb();
    await db.runAsync(
      `UPDATE fish_catch SET
        team = ?, category = ?, modality = ?, registered_by = ?,
        species_id = ?, size = ?, total_points = ?, card_number = ?,
        card_image = ?, fish_image = ?, fish_video = ?,
        latitude = ?, longitude = ?, synchronized = ?
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
        data.synchronized ? 1 : 0,
        data.code
      ]
    );
  }

  async clearDatabase() {
    const db = this.getDb();
    await db.execAsync('DELETE FROM fish_catch'); // mais seguro que DROP
  }
}

export default OfflineStorage;
