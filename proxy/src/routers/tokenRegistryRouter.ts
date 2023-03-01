import { RequestHandler, Router } from 'express';
import { Response, responseOk } from '../api/responses';
import { tokenRegistryController } from '../controllers/tokenRegistryController';

/**
 * Returns the metadata of a token given its subject
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getTokenMetadata: RequestHandler<any, any> = async (req, res, next): Promise<Response | void> => {
    try {
        const result = await tokenRegistryController.getTokenMetadata(req.params.policyId, req.params.name);
        return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

// Router definition - Not imported since we use only the oneBoxRouter
const router = Router();

router.get('/metadata/:policyId/:name', getTokenMetadata);

export default router;
