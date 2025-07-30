import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
  consolidated_latitude: number;
  consolidated_longitude: number;
  prise_type_ef: boolean;
  prise_type_2: boolean;
  prise_type_combo_ccs: boolean;
  prise_type_chademo: boolean;
  prise_type_autre: boolean;
};

class TerminalRepository {
  async read(id: number): Promise<Terminal | undefined> {
    const [rows] = await await databaseClient.query<Rows>(
      "SELECT id, nom_station, adresse_station, consolidated_latitude, consolidated_longitude FROM terminal WHERE id = ?",
      [id],
    );
    return rows[0] as Terminal;
  }

  async readAll(): Promise<Terminal[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, nom_station, adresse_station, consolidated_latitude, consolidated_longitude FROM terminal",
    );
    return rows as Terminal[];
  }

  async readBbox(
    southLat: number,
    westLng: number,
    northLat: number,
    eastLng: number,
  ): Promise<Terminal[]> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT DISTINCT id, nom_station, adresse_station,  consolidated_latitude, consolidated_longitude,  prise_type_ef, prise_type_2, prise_type_combo_ccs,  prise_type_chademo , prise_type_autre
       FROM terminal
       WHERE consolidated_latitude BETWEEN ? AND ?
       AND consolidated_longitude BETWEEN ? AND ?
       ORDER BY RAND()
       LIMIT 100`,
      [southLat, northLat, westLng, eastLng],
    );
    return rows as Terminal[];
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "delete FROM terminal WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }
}

export default new TerminalRepository();
