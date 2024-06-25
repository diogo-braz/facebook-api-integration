import { FacebookAuthentication, setupFacebookAuthentication } from "@/domain/use-cases";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePrismaUserAccountRepository } from "@/main/factories/repositories";
import { makeJwtTokenGenerator } from "@/main/factories/crypto";

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePrismaUserAccountRepository(),
    makeJwtTokenGenerator()
  );
};
