import z from "zod";

const csv = require("csv-parser");
const fs = require("node:fs");
const mysql = require("mysql2");

const bool = z.preprocess((val) => {
  if (typeof val === "string" && val === "true") {
    return true;
  }
}, z.coerce.boolean());

const nullableString = z.preprocess(
  (val) => (val === "" ? null : val),
  z.string().nullable(),
);

const nullableNumber = z.preprocess(
  (val) => (val === "" ? null : val),
  z.coerce.number().nullable(),
);

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
  nom_amenageur: nullableString,
  siren_amenageur: nullableNumber,
  contact_amenageur: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().email().nullable(),
  ),
  nom_operateur: nullableString,
  contact_operateur: z
    .string()
    .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
    .nullable(),
  telephone_operateur: nullableString,
  nom_enseigne: nullableString,
  id_station_itinerance: nullableString,
  id_station_local: z.union([nullableString, nullableNumber]),
  nom_station: nullableString,
  implantation_station: nullableString,
  adresse_station: nullableString,
  code_insee_commune: z.union([nullableString, nullableNumber]),
  coordonneesXY: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.coerce.number()).min(2).max(2)),
  nbre_pdc: nullableNumber,
  id_pdc_itinerance: nullableString,
  id_pdc_local: z.union([nullableString, nullableNumber]),
  puissance_nominale: nullableNumber,
  prise_type_ef: bool,
  prise_type_2: bool,
  prise_type_combo_ccs: bool,
  prise_type_chademo: bool,
  prise_type_autre: bool,
  gratuit: bool,
  paiement_acte: bool,
  paiement_cb: bool.nullable(),
  paiement_autre: bool.nullable(),
  tarification: z.union([nullableString, nullableNumber]),
  condition_acces: nullableString,
  reservation: bool,
  horaires: nullableString,
  accessibilite_pmr: nullableString,
  restriction_gabarit: nullableString,
  station_deux_roues: bool,
  raccordement: nullableString,
  num_pdl: z.union([nullableString, nullableNumber]),
  date_mise_en_service: nullableDate,
  observations: nullableString,
  date_maj: nullableDate,
  cable_t2_attache: bool.nullable(),
  last_modified: z.union([
    z.string().datetime(),
    z.string().datetime({ offset: true }),
  ]),
  datagouv_dataset_id: nullableString,
  datagouv_resource_id: z
    .string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
  datagouv_organization_or_owner: nullableString,
  created_at: z.string().datetime({ offset: true }),
  consolidated_longitude: nullableNumber,
  consolidated_latitude: nullableNumber,
  consolidated_code_postal: nullableNumber,
  consolidated_commune: nullableString,
  consolidated_is_lon_lat_correct: bool,
  consolidated_is_code_insee_verified: bool,
  consolidated_is_code_insee_modified: bool,
});

type ValidatedRow = z.infer<typeof rowSchema>;
type data = z.infer<typeof rowSchema>;

const connection = mysql.createConnection({
  host: "localhost",
  user: "Alex",
  password: "Baloo",
  database: "Geocode",
  charset: "utf8mb4",
});

const results: ValidatedRow[] = [];
let rowCount = 0;

fs.createReadStream("/Users/Alexandre/Desktop/tableau_bornes.csv")
  .pipe(csv({ separator: "," }))
  .on("data", (data: data) => {
    rowCount++;
    results.push(data);
  })
  .on("end", async () => {
    console.log(
      `Fichier CSV terminé d'être analysé. ${results.length} lignes trouvées.`,
    );

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

    connection
      .end((err: Error | null) => {
        if (err) {
          console.error(
            "Erreur lors de la fermeture de la connexion à la base de données :",
            err.message,
          );
          return;
        }
      })
      .on("error", (error: Error | null) => {
        connection.end();
      });
  });
