"use strict";
// import { RequestHandler, Router } from 'express';
// import { Response, responseOk } from '../api/responses';
// import { scrollsController } from '../services/scrollsService';
// /**
//  * Returns an address given an ADA handler.
//  * can return multiple values which matches the handle pattern
//  * @param req
//  * @param res
//  * @param next
//  * @returns
//  */
// export const getAddressForHandleHandler: RequestHandler<any, any> = async (req, res, next): Promise<Response | void> => {
//     try {
//         const result = await scrollsController.getAddressForHandle(req.params.handle);
//         return responseOk(res, result);
//     } catch (err) {
//         next(err);
//     }
// };
// /**
//  * Returns the latest block information
//  * @param req
//  * @param res
//  * @param next
//  * @returns
//  */
// export const getLatestBlockHandler: RequestHandler<any, any> = async (req, res, next): Promise<Response | void> => {
//     try {
//         const result = await scrollsController.getLatestBlock();
//         return responseOk(res, result);
//     } catch (err) {
//         next(err);
//     }
// };
// // Router definition - Not imported since we use only the oneBoxRouter
// const router = Router();
// router.get('/address/:handle', getAddressForHandleHandler);
// router.get('/block/', getLatestBlockHandler);
// export default router;
