import { MockProxy, mock } from "jest-mock-extended";

import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken, FacebookAccount } from "@/domain/models";
import { TokenGenerator } from "@/data/contracts/crypto";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthenticationService", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
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
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto
    );
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it("should call LoadUserAccountRepository when LoadFacebookUserApi returns data", async () => {
    await sut.perform({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: "any_fb_email" });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it("should call SaveFacebookAccountRepository with FacebookAccount", async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: "any" }));
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: "any" });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it("should call TokenGenerator with correct params", async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: "any_account_id",
      expirationInMs: AccessToken.expirationInMs
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it("should return an AccessToken on success", async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken("any_generated_token"));
  });

  it("should rethrow if LoadFacebookUserApi throws", async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error("fb_error"));
    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("fb_error"));
  });

  it("should rethrow if LoadUserAccountRepository throws", async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error("load_error"));
    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("load_error"));
  });

  it("should rethrow if SaveFacebookAccountRepository throws", async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error("save_error"));
    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("save_error"));
  });

  it("should rethrow if TokenGenerator throws", async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error("token_error"));
    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("token_error"));
  });
});
