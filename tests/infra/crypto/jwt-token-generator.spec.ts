import jwt from "jsonwebtoken";

import { TokenGenerator } from "@/data/contracts/crypto";

jest.mock("jsonwebtoken");

class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;
    return jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds });
  }
}

describe("JwtTokenGenerator", () => {
  let fakeJwt: jest.Mocked<typeof jwt>;
  let sut: JwtTokenGenerator;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => "any_token");
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator("any_secret");
  });

  it("should call sign with correct params", async () => {
    await sut.generateToken({ key: "any_key", expirationInMs: 1000 });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: "any_key" }, "any_secret", { expiresIn: 1 });
  });

  it("should return a token", async () => {
    const token = await sut.generateToken({ key: "any_key", expirationInMs: 1000 });

    expect(token).toBe("any_token");
  });
});
