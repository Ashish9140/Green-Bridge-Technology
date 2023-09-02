const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'cluster1'
});

client.connect()
    .then(() => {
        console.log('Connected to Cassandra');
        createTable();
    })
    .catch(err => {
        console.error('Error connecting to Cassandra', err);
    });

function createTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS smdata (
      alias text,
      filename text,
      filepath text,
      filetype text,
      duration int,
      date text,
      time text,
      latitude list<text>,
      longitude list<text>,
      ip text,
      iptype text,
      devicename text,
      devicebrand text,
      devicetype text,
      osname text,
      PRIMARY KEY (alias, date, time)
    );
  `;

    client.execute(createTableQuery)
        .then(() => {
            console.log('Table created successfully');
        })
        .catch((error) => console.error('Error creating table', error));
}

function insertData(data) {
    const insertQuery = `
      INSERT INTO files (
        alias,
        filename,
        filepath,
        filetype,
        duration,
        date,
        time,
        latitude,
        longitude,
        ip,
        iptype,
        devicename,
        devicebrand,
        devicetype,
        osname
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;


    const params = [
        data.alias,
        data.filename,
        data.filepath,
        data.filetype,
        data.duration,
        data.date,
        data.time,
        data.latitude,
        data.longitude,
        data.ip,
        data.iptype,
        data.devicename,
        data.devicebrand,
        data.devicetype,
        data.osname,
    ];

    client.execute(insertQuery, params, { prepare: true })
        .then(() => {
            console.log('Data inserted successfully');
        })
        .catch((error) => console.error('Error inserting data', error));
}

module.exports = { client, insertData };
