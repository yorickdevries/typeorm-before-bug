import { getConnection } from "typeorm";
import createDatabaseConnection from "./databaseConnection";
import UserEntity from "./models/UserEntity";

let stopCreating = false;
let createCounter = 0;
let updateCounter = 0;

const logConnectionInfo = function () {
  const connection = getConnection().driver as any;
  const pool = connection.pool;
  const connectionLimit = pool.config.connectionLimit;
  const allConnectionsLength = pool._allConnections.length;
  const freeConnectionsLength = pool._freeConnections.length;
  const queueConnectionsLength = pool._connectionQueue.length;
  // stop creating when queue is filled
  if (!stopCreating && queueConnectionsLength > 500) {
    stopCreating = true;
    console.log("createCounter", createCounter);
    console.log("updateCounter", updateCounter);
  }
  // debug info:
  console.log(
    `Connection info: Limit: ${connectionLimit}, All: ${allConnectionsLength}, Free: ${freeConnectionsLength} Queue: ${queueConnectionsLength}`
  );
  console.log(`Created ${createCounter} users, Updated ${updateCounter} users`);
};

const startLogging = function () {
  logConnectionInfo();
  setTimeout(startLogging, 1000);
};

const createAndEditRandomUser = function () {
  // create new student
  new UserEntity("First", "Last")
    .save()
    .then(() => {
      createCounter++;
    })
    .catch((error) => {
      console.log(error);
    });
  // find random user and update
  const randomUser = UserEntity.getRandomUser();
  randomUser
    .then((user) => {
      if (user) {
        user.firstName = String(Math.random());
        user
          .save()
          .then(() => {
            updateCounter++;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return;
};

const startUserCreationLoop = function () {
  createAndEditRandomUser();
  if (!stopCreating) {
    setTimeout(startUserCreationLoop, 50);
  }
};

const run = async function (): Promise<void> {
  console.log("Start test");

  // database connection with mysql database
  const connection = await createDatabaseConnection();
  console.log(connection.name);

  startLogging();
  startUserCreationLoop();

  console.log("Done test");
  return;
};

run()
  .then(() => {
    setTimeout(() => {
      console.log("finished succesfully");
      process.exit(0);
    }, 1000000000);
  })
  .catch((error) => {
    console.log(error);
    console.log("did not finish succesfully");
    process.exit(1);
  });
