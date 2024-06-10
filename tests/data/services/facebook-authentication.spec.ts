import { MockProxy, mock } from "jest-mock-extended";

import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { LoadUserAccountRepository } from "@/data/contracts/repositories";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";

describe("FacebookAuthenticationService", () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = "any_token";

  beforeEach(() => {
    loadFacebookUserApi = mock();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      facebookId: "any_fb_id",
      name: "any_fb_name",
      email: "any_fb_email"
    });
    loadUserAccountRepository = mock();
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository);
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it("should call LoadUserAccountRepository when LoadFacebookUserApi returns data", async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: "any_fb_email" });
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1);
  });
});
