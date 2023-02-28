import { RequestHandler, Router } from "express";
import { Response, responseOk } from "../api/responses";
import { scrollsController } from "../controllers/scrollsController";

/**
 * Returns an address given an ADA handler.
 * can return multiple values which matches the handle pattern
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const getAddressForHandleHandler: RequestHandler<any, any> = async (
  req,
  res,
  next
): Promise<Response | void> => {
  try {
    const result = await scrollsController.getAddressForHandle(
      req.params.handle
    );
    return responseOk(res, result);
  } catch (err) {
    next(err);
  }
};

/**
 * Returns the latest block information
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const getLatestBlockHandler: RequestHandler<any, any> = async (
  req,
  res,
  next
): Promise<Response | void> => {
  try {
    const result = await scrollsController.getLatestBlock();
    return responseOk(res, result);
  } catch (err) {
    next(err);
  }
};


// Router definition
const router = Router();

router.get("/address/:handle", getAddressForHandleHandler);
router.get("/block/", getLatestBlockHandler);

export default router;
