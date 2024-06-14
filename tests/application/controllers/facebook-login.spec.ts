import { MockProxy, mock } from "jest-mock-extended";

import { FacebookAuthentication } from "@/domain/features";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken } from "@/domain/models";
import { RequiredFieldError, ServerError } from "@/application/errors";
import { FacebookLoginController } from "@/application/controllers";

describe("FacebookLoginController", () => {
  let facebookAuthentication: MockProxy<FacebookAuthentication>;
  let sut: FacebookLoginController;

  beforeAll(() => {
    facebookAuthentication = mock();
    facebookAuthentication.perform.mockResolvedValue(new AccessToken("any_value"));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuthentication);
  });

  it("should return 400 if token is empty", async () => {
    const httpResponse = await sut.handle({ token: "" });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("token")
    });
  });

  it("should return 400 if token is null", async () => {
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("token")
    });
  });

  it("should return 400 if token is undefined", async () => {
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("token")
    });
  });

  it("should call FacebookAuthentication with correct params", async () => {
    await sut.handle({ token: "any_token" });

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({
      token: "any_token"
    });
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if authentication fails", async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token: "any_token" });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    });
  });

  it("should return 200 if authentication succeeds", async () => {
    const httpResponse = await sut.handle({ token: "any_token" });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: "any_value"
      }
    });
  });

  it("should return 500 if authentication throws", async () => {
    const error = new Error("infra_error");
    facebookAuthentication.perform.mockRejectedValueOnce(error);
    const httpResponse = await sut.handle({ token: "any_token" });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    });
  });
});
