import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { TokenGenerator } from "@/data/contracts/crypto";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { FacebookAccount } from "@/domain/models";

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: fbData?.email });
      const fbAccount = new FacebookAccount(fbData, accountData);
      const { id } = await this.userAccountRepository.saveWithFacebook(fbAccount);
      await this.crypto.generateToken({ key: id });
    }
    return new AuthenticationError();
  }
}

