import { ConnectionOptions } from "typeorm";
import UserEntity from "./models/UserEntity";

const entityList = [UserEntity];

const ormConfig: ConnectionOptions = {
  type: "mariadb",
  entities: entityList,
  synchronize: true,
  logging: false,
  host: "localhost",
  port: 3306,
  username: "test",
  password: "password",
  database: "test",
  extra: { connectionLimit: 3 },
};

export = ormConfig;
