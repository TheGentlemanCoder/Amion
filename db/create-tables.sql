DROP TABLE IF EXISTS StartingLocation;
DROP TABLE IF EXISTS DestinationLocation;
DROP TABLE IF EXISTS Address;
DROP TABLE IF EXISTS LinkLUT;

CREATE TABLE LinkLUT (
    link_id             INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, -- used to internally identify the link
    link                CHAR(8), -- the path the user has to recover instance

    PRIMARY KEY (link_id)
);

CREATE TABLE Address (
    address             VARCHAR(100), -- Google Maps address
    latitude            DOUBLE NOT NULL,
    longitude           DOUBLE NOT NULL,

    PRIMARY KEY (address)
);

CREATE TABLE StartingLocation (
    link_id             INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, -- base64 characters
    startingAddress     VARCHAR(100) NOT NULL, -- Google Maps address

    PRIMARY KEY (link_id, startingAddress), -- url is used to uniquely identify all related addresses

    CONSTRAINT starting_link_fk
        FOREIGN KEY (link_id) REFERENCES
        LinkLUT (link_id),

    CONSTRAINT starting_address_fk
        FOREIGN KEY (startingAddress) REFERENCES
        Address (address)
);

CREATE TABLE DestinationLocation (
    link_id             INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, -- base64 characters
    destinationAddress  VARCHAR(100) NOT NULL, -- Google Maps address

    PRIMARY KEY (link_id, destinationAddress), -- url is used to uniquely identify all related addresses

    CONSTRAINT destination_link_fk
        FOREIGN KEY (link_id) REFERENCES
        LinkLUT (link_id),

    CONSTRAINT destination_address_fk
        FOREIGN KEY (destinationAddress) REFERENCES
        Address (address)
);