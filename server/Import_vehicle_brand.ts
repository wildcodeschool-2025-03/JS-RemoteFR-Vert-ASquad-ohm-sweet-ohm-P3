import fs from "node:fs";
import csv from "csv-parser";
import z from "zod";
import connection from "./connection";

const rowSchema = z.object({
  name: z.string(),
});

type ValidatedRow = z.infer<typeof rowSchema>;
type data = z.infer<typeof rowSchema>;

const results: ValidatedRow[] = [];
let rowCount = 0;

// N'oubliez pas d'ajouter une variable avec le chemin d'accés dans le fichier server/.env
const csvPath = process.env.CSV_PATH2;

if (!csvPath) {
  console.error("CSV_PATH n'est pas défini dans le fichier .env");
  process.exit(1);
}

fs.createReadStream(csvPath)
  .pipe(csv({ separator: "," }))
  .on("data", (data: data) => {
    rowCount++;
    results.push(data);
  })
  .on("end", async () => {
    const sql = "INSERT INTO vehicle (name) VALUES (?)";

    let insertedRowsCount = 0;
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      const currentRowNumber = i + 1;

      const parsedData = rowSchema.safeParse(row);
      if (!parsedData.success) {
        console.error(
          `Validation échouée pour la ligne n° ${currentRowNumber}:`,
        );
        console.error("Erreurs de validation:", parsedData.error.errors);
        continue;
      }

      const verifiedRow = parsedData.data;

      const values = [verifiedRow.name];

      try {
        await connection.execute(sql, values);
        insertedRowsCount++;
      } catch (err) {
        console.error(`Erreur MySQL ligne ${currentRowNumber} :`, String(err));
      }
    }

    connection.end((err: Error | null) => {
      if (err) {
        console.error(
          "Erreur lors de la fermeture de la connexion à la base de données :",
          err.message,
        );
        return;
      }
    });
  });
