import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUserUseCase } from "../../../application/use-cases";
import { CreateUserDto } from "../dtos";
@Controller("/auth")
export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post("/register")
  register(@Body() body: CreateUserDto) {
    try {
      return this.registerUserUseCase.execute(body);
    } catch (err) {
      console.log(err);
      return {
        message: "User already exists"
      };
    }
  }

  login() {
    // login user
  }

  logout() {
    // logout user
  }
}
