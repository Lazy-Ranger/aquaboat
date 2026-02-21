import { Provider } from "@nestjs/common";
import { JwtAccessTokenStrategy } from "./access-token.strategy";
import { JwtRefreshAccessTokenStrategy } from "./refresh-token.strategy";

export default [JwtAccessTokenStrategy, JwtRefreshAccessTokenStrategy] as Provider[];
