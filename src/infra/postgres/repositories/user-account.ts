import { Repository } from "typeorm";

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { PgUser } from "@/infra/postgres/entities";

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  constructor (private readonly pgUserRepository: Repository<PgUser>) {}

  async load ({ email }: LoadParams): Promise<LoadResult> {
    const user = await this.pgUserRepository.findOneBy({ email });
    if (user) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      };
    }

    return;
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveParams): Promise<SaveResult> {
    let resultId: string;
    if (id === undefined) {
      const pgUser = await this.pgUserRepository.save({ email, name, facebookId });
      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await this.pgUserRepository.update({ id: parseInt(id) }, { name, facebookId });
    }
    return { id: resultId };
  }
}
