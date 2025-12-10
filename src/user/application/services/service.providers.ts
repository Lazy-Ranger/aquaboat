import { Provider } from "@nestjs/common";
import { UserService } from "./user.service";

export default [UserService] as Provider[];
