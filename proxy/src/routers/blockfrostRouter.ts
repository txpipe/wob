import { RequestHandler, Router } from 'express';
import { check } from 'express-validator';
import { blockfrostController } from '../controllers/blockfrostController';
import { checkValidationHandler } from '../api/middlewares';
import { Response, responseOk } from '../api/responses';

/**
 * Handler for getting rewards history given a stake address
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getRewardsHistoryHandler: RequestHandler<any, any> = async (req, res, next): Promise<Response | void> => {
    try {
        const result = await blockfrostController.getRewardsHistory(req.params.stakeAddress);
        return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

/**
 * Handler for getting info of a pool given its id
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getPoolHandler: RequestHandler<any, any> = async (req, res, next): Promise<Response | void> => {
    try {
        const result = await blockfrostController.getPoolInfo(req.params.poolId);
        return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

// Validator for tx submit
export const transactionSubmitValidator = [
    check('cbor', 'cbor is required').exists(),
    check('cbor', 'cbor should be the encoded transaction in string format').isString(),
];

/**
 * Handler for submitting a transaction cbor
 * @param req
 * @param res
 * @param next
 */
export const txSubmitHandler: RequestHandler<any, any, { cbor: string }> = async (req, res, next): Promise<Response | void> => {
    const { cbor } = req.body;
    try {
        const tx = await blockfrostController.postTransactionSubmit(cbor);
    } catch (err) {
        next(err);
    }
};

// Router definition - Not imported since we use only the oneBoxRouter
const router = Router();

router.get('/rewards/:stakeAddress', getRewardsHistoryHandler);
router.get('/pool/:poolId', getPoolHandler);
router.post('/tx/submit', transactionSubmitValidator, checkValidationHandler, txSubmitHandler);

export default router;
