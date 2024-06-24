import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { PrismaClient } from "@prisma/client";

export class PrismaUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly prisma: PrismaClient;

  constructor () {
    this.prisma = new PrismaClient();
  }

  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const accountRepository = this.prisma.account;
    const account = await accountRepository.findFirst({ where: { email } });
    if (account !== null) {
      return {
        id: account.id.toString(),
        name: account.name ?? undefined
      };
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const accountRepository = this.prisma.account;
    const account = await accountRepository.upsert({
      where: { id: parseInt(id ?? "0") },
      create: { email, name, facebookId },
      update: { name, facebookId }
    });
    return { id: account.id.toString() };
  }
}
