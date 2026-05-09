import { ISession } from "../../contracts";
import { Session } from "../entities";

export interface ISessionRepo {
  create(user: Session): Promise<ISession>;
}
