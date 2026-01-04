import { Provider } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";

export default [JwtStrategy] as Provider[];
