import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken } from "@/domain/entities";
import { UnauthorizedError } from "@/application/errors";
import { FacebookLoginController } from "@/application/controllers";
import { RequiredStringValidator } from "@/application/validation";

describe("FacebookLoginController", () => {
  let facebookAuthentication: jest.Mock;
  let sut: FacebookLoginController;
  let token: string;

  beforeAll(() => {
    facebookAuthentication = jest.fn();
    facebookAuthentication.mockResolvedValue(new AccessToken("any_value"));
    token  = "any_token";
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuthentication);
  });

  it("should build Validators correctlry", async () => {
    const validators = sut.buildValidators({ token });

    expect(validators).toEqual([
      new RequiredStringValidator("any_token", "token")
    ]);
  });

  it("should call FacebookAuthentication with correct params", async () => {
    await sut.handle({ token });

    expect(facebookAuthentication).toHaveBeenCalledWith({
      token
    });
    expect(facebookAuthentication).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if authentication fails", async () => {
    facebookAuthentication.mockResolvedValueOnce(new AuthenticationError());
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
});
