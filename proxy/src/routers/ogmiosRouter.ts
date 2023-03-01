import { RequestHandler, Router } from 'express';
import { check } from 'express-validator';
import { checkValidationHandler } from '../api/middlewares';
import { Response, responseOk } from '../api/responses';
import { ogmiosController } from '../controllers/ogmiosController';

export const postDelegationsAndRewardsValidator = [
  check('stakeKeyHashes', 'stakeKeyHashes is required').exists(),
  check('stakeKeyHashes', 'stakeKeyHashes should be an array').isArray(),
  check('stakeKeyHashes.*', 'stakeKeyHashes should be an array of strings').isString()
];

/**
 * Returns an address given an ADA handler.
 * can return multiple values which matches the handle pattern
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const postDelegationsAndRewardsHandler: RequestHandler<any, any, { stakeKeyHashes: string[] }> = async (req, res, next): Promise<Response | void> => {
    const { stakeKeyHashes } = req.body;
    try {
        const result = await ogmiosController.getDelegationsAndRewards(stakeKeyHashes);
        return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

// Router definition - Not imported since we use only the oneBoxRouter
const router = Router();

router.post('/account/state/', postDelegationsAndRewardsValidator, checkValidationHandler, postDelegationsAndRewardsHandler);

export default router;
