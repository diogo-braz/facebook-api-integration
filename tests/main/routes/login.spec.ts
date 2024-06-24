import request from "supertest";

import app from "@/main/config/app";
import { UnauthorizedError } from "@/application/errors";

describe("Login Routes", () => {
  describe("POST /login/facebook", () => {
    const loadUserSpy = jest.fn();
    jest.mock("@/infra/apis/facebook", () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }));

    it("should return 200 with AccessToken", async () => {
      loadUserSpy.mockResolvedValueOnce({
        facebookId: "any_id",
        name: "any_name",
        email: "any_email"
      });

      const { status, body } = await request(app)
        .post("/api/login/facebook")
        .send({ token: "valid_token" });

      expect(status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(body.accessToken).toBeDefined();
    });

    it("should return 401 with UnauthorizaedError", async () => {
      const { status, body } = await request(app)
        .post("/api/login/facebook")
        .send({ token: "invalid_token" });

      expect(status).toBe(401);
      expect(body).toEqual({ error: new UnauthorizedError().message });
    });
  });
});
