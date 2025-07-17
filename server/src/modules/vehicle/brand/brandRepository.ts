import databaseClient from "../../../../database/client";

import type { Rows } from "../../../../database/client";

type Brand = {
  id: number;
  name: string;
};

class BrandRepository {
  async readAll(): Promise<Brand[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, name FROM vehicle",
    );
    return rows as Brand[];
  }
}

export default new BrandRepository();
