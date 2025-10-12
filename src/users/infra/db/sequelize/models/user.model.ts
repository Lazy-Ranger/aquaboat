import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Gender, IUser, UserStatus } from "../../../../contracts";
import { AddressModel } from "./address.model";

@Table({
  tableName: "users",
  timestamps: true,
})
export class UserModel extends Model<IUser> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: { len: [2, 50] },
  })
  firstName!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(50),
    validate: { len: [2, 50] },
  })
  lastName?: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  phone!: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
  })
  gender!: Gender;

  @AllowNull(true)
  @Column(DataType.STRING)
  picture?: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
  })
  status!: UserStatus;

  @ForeignKey(() => AddressModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  addressId!: number;

  @BelongsTo(() => AddressModel)
  address!: AddressModel;
}
