export class UserAlreadyRegisteredError extends Error {
  public readonly code = "ALREADY_EXISTS";

  public readonly description!: string;

  constructor(
    public readonly email: string,
    public readonly message: string = "User already registered."
  ) {
    super(message);
    this.description = `User with email \`${email}\` already registered.`;
  }
}
