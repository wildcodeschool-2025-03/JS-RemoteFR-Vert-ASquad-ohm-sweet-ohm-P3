CREATE TABLE role (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE user (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  birthdate DATE NOT NULL,
  telephone_number VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  postcode INT NOT NULL,
  number_of_electric_car INT NOT NULL,
  username VARCHAR(30),
  password VARCHAR(30) NOT NULL,
  profile_pic VARCHAR(255) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  foreign key(role_id) references role(id)
);

CREATE TABLE review (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  review TEXT NOT NULL,
  grade INT NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  foreign key(user_id) references user(id)
);

CREATE TABLE vehicle (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  pics VARCHAR(255)
);

CREATE TABLE vehicle_user (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  vehicle_id INT UNSIGNED NOT NULL,
  foreign key(user_id) references user(id),
  foreign key(vehicle_id) references vehicle(id)
);

CREATE TABLE vehicle_socket (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR (10)
);

CREATE TABLE template (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR (50),
  vehicle_id INT UNSIGNED NOT NULL,
  vehicle_socket_id INT UNSIGNED NOT NULL,
  foreign key(vehicle_id) references vehicle(id),
  foreign key(vehicle_socket_id) references vehicle_socket(id)
);

CREATE TABLE form (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  infos VARCHAR (200),
  partnership VARCHAR (300),
  other VARCHAR (200)
);

CREATE TABLE form_user (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  form_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  foreign key(form_id) references form(id),
  foreign key(user_id) references user(id)
);

CREATE TABLE terminal (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nom_amenageur VARCHAR (255),
  siren_amenageur INT,
  contact_amenageur VARCHAR(100),
  nom_operateur VARCHAR(100),
  contact_operateur VARCHAR(100),
  telephone_operateur VARCHAR(50),
  nom_enseigne VARCHAR(100),
  id_station_itinerance VARCHAR(100),
  id_station_local VARCHAR(100),
  nom_station VARCHAR(255),
  implantation_station VARCHAR(100),
  adresse_station TEXT,
  code_insee_commune VARCHAR(10),
  coordonneesXY JSON,
  nbre_pdc INT,
  id_pdc_itinerance VARCHAR(100),
  id_pdc_local TEXT,
  puissance_nominale INT,
  prise_type_ef BOOLEAN,
  prise_type_2 BOOLEAN,
  prise_type_combo_ccs BOOLEAN,
  prise_type_chademo BOOLEAN,
  prise_type_autre BOOLEAN,
  gratuit BOOLEAN,
  paiement_acte BOOLEAN,
  paiement_cb BOOLEAN,
  paiement_autre BOOLEAN,
  tarification TEXT,
  condition_acces VARCHAR(50),
  reservation BOOLEAN,
  horaires TEXT,
  accessibilite_pmr VARCHAR(100),
  restriction_gabarit VARCHAR(100),
  station_deux_roues BOOLEAN,
  raccordement VARCHAR(25),
  num_pdl TEXT,
  date_mise_en_service DATE NULL,
  observations TEXT,
  date_maj DATE NULL,
  cable_t2_attache BOOLEAN,
  last_modified DATETIME,
  datagouv_dataset_id VARCHAR(50),
  datagouv_resource_id VARCHAR(100),
  datagouv_organization_or_owner VARCHAR(100),
  created_at DATETIME,
  consolidated_longitude DECIMAL(23,20),
  consolidated_latitude DECIMAL(23,20),
  consolidated_code_postal INT,
  consolidated_commune VARCHAR(100),
  consolidated_is_lon_lat_correct BOOLEAN,
  consolidated_is_code_insee_verified BOOLEAN,
  consolidated_is_code_insee_modified BOOLEAN
);

CREATE TABLE type_of_socket (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR (10)
);

CREATE TABLE terminal_type_of_socket (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  terminal_id INT UNSIGNED NOT NULL,
  type_of_socket_id INT UNSIGNED NOT NULL,
  foreign key(terminal_id) references terminal(id),
  foreign key(type_of_socket_id) references type_of_socket(id)
);

CREATE TABLE booking (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  Payment DECIMAL (4, 2),
  calendar DATE NOT NULL,
  booking_number INT NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  terminal_id INT UNSIGNED NOT NULL,
  foreign key(user_id) references user(id),
  foreign key(terminal_id) references terminal(id)
);

CREATE TABLE dealer (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR (100) NOT NULL,
  longitude DECIMAL (22,20) NOT NULL,
  latitude DECIMAL (22, 20) NOT NULL,
  URL_website VARCHAR (100) NOT NULL
);