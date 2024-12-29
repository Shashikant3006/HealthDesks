import express from 'express';
import { getWalletMoney ,addWalletMoney} from '../controllers/walletController.js';

const router = express.Router();

// Route to get wallet balance (both for patient and doctor)
router.get('/getbalance', getWalletMoney);
router.post('/addmoney',addWalletMoney);

export default router;
