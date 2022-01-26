const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    database: process.env.MARIADB_DATABASE,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    connectionLimit: 10
});

async function fetchStartingLocations(link) {
    const link_id = await getLinkID(link);
    const parameterized_query = "SELECT a.address, a.latitude, a.longitude \
                                 FROM StartingLocation sl JOIN Address a ON (sl.startingAddress = a.address) \
                                 WHERE sl.link_id = (?)";

    return await pool.getConnection()
        .then(async (conn) => {
            const response = await conn.query(parameterized_query, [link_id]);
            await conn.commit();

            const startingLocations = response.slice(-1);
            return startingLocations;
        }).catch((error) => {
            console.log("[-] MariaDB Error: ", error);
            return false;
        });
}

async function fetchDestinationLocations(link) {
    const link_id = await getLinkID(link);
    const parameterized_query = "SELECT a.address, a.latitude, a.longitude \
                                 FROM DestinationLocation sl JOIN Address a ON (sl.destinationAddress = a.address) \
                                 WHERE sl.link_id = (?)";

    return await pool.getConnection()
        .then(async (conn) => {
            const response = await conn.query(parameterized_query, [link_id]);
            await conn.commit();

            const destinationLocations = response.slice(-1);
            return destinationLocations;
        }).catch((error) => {
            console.log("[-] MariaDB Error: ", error);
            return false;
        });
}

async function linkExists(link) {
    const parameterized_query = "SELECT COUNT(*) FROM LinkLUT WHERE link = (?)";

    return await pool.getConnection()
        .then(async (conn) => {
            const response = await conn.query(parameterized_query, [link]);
            await conn.commit();

            const count = response[0]['COUNT(*)']
            console.log("Count: ", count);
            if (count > 0) {
                return true;
            } else {
                return false;
            }
        }).catch((error) => {
            console.log("[-] MariaDB Error: ", error);
            return false;
        });
}

async function insertStartingLocation(link, address, latitude, longitude) {
    // insert address so foreign key constraint is satisfied
    await insertAddress(address, latitude, longitude);
    await insertLink(link);
    const link_id = await getLinkID(link);

    const parameterized_query = "INSERT INTO StartingLocation VALUES (?, ?)";

    pool.getConnection()
        .then(async (conn) => {
            await conn.query(parameterized_query, [link_id, address]);
            await conn.commit();
        }).catch((error) => {
            console.log("[-] MariaDB Error: ", error);
        });
}

async function insertDestinationLocation(link, address, latitude, longitude) {
    // insert address so foreign key constraint is satisfied
    await insertAddress(address, latitude, longitude);
    await insertLink(link);
    const link_id = await getLinkID(link);

    const parameterized_query = "INSERT INTO DestinationLocation VALUES (?, ?)";

    pool.getConnection()
        .then(async (conn) => {
            await conn.query(parameterized_query, [link_id, address]);
            await conn.commit();
        }).catch((error) => {
            console.log("[-] MariaDB Error: ", error);
        });
}

async function insertAddress(address, latitude, longitude) {
    const parameterized_query = "INSERT INTO Address VALUES (?, ?, ?)";

    pool.getConnection()
        .then(async (conn) => {
            await conn.query(parameterized_query, [address, latitude, longitude]);
            await conn.commit();
        }).catch((error) => {
            if (error.toString().includes("Duplicate entry")) {
                console.log("[*] Duplicate entry");
                return;
            } else {
                console.log("[-] MariaDB Error: ", error);
            }
        });
}

async function insertLink(link) {
    if (await linkExists(link)) {
        // link already exiss in the database
        return;
    }

    // link does not already exist in the database

    const parameterized_query = "INSERT INTO LinkLUT (link) VALUES (?)";

    pool.getConnection()
        .then(async (conn) => {
            await conn.query(parameterized_query, [link]);
            await conn.commit();
        }).catch((error) => {
            console.log("[-] MariaDB Error: ", error);
        });
}

async function getLinkID(link) {
    const parameterized_query = "SELECT lut.link_id FROM LinkLUT lut WHERE lut.link = (?)";

    return await pool.getConnection()
        .then(async (conn) => {
            const response = await conn.query(parameterized_query, [link]);
            conn.commit();
            return response[0]["link_id"];
        }).catch((error) => {
            console.log("[-] MariaDB Error: ", error);
            return -1;
        });
}

module.exports = {
    fetchStartingLocations: fetchStartingLocations,
    fetchDestinationLocations: fetchDestinationLocations,
    linkExists: linkExists,
    insertStartingLocation: insertStartingLocation,
    insertDestinationLocation: insertDestinationLocation
}