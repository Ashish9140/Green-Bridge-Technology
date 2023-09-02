const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'cluster1'
});

client.connect()
  .then(() => {
    console.log('Connected to Cassandra');
    createFilesTable();
    createUsersTable();
  })
  .catch(err => {
    console.error('Error connecting to Cassandra', err);
  });

function createFilesTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS files (
      alias text,
      filename text,
      filepath text,
      filetype text,
      duration int,
      date text,
      time text,
      latitude list<text>,
      longitude list<text>,
      timestamp list<text>,
      altitude list<text>,
      ip text,
      iptype text,
      devicename text,
      devicebrand text,
      devicetype text,
      osname text,
      event_time text,
      PRIMARY KEY (alias, event_time)
    );
  `;

  client.execute(createTableQuery)
    .then(() => {
      console.log('Files table created successfully');
    })
    .catch((error) => console.error('Error creating files table', error));
}

function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      alias text,
      companyname text,
      name text,
      avatar text,
      email text,
      password text,
      PRIMARY KEY (alias)
    );
  `;

  client.execute(createTableQuery)
    .then(() => {
      console.log('Users table created successfully');
    })
    .catch((error) => console.error('Error creating users table', error));
}

function insertFileData(data) {
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
      timestamp,
      altitude,
      ip,
      iptype,
      devicename,
      devicebrand,
      devicetype,
      osname,
      event_time
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
    data.timestamp,
    data.altitude,
    data.ip,
    data.iptype,
    data.devicename,
    data.devicebrand,
    data.devicetype,
    data.osname,
    data.event_time
  ];

  client.execute(insertQuery, params, { prepare: true })
    .then(() => {
      console.log('File data inserted successfully');
    })
    .catch((error) => console.error('Error inserting file data', error));
}

function insertUserData(data) {
  const insertQuery = `
    INSERT INTO users (
      alias,
      companyname,
      name,
      avatar,
      email,
      password
    )
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  const params = [
    data.alias,
    data.companyname,
    data.name,
    data.avatar,
    data.email,
    data.password
  ];

  client.execute(insertQuery, params, { prepare: true })
    .then(() => {
      console.log('User data inserted successfully');
    })
    .catch((error) => console.error('Error inserting user data', error));
}

module.exports = { client, insertFileData, insertUserData };
