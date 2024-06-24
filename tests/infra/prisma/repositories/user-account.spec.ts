import { PrismaClient } from "@prisma/client";

import { PrismaHelper } from "@/tests/infra/prisma/helpers";
import { PrismaUserAccountRepository } from "@/infra/prisma/repositories/user-account";

describe("PrismaUserAccount Repository", () => {
  let sut: PrismaUserAccountRepository;
  let prisma: PrismaClient;

  beforeEach(async () => {
    sut = new PrismaUserAccountRepository();
    prisma = await PrismaHelper.connect();
  });

  afterAll(async () => {
    await PrismaHelper.disconnect();
  });

  afterEach(async () => {
    const prisma = await PrismaHelper.connect();
    await prisma.account.deleteMany({});
    await PrismaHelper.disconnect();
  });

  describe("loadByEmail", () => {
    it("should return an account if email exists", async () => {
      const result = await prisma.account.create({
        data: {
          email: "any_email"
        }
      });

      const account = await sut.load({ email: "any_email" });

      expect(account).toEqual({ id: result.id.toString(), name: undefined });
    });

    it("should return undefined if email does not exists", async () => {
      const account = await sut.load({ email: "any_email" });

      expect(account).toBeUndefined();
    });
  });

  describe("saveWithFacebook", () => {
    it("should create an account if id is undefined", async () => {
      const { id } = await sut.saveWithFacebook({
        email: "any_email",
        name: "any_name",
        facebookId: "any_fb_id"
      });
      const account = await prisma.account.findMany({ where: { email: "any_email" } });

      expect(account.length).toBe(1);
      expect(id).toBe(account[0].id.toString());
      expect(account[0]?.name).toBe("any_name");
      expect(account[0]?.facebookId).toBe("any_fb_id");
    });

    it("should update an account if id is defined", async () => {
      const result = await prisma.account.create({
        data: {
          email: "any_email",
          name: "any_name",
          facebookId: "any_fb_id"
        }
      });
      const { id } = await sut.saveWithFacebook({
        id: result.id.toString(),
        email: "other_email",
        name: "other_name",
        facebookId: "other_fb_id"
      });
      const account = await prisma.account.findMany({ where: { id: result.id } });

      expect(account.length).toBe(1);
      expect(id).toBe(account[0].id.toString());
      expect(account[0]).toMatchObject({
        id: result.id,
        email: "any_email",
        name: "other_name",
        facebookId: "other_fb_id"
      });
    });
  });
});
