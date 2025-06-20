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
  operator_name VARCHAR (50) NOT NULL,
  terminal_name VARCHAR (100) NOT NULL,
  terminal_adress_number INT NOT NULL,
  terminal_street_name TEXT NOT NULL,
  longitude DECIMAL (22, 20) NOT NULL,
  latitude DECIMAL (22, 20) NOT NULL,
  max_power DECIMAL (5, 2),
  socket_type VARCHAR (30) NOT NULL,
  accessibility VARCHAR (20),
  free_access_or_not BOOLEAN,
  observations VARCHAR (100),
  favorite BOOLEAN NOT NULL
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