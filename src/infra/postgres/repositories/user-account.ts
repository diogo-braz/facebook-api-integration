import { Repository } from "typeorm";

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { PgUser } from "@/infra/postgres/entities";

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;

export class PgUserAccountRepository implements LoadUserAccountRepository {
  constructor (private readonly pgUserRepository: Repository<PgUser>) {}

  async load (params: LoadParams): Promise<LoadResult> {
    const user = await this.pgUserRepository.findOneBy({ email: params.email });
    if (user) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      };
    }

    return;
  }

  async saveWithFacebook (params: SaveParams): Promise<void> {
    if (params.id === undefined) {
      await this.pgUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      });
    } else {
      await this.pgUserRepository.update({
        id: +params.id
      }, { name: params.name, facebookId: params.facebookId });
    }
  }
}
