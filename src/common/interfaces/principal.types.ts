import { OneOfPrincipalClaim } from "../../auth/contracts/jwt.types";

export interface IPrincipal<TClaim = OneOfPrincipalClaim> {
  id: string; // user.id | service.id | jwt.sub

  claim: TClaim;

  // ability: unknown; // user.ability | service.ability -> permissions
}
