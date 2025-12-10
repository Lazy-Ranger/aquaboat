import { IOffsetPaginationResult, IUserSearchParams } from "../../contracts";
import { User } from "../entities";

export interface IUserRepo {
  create(user: User): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  updateById(id: string, user: Partial<User>): Promise<User | null>;

  deleteById(id: string): Promise<void>;

  searchUsers(query: IUserSearchParams): Promise<IOffsetPaginationResult<User>>;
}
