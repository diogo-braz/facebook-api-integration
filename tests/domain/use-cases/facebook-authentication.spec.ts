import { MockProxy, mock } from "jest-mock-extended";

import { LoadFacebookUserApi } from "@/domain/contracts/apis";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/domain/contracts/repositories";
import { setupFacebookAuthentication, FacebookAuthentication } from "@/domain/use-cases";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";
import { TokenGenerator } from "@/domain/contracts/crypto";

jest.mock("@/domain/entities/facebook-account");

describe("FacebookAuthentication", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
  let sut: FacebookAuthentication;
  let token: string;

  beforeAll(() => {
    token = "any_token";
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      facebookId: "any_fb_id",
      name: "any_fb_name",
      email: "any_fb_email"
    });
    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: "any_account_id" });
    crypto = mock();
    crypto.generateToken.mockResolvedValue("any_generated_token");
  });

  beforeEach(() => {
    sut = setupFacebookAuthentication(
      facebookApi,
      userAccountRepository,
      crypto
    );
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should throw AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new AuthenticationError());
  });

  it("should call LoadUserAccountRepository when LoadFacebookUserApi returns data", async () => {
    await sut({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: "any_fb_email" });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it("should call SaveFacebookAccountRepository with FacebookAccount", async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: "any" }));
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: "any" });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it("should call TokenGenerator with correct params", async () => {
    await sut({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: "any_account_id",
      expirationInMs: AccessToken.expirationInMs
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it("should return an AccessToken on success", async () => {
    const authResult = await sut({ token });

    expect(authResult).toEqual({ accessToken: "any_generated_token" });
  });

  it("should rethrow if LoadFacebookUserApi throws", async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error("fb_error"));
    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error("fb_error"));
  });

  it("should rethrow if LoadUserAccountRepository throws", async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error("load_error"));
    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error("load_error"));
  });

  it("should rethrow if SaveFacebookAccountRepository throws", async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error("save_error"));
    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error("save_error"));
  });

  it("should rethrow if TokenGenerator throws", async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error("token_error"));
    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error("token_error"));
  });
});
