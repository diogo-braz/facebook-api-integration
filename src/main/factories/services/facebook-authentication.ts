import { FacebookAuthenticationService } from "@/domain/services";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePrismaUserAccountRepository } from "@/main/factories/repositories";
import { makeJwtTokenGenerator } from "@/main/factories/crypto";

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePrismaUserAccountRepository(),
    makeJwtTokenGenerator()
  );
};
