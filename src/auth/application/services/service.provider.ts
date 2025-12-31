import { Provider } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth-guard.service";
import { JwtStrategy } from "./jwt.strategy.service";

export default [JwtStrategy, JwtAuthGuard] as Provider[];
