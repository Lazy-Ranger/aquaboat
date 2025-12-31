export class IncorrectPasswordError extends Error {
  public readonly code = "IncorrectPassword";

  public readonly description!: string;

  constructor(
    public readonly email: string,
    public readonly message: string = "Incorrect password."
  ) {
    super(message);
    this.description = `User with email \`${email}\` entered incorrect password.`;
  }
}
