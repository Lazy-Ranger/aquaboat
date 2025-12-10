import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { IAddress } from "../../../../contracts";

@Table({
  tableName: "addresses",
  timestamps: true,
})
export class AddressModel extends Model<IAddress> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  line1!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  line2?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  city!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  state!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  country!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  postalCode!: string;
}
