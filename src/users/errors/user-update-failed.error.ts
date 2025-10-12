export class UserUpdateFailedError extends Error {
  public readonly code = "INTERNAL";

  public readonly description!: string;

  constructor(
    public readonly id: string,
    public readonly message: string = "User update failed.",
  ) {
    super(message);
    this.description = `Cannot update user with id \`${id}\`.`;
  }
}
