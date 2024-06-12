import { Repository } from "typeorm";

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { PgUser } from "@/infra/postgres/entities";

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
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

  async saveWithFacebook (params: SaveParams): Promise<SaveResult> {
    let id: string;
    if (params.id === undefined) {
      const pgUser = await this.pgUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      });
      id = pgUser.id.toString();
    } else {
      id = params.id;
      await this.pgUserRepository.update({
        id: +params.id
      }, { name: params.name, facebookId: params.facebookId });
    }
    return { id };
  }
}
