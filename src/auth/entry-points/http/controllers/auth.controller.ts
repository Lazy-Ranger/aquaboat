import { Body, Controller, Post } from "@nestjs/common";

@Controller("/auth")
export class AuthController {
  constructor() {}

  @Post("/register")
  register(@Body() body: any) {
    return {
      message: "User registered successfully"
    };
  }

  login() {
    // login user
  }

  logout() {
    // logout user
  }
}
