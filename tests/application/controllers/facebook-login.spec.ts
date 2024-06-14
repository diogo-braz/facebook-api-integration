import { MockProxy, mock } from "jest-mock-extended";

import { FacebookAuthentication } from "@/domain/features";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken } from "@/domain/models";
import { ServerError, UnauthorizedError } from "@/application/errors";
import { FacebookLoginController } from "@/application/controllers";
import { RequiredStringValidator } from "@/application/validation";

jest.mock("@/application/validation/required-string");

describe("FacebookLoginController", () => {
  let facebookAuthentication: MockProxy<FacebookAuthentication>;
  let sut: FacebookLoginController;
  let token: string;

  beforeAll(() => {
    facebookAuthentication = mock();
    facebookAuthentication.perform.mockResolvedValue(new AccessToken("any_value"));
    token  = "any_token";
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuthentication);
  });

  it("should return 400 if validation fails", async () => {
    const error = new Error("validation_error");
    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }));
    jest.mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy);

    const httpResponse = await sut.handle({ token });

    expect(RequiredStringValidator).toHaveBeenCalledWith("any_token", "token");
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    });
  });

  it("should call FacebookAuthentication with correct params", async () => {
    await sut.handle({ token });

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({
      token
    });
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if authentication fails", async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    });
  });

  it("should return 200 if authentication succeeds", async () => {
    const httpResponse = await sut.handle({ token });

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
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    });
  });
});
