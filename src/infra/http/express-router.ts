import { Controller } from "@/application/controllers";

import { RequestHandler } from "express";

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return (async (req, res) => {
    const httpResponse = await controller.handle({ ...req.body });
    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.data);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message });
    }
  }) as RequestHandler;
};
