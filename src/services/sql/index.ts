import { OfflineStorageData } from '@/src/assets/types';
import * as SQLite from 'expo-sqlite';

class OfflineStorage {

    constructor() {
        // Inicializa o banco de dados e cria as tabelas se não existirem
        this.init();
    }

    async init() {
        const db = await SQLite.openDatabaseAsync('FipeFiscalApp');
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
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

        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS fish (
                id TEXT PRIMARY KEY NOT NULL,
                species TEXT NOT NULL,
                photo TEXT NOT NULL,
                point integer NOT NULL
            );
        `);
    }



    async setTeams(teams: OfflineStorageData) {
        try {
            const db = await SQLite.openDatabaseAsync('FipeFiscalApp');
            await db.execAsync(`
            PRAGMA journal_mode = WAL;
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

            if (teams.column === 'teams') {
                for (const item of teams.value) {
                    const result = await db.runAsync(
                        'INSERT INTO teams (id, code, team_name, id_member_1, name_member_1, id_member_2, name_member_2, id_member_3, name_member_3, id_member_4, name_member_4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
                        item.name_member_4 ?? null
                    );

                    console.log(`Inserted team with ID: ${item.id}, Result: ${result.lastInsertRowId}, ${result.changes}`);
                }
            }

        } catch (error) {
            console.error('Error setting teams in offline storage:', error);

        }
    }

    async setFish(fish: OfflineStorageData) {
        console.log("chama função", fish);

        try {
            const db = await SQLite.openDatabaseAsync('FipeFiscalApp');
            await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS fish (
                id TEXT PRIMARY KEY NOT NULL,
                species TEXT NOT NULL,
                photo TEXT NOT NULL,
                point integer NOT NULL
            );
        `);

            if (fish.column === 'fish') {
                for (const item of fish.value) {
                    const result = await db.runAsync(
                        'INSERT INTO fish (id, species, photo, point) VALUES (?, ?, ?, ?)',
                        item.id,
                        item.species,
                        item.photo,
                        item.point
                    );
                    console.log(`Inserted fish with ID: ${item.id}, Result: ${result.lastInsertRowId}, ${result.changes}`);
                }
            }

        } catch (error) {
            console.error('Error setting fish in offline storage:', error);

        }
    }

    async getAllTeams() {
        const db = await SQLite.openDatabaseAsync('FipeFiscalApp');
        const result = await db.getAllAsync('SELECT * FROM teams');
        return result;
    }


    async getAllFish() {
        const db = await SQLite.openDatabaseAsync('FipeFiscalApp');
        const result = await db.getAllAsync('SELECT * FROM fish');
        return result;
    }

    async clear(column: string) {
        console.log("chama função column", column);
        const db = await SQLite.openDatabaseAsync('FipeFiscalApp');
        if (column === 'teams') {
            await db.execAsync('DROP TABLE IF EXISTS teams');
        } else if (column === 'fish') {
            await db.execAsync('DROP TABLE IF EXISTS fish');
        } else {
            console.warn(`Unknown column: ${column}. No tables dropped.`);
        }
        console.log('Offline storage cleared.');
    }

}

export default OfflineStorage;