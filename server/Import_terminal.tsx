import fs from "node:fs";
import csv from "csv-parser";
import mysql from "mysql2";
import z from "zod";
import "dotenv/config";

const bool = z.preprocess((val) => {
  if (typeof val === "string" && val === "true") {
    return true;
  }
}, z.coerce.boolean());

const nullableDate = z.preprocess(
  (val) => (val === "" ? null : val),
  z.union([
    z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
    z
      .string()
      .trim()
      .regex(/^\d{4}-\d{1}-\d{2}$/)
      .nullable(),
    z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{1}$/)
      .nullable(),
  ]),
);

const rowSchema = z.object({
  nom_amenageur: z.string().nullable().default(null),
  siren_amenageur: z.coerce.number().nullable().default(null),
  contact_amenageur: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().email().nullable().default(null),
  ),
  nom_operateur: z.string().nullable().default(null),
  contact_operateur: z
    .string()
    .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
    .nullable(),
  telephone_operateur: z.string().nullable().default(null),
  nom_enseigne: z.string().nullable().default(null),
  id_station_itinerance: z.string().nullable().default(null),
  id_station_local: z
    .union([z.string(), z.coerce.number()])
    .nullable()
    .default(null),
  nom_station: z.string().nullable().default(null),
  implantation_station: z.string().nullable().default(null),
  adresse_station: z.string().nullable().default(null),
  code_insee_commune: z
    .union([z.string(), z.coerce.number()])
    .nullable()
    .default(null),
  coordonneesXY: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.coerce.number()).min(2).max(2)),
  nbre_pdc: z.coerce.number().nullable().default(null),
  id_pdc_itinerance: z.string().nullable().default(null),
  id_pdc_local: z
    .union([z.string(), z.coerce.number()])
    .nullable()
    .default(null),
  puissance_nominale: z.coerce.number().nullable().default(null),
  prise_type_ef: bool,
  prise_type_2: bool,
  prise_type_combo_ccs: bool,
  prise_type_chademo: bool,
  prise_type_autre: bool,
  gratuit: bool,
  paiement_acte: bool,
  paiement_cb: bool.nullable(),
  paiement_autre: bool.nullable(),
  tarification: z
    .union([z.string(), z.coerce.number()])
    .nullable()
    .default(null),
  condition_acces: z.string().nullable().default(null),
  reservation: bool,
  horaires: z.string().nullable().default(null),
  accessibilite_pmr: z.string().nullable().default(null),
  restriction_gabarit: z.string().nullable().default(null),
  station_deux_roues: bool,
  raccordement: z.string().nullable().default(null),
  num_pdl: z.union([z.string(), z.coerce.number()]).nullable().default(null),
  date_mise_en_service: nullableDate,
  observations: z.string().nullable().default(null),
  date_maj: nullableDate,
  cable_t2_attache: bool.nullable(),
  last_modified: z.union([
    z.string().datetime(),
    z.string().datetime({ offset: true }),
  ]),
  datagouv_dataset_id: z.string().nullable().default(null),
  datagouv_resource_id: z
    .string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
  datagouv_organization_or_owner: z.string().default("null"),
  created_at: z.string().datetime({ offset: true }),
  consolidated_longitude: z.coerce.number().nullable().default(null),
  consolidated_latitude: z.coerce.number().nullable().default(null),
  consolidated_code_postal: z.coerce.number().nullable().default(null),
  consolidated_commune: z.string().nullable().default(null),
  consolidated_is_lon_lat_correct: bool,
  consolidated_is_code_insee_verified: bool,
  consolidated_is_code_insee_modified: bool,
});

type ValidatedRow = z.infer<typeof rowSchema>;
type data = z.infer<typeof rowSchema>;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
});

const results: ValidatedRow[] = [];
let rowCount = 0;

// N'oubliez pas d'ajouter une variable avec le chemin d'accés dans le fichier server/.env
const csvPath = process.env.CSV_PATH1;

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
    const sql =
      "INSERT INTO terminal (nom_amenageur, siren_amenageur, contact_amenageur, nom_operateur, contact_operateur, telephone_operateur, nom_enseigne, id_station_itinerance, id_station_local, nom_station, implantation_station, adresse_station, code_insee_commune, coordonneesXY, nbre_pdc, id_pdc_itinerance, id_pdc_local, puissance_nominale, prise_type_ef, prise_type_2, prise_type_combo_ccs, prise_type_chademo, prise_type_autre, gratuit, paiement_acte, paiement_cb, paiement_autre, tarification, condition_acces, reservation, horaires, accessibilite_pmr, restriction_gabarit, station_deux_roues, raccordement, num_pdl, date_mise_en_service, observations, date_maj, cable_t2_attache, last_modified, datagouv_dataset_id, datagouv_resource_id, datagouv_organization_or_owner, created_at, consolidated_longitude, consolidated_latitude, consolidated_code_postal, consolidated_commune, consolidated_is_lon_lat_correct, consolidated_is_code_insee_verified, consolidated_is_code_insee_modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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

      let cleanedTarification = verifiedRow.tarification;
      if (
        typeof cleanedTarification === "string" &&
        cleanedTarification.includes("?")
      ) {
        cleanedTarification = cleanedTarification.replace(/\?/g, "");
      }

      const values = [
        verifiedRow.nom_amenageur,
        verifiedRow.siren_amenageur,
        verifiedRow.contact_amenageur,
        verifiedRow.nom_operateur,
        verifiedRow.contact_operateur,
        verifiedRow.telephone_operateur,
        verifiedRow.nom_enseigne,
        verifiedRow.id_station_itinerance,
        verifiedRow.id_station_local,
        verifiedRow.nom_station,
        verifiedRow.implantation_station,
        verifiedRow.adresse_station,
        verifiedRow.code_insee_commune,
        JSON.stringify(verifiedRow.coordonneesXY),
        verifiedRow.nbre_pdc,
        verifiedRow.id_pdc_itinerance,
        verifiedRow.id_pdc_local,
        verifiedRow.puissance_nominale,
        verifiedRow.prise_type_ef,
        verifiedRow.prise_type_2,
        verifiedRow.prise_type_combo_ccs,
        verifiedRow.prise_type_chademo,
        verifiedRow.prise_type_autre,
        verifiedRow.gratuit,
        verifiedRow.paiement_acte,
        verifiedRow.paiement_cb,
        verifiedRow.paiement_autre,
        cleanedTarification,
        verifiedRow.condition_acces,
        verifiedRow.reservation,
        verifiedRow.horaires,
        verifiedRow.accessibilite_pmr,
        verifiedRow.restriction_gabarit,
        verifiedRow.station_deux_roues,
        verifiedRow.raccordement,
        verifiedRow.num_pdl,
        verifiedRow.date_mise_en_service,
        verifiedRow.observations,
        verifiedRow.date_maj,
        verifiedRow.cable_t2_attache,
        verifiedRow.last_modified,
        verifiedRow.datagouv_dataset_id,
        verifiedRow.datagouv_resource_id,
        verifiedRow.datagouv_organization_or_owner,
        verifiedRow.created_at,
        verifiedRow.consolidated_longitude,
        verifiedRow.consolidated_latitude,
        verifiedRow.consolidated_code_postal,
        verifiedRow.consolidated_commune,
        verifiedRow.consolidated_is_lon_lat_correct,
        verifiedRow.consolidated_is_code_insee_verified,
        verifiedRow.consolidated_is_code_insee_modified,
      ];

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
