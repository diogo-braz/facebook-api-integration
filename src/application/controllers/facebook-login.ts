import { HttpResponse, ok, unauthorized } from "@/application/helpers";
import { ValidationBuilder as Builder, Validator } from "@/application/validation";
import { Controller } from "@/application/controllers";
import { FacebookAuthentication } from "@/domain/use-cases";

type HttpRequest = { token: string };
type Model = Error | { accessToken: string };

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuthentication({ token });
      return ok(accessToken);
    } catch (err) {
      return unauthorized();
    }

  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: token, fieldName: "token" }).required().build()
    ];
  }
}
