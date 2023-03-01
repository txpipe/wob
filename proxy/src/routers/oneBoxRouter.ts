import { Router } from 'express';
import { checkValidationHandler } from '../api/middlewares';
import { getPoolHandler, getRewardsHistoryHandler, transactionSubmitValidator, txSubmitHandler } from './blockfrostRouter';
import {
    postMetadataNftValidator,
    postMetadataNftHandler,
    postTransactionHistoryValidator,
    postTransactionHistoryHandler,
    postTransactionOutputValidator,
    postTransactionOutputHandler,
    postAddressUsedHandler,
    postAddressUsedValidator,
    postBlockLatestHandler,
    postBlockLatestValidator,
} from './carpRouter';
import { postDelegationsAndRewardsHandler, postDelegationsAndRewardsValidator } from './ogmiosRouter';
import { getAddressForHandleHandler, getLatestBlockHandler } from './scrollsRouter';
import { getTokenMetadata } from './tokenRegistryRouter';

// Router definition
const router = Router();

// Account State
router.post('/account/state/', postDelegationsAndRewardsValidator, checkValidationHandler, postDelegationsAndRewardsHandler);

// Pool
router.get('/pool/:poolId', getPoolHandler);

// Address
router.get('/address/:handle', getAddressForHandleHandler);
router.post('/address/used', postAddressUsedValidator, checkValidationHandler, postAddressUsedHandler);
router.get('/address/rewards/:stakeAddress', getRewardsHistoryHandler);

// Chain State
router.post('/block/latest', postBlockLatestValidator, checkValidationHandler, postBlockLatestHandler);
router.get('/block/', getLatestBlockHandler); // TODO: which one we keep

// Assets
router.post('/metadata/nft', postMetadataNftValidator, checkValidationHandler, postMetadataNftHandler);
router.get('/metadata/:subject', getTokenMetadata);

// Transaction routes
router.post('/tx/history', postTransactionHistoryValidator, checkValidationHandler, postTransactionHistoryHandler);
router.post('/tx/output', postTransactionOutputValidator, checkValidationHandler, postTransactionOutputHandler);
router.post('/tx/submit', transactionSubmitValidator, checkValidationHandler, txSubmitHandler);

export default router;
