import databaseClient from "../../../../database/client";

import type { Rows } from "../../../../database/client";

type Template = {
  id: number;
  name: string;
  brand_id: number;
};

class TemplateRepository {
  async readByBrandId(brandId: number): Promise<Template[]> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT t.id, t.name, v.id AS brand_id FROM template AS t JOIN vehicle AS v ON v.id=t.vehicle_id WHERE v.id = ?",
      [brandId],
    );
    return rows as Template[];
  }
}

export default new TemplateRepository();
