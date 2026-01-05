export class UnauthorizedError extends Error {
  public readonly code = "UNAUTHORIZED";

  public readonly description!: string;

  constructor(
    public readonly message = "Unauthorized.",
    public readonly metadata: Record<string, string> = {}
  ) {
    super(message);
    this.metadata = metadata;
  }
}
