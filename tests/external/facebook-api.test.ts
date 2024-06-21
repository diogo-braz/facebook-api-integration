import { FacebookApi } from "@/infra/apis";
import { AxiosHttpClient } from "@/infra/http";
import { env } from "@/main/config/env";

describe("Facebook Api Integration Tests", () => {
  let axiosClient: AxiosHttpClient;
  let sut: FacebookApi;

  beforeEach(() => {
    axiosClient = new AxiosHttpClient();
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    );
  });

  it("should return a Facebook User if token is valid", async () => {
    const fbUser = await sut.loadUser({ token: "EAAFIi0ZBbqrABO4d3082BZCBFRlWXVEZCNilyon3QKMdpntoAwuw8V0DiB1d52qdk4ucdfn6EBEZBPPWB8ZBukjrd1dXrvtrSpKLoq2fcZBo1XIsbsf2GND13mupWM4Su28b0wjyZBDps5jwywcPygos3LfU3Rsk3EGn0tp7KSRQl0w3qcSJkph33q8kAq4YWsLNsjn6gLbxFkM32xnJuPjvSthaa4HrZCeSSdACa9kgCHxvjUUwyjweJAsHZCisgQwZDZD" });

    expect(fbUser).toEqual({
      facebookId: "7678879655565532",
      email: "xisipisilon97@gmail.com",
      name: "Diogo Braz"
    });
  });

  it("should return undefined if token is invalid", async () => {
    const fbUser = await sut.loadUser({ token: "invalid" });

    expect(fbUser).toBeUndefined();
  });
});
