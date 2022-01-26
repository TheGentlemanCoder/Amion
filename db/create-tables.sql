DROP TABLE IF EXISTS StartingLocation;
DROP TABLE IF EXISTS DestinationLocation;

CREATE TABLE StartingLocation (
    link                CHAR(8), -- base64 characters
    locationAddress     VARCHAR(100) NOT NULL, -- Google Maps address

    PRIMARY KEY (link, locationAddress) -- url is used to uniquely identify all related addresses
);

CREATE TABLE DestinationLocation (
    link                CHAR(8), -- base64 characters
    destinationAddress  VARCHAR(100) NOT NULL, -- Google Maps address

    PRIMARY KEY (link, destinationAddress) -- url is used to uniquely identify all related addresses
);