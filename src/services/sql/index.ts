import { FishRecord } from '@/assets/types';
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
     // await this.db.execAsync('DROP TABLE IF EXISTS fish_catch')
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
                code, team, category, modality, registered_by, species_id,
                size, total_points, card_number, card_image,
                fish_image, fish_video,latitude, longitude,  synchronized, created_at
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

  // Recupera todas as equipes
  async getAllFishRecord() {
    const db = this.getDb();
    return await db.getAllAsync('SELECT * FROM fish_catch');
  }

  async getFishRecordByQuery(query: string, parameter: string) {
    const db = this.getDb();
    return await db.getAllAsync(`SELECT * FROM teams WHERE ${query} = ?`, [parameter]);
  }

  // editar pontuação por código
  async updateFishRecord(data: FishRecord) {
    
    const db = this.getDb();
    await db.runAsync(
      `UPDATE fish_catch SET
                team = ?, category = ?, modality = ?, registered_by = ?,
                species_id = ?, size = ?, total_points = ?, card_number = ?,
                card_image = ?, fish_image = ?, fish_video = ?,
                latitude = ?, longitude = ?, synchronized = ?, created_at = ?
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
        data.created_at || new Date().toISOString(),
        data.code
      ]
    );
  }

  // apaga banco de dados
  async clearDatabase() {
    const db = this.getDb();
    await db.execAsync('DROP TABLE IF EXISTS fish_catch');
    await this.init(); // Recria as tabelas após limpar
  }
}

export default OfflineStorage;
