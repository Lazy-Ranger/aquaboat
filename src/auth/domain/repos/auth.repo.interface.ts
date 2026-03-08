import { IAuthSession } from "../../contracts";
import { AuthSession } from "../entities";

export interface IAuthRepo {
  createSession(user: AuthSession): Promise<IAuthSession>;
}
