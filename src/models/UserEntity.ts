import {
  Entity,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  getConnection,
} from "typeorm";

@Entity()
export default class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName: string;
  @Column()
  lastName: string;

  constructor(firstName: string, lastName: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // validateOrReject to be run before saving/updating by TypeORM
  @BeforeInsert()
  @BeforeUpdate()
  async beforeFunction(): Promise<void> {
    await UserEntity.findOne();
    console.log("Running before Insert/update");
    return;
  }

  static async getRandomUser(): Promise<UserEntity | undefined> {
    const connection = getConnection();
    const randomUser = connection
      .createQueryBuilder(this, "user")
      .orderBy("RAND()")
      .limit(1)
      .getOne();
    return randomUser;
  }
}
