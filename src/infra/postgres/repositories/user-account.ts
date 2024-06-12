import { Repository } from "typeorm";

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepository implements LoadUserAccountRepository {
  constructor (private readonly pgUserRepository: Repository<PgUser>) {}

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const user = await this.pgUserRepository.findOneBy({ email: params.email });
    if (user) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      };
    }

    return;
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const account = await this.pgUserRepository.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId
    });
    return { id: account.id.toString() };
  }
}
