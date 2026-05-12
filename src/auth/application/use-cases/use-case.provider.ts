import { CreateSessionUseCase } from "./create-session.use-case";
import { IssueTokensUseCase } from "./issue-tokens.use-case";
import { LoginUserUseCase } from "./login-user.use-case";
import { LogoutUserAllDeviceUseCase } from "./logout-all-device.user-case";
import { LogoutUserUseCase } from "./logout-user.use-case";
import { RefreshTokensUseCase } from "./refresh-token.use-case";
import { RegisterUserUseCase } from "./register-user.use-case";

export default [
  IssueTokensUseCase,
  RegisterUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshTokensUseCase,
  CreateSessionUseCase,
  LogoutUserAllDeviceUseCase
];
