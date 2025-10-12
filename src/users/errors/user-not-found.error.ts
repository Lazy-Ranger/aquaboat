import { RetrieveUserBy } from "../contracts";

export class UserNotFoundError extends Error {
  public readonly code = "NOT_FOUND";

  public readonly description!: string;

  constructor(
    public readonly value: string,
    searchBy: RetrieveUserBy = RetrieveUserBy.ID,
    public readonly message: string = "User not found.",
  ) {
    super(message);
    this.description = `User with \`${searchBy}\` \`${value}\` not found.`;
  }
}
