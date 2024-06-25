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

type Input = { token: string };
type Output = { accessToken: string };
export type FacebookAuthentication = (params: Input) => Promise<Output>;

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, crypto) => async params => {
  const fbData = await facebookApi.loadUser(params);
  if (fbData !== undefined) {
    const accountData = await userAccountRepository.load({ email: fbData?.email });
    const fbAccount = new FacebookAccount(fbData, accountData);
    const { id } = await userAccountRepository.saveWithFacebook(fbAccount);
    const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs });
    return { accessToken };
  }
  throw new AuthenticationError();
};

