export class UserAlreadyExistsError extends Error {
  public readonly code = "ALREADY_EXISTS";

  public readonly description!: string;

  constructor(
    public readonly email: string,
    public readonly id: string,
    public readonly message: string = "User already exists.",
  ) {
    super(message);
    this.description = `User \`${email}\` already exists with id \`${id}\`.`;
  }
}
