import { RequestHandler, Router } from 'express';
import { check } from 'express-validator';
import { checkValidationHandler } from '../api/middlewares';
import { Response, responseOk } from '../api/responses';
import { carpController } from '../controllers/carpController';
import { Asset, UtxoPointers } from '../model/carp';

const postAddressUsedValidator = [
  check("addresses", "addresses is required").exists(),
  check("afterTx", "afterTx is required").exists(),
  check("afterBlock", "afterBlock is required").exists(),
  check("untilBlock", "untilBlock is required").exists(),
];

const postAddressUsedHandler: RequestHandler<any, any, { addresses: string[]; afterTx: string; afterBlock: string; untilBlock: string }> = async (
    req,
    res,
    next,
): Promise<Response | void> => {
    const { addresses, afterTx, afterBlock, untilBlock } = req.body;
    try {
        const result = await carpController.getAddressUsed(addresses, afterTx, afterBlock, untilBlock);
        return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

const postBlockLatestValidator = [
  check("offset", "offset is required").exists().isNumeric(),
];

const postBlockLatestHandler: RequestHandler<any, any, { offset: number }> = async (req, res, next): Promise<Response | void> => {
    const { offset } = req.body;
    try {
        const result = await carpController.getBlockLatest(offset);
        return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

const postMetadataNftValidator = [
  check("assets", "assets is required").exists().isArray(),
];

const postMetadataNftHandler: RequestHandler<any, any, { assets: Asset[] }> = async (req, res, next): Promise<Response | void> => {
    const { assets } = req.body;
    try {
      const result = await carpController.getMetadataNft(assets);
      return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

const postTransactionHistoryValidator = [
  check("addresses", "addresses is required").exists(),
  check("afterTx", "afterTx is required").exists(),
  check("afterBlock", "afterBlock is required").exists(),
  check("untilBlock", "untilBlock is required").exists(),
  check("limit", "limit should be numeric").optional().isNumeric(),
  check("relationFilter", "relationFilter should be numeric").optional().isNumeric(),
];

const postTransactionHistoryHandler: RequestHandler<any, any, { addresses: string[]; afterTx: string; afterBlock: string; untilBlock: string, limit?: number, relationFilter?: number }> = async (req, res, next): Promise<Response | void> => {
    const { addresses, afterTx, afterBlock, untilBlock, limit, relationFilter } = req.body;
    try {
      const result = await carpController.getTransactionHistory(addresses, afterTx, afterBlock, untilBlock, limit, relationFilter);
      return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};


const postTransactionOutputValidator = [
  check("utxoPointers", "utxoPointers is required").exists().isArray(),
];

const postTransactionOutputHandler: RequestHandler<any, any, { utxoPointers: UtxoPointers[] }> = async (req, res, next): Promise<Response | void> => {
    const { utxoPointers } = req.body;
    try {
      const result = await carpController.getTransactionOutput(utxoPointers);
      return responseOk(res, result);
    } catch (err) {
        next(err);
    }
};

// Router definition
const router = Router();

router.post('/address/used', postAddressUsedValidator, checkValidationHandler, postAddressUsedHandler);
router.post('/block/latest', postBlockLatestValidator, checkValidationHandler, postBlockLatestHandler);
router.post('/metadata/nft', postMetadataNftValidator, checkValidationHandler, postMetadataNftHandler);
router.post('/transaction/history', postTransactionHistoryValidator, checkValidationHandler, postTransactionHistoryHandler);
router.post('/transaction/output', postTransactionOutputValidator, checkValidationHandler, postTransactionOutputHandler);

export default router;