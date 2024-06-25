import { LoadFacebookUserApi } from "@/domain/contracts/apis";
import { TokenGenerator } from "@/domain/contracts/crypto";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/domain/contracts/repositories";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepository:
    LoadUserAccountRepository &
    SaveFacebookAccountRepository,
  crypto: TokenGenerator
) => FacebookAuthentication;

export type FacebookAuthentication = (params: { token: string }) => Promise<AccessToken | AuthenticationError>;

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, crypto) => async params => {
  const fbData = await facebookApi.loadUser(params);
  if (fbData !== undefined) {
    const accountData = await userAccountRepository.load({ email: fbData?.email });
    const fbAccount = new FacebookAccount(fbData, accountData);
    const { id } = await userAccountRepository.saveWithFacebook(fbAccount);
    const token = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs });
    return new AccessToken(token);
  }
  return new AuthenticationError();
};

