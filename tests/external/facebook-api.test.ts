import { FacebookApi } from "@/infra/apis";
import { AxiosHttpClient } from "@/infra/http";
import { env } from "@/main/config/env";

describe("Facebook Api Integration Tests", () => {
  it("should return a Facebook User if token is valid", async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    );

    const fbUser = await sut.loadUser({ token: "" });

    expect(fbUser).toEqual({
      facebookId: "7678879655565532",
      email: "xisipisilon97@gmail.com",
      name: "Diogo Braz"
    });
  });

  it("should return undefined if token is invalid", async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    );

    const fbUser = await sut.loadUser({ token: "invalid" });

    expect(fbUser).toBeUndefined();
  });
});
