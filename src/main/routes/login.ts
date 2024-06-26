import { Router } from "express";

import { makeFacebookLoginController } from "@/main/factories/controllers";
import { adaptExpressRoute } from "@/main/adapters";

export default (router: Router): void => {
  router.post("/login/facebook", adaptExpressRoute(makeFacebookLoginController()));
};
