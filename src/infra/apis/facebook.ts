import { HttpGetClient } from "@/infra/http";
import { LoadFacebookUserApi } from "@/data/contracts/apis";

export class FacebookApi {
  private readonly baseUrl = "https://graph.facebook.com";

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials"
      }
    });
    await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        access_token: appToken.access_token,
        input_token: params.token
      }
    });
  }
}
