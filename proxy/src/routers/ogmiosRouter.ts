import { RequestHandler, Router } from 'express';
import { Response, responseOk } from '../api/responses';
import { ogmiosController } from '../controllers/ogmiosController';

/**
 * Returns an address given an ADA handler.
 * can return multiple values which matches the handle pattern
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getDelegationsAndRewardsHandler: RequestHandler<any, any> = async (req, res, next): Promise<Response | void> => {
    try {
        const result = await ogmiosController.getDelegationsAndRewards(req.params.stakeKeyHashes);
        return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

// Router definition - Not imported since we use only the oneBoxRouter
const router = Router();

router.get('/account/state/:stakeKeyHashes', getDelegationsAndRewardsHandler);

export default router;
