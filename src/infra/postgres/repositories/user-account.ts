import { Repository } from "typeorm";

import { LoadUserAccountRepository } from "@/data/contracts/repositories";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepository implements LoadUserAccountRepository {
  constructor (private readonly userRepository: Repository<PgUser>) {}

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const user = await this.userRepository.findOneBy({ email: params.email });
    if (user) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      };
    }

    return;
  }
}
