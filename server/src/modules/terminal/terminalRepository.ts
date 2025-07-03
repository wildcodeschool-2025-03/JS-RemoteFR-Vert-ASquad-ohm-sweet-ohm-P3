import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
  consolidated_latitude: number;
  consolidated_longitude: number;
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
}

export default new TerminalRepository();
