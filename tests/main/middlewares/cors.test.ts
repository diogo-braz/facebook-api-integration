import request from "supertest";
import app from "@/main/config/app";

describe("Cors Middleware", () => {
  it("should enable cors", async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    });
    await request(app)
      .get("/test_cors")
      .expect("Access-Control-Allow-Origin", "*")
      .expect("Access-Control-Allow-Methods", "*")
      .expect("Access-Control-Allow-Headers", "*");
  });
});
