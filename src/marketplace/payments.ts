import { ClaimRentFee, SetFee, SetTokenPayment } from '../../generated/FeeFacet/IFeeFacet';
import { common } from '../common';

export function handleSetFee(event: SetFee): void {
  const id = event.params._token;

  const paymentToken = common.createPaymentTokenIfNotExists(id);
  paymentToken.feePercentage = event.params._fee;
  paymentToken.save();
}

export function handleSetTokenPayment(event: SetTokenPayment): void {
  const id = event.params._token;

  const paymentToken = common.createPaymentTokenIfNotExists(id);
  paymentToken.isRemoved = !event.params._status;
  paymentToken.save();
}

export function handleClaimRentFee(event: ClaimRentFee): void {
  const assetId = event.params._assetId.toString();
  const txHash = event.transaction.hash.toHexString();
  const id = `${assetId}-${txHash}-${event.transactionLogIndex.toString()}`;
  const receiver = event.params._recipient.toHexString();
  const paymentToken = event.params._token;

  const asset = common.createAssetIfNotExists(assetId);
  asset.unclaimedRentFee = asset.unclaimedRentFee.minus(event.params._amount);
  asset.save();
  common.createUserIfNotExists(receiver);
  common.createPaymentTokenIfNotExists(paymentToken);

  const claimHistory = common.createClaimHistoryIfNotExists(id);
  claimHistory.asset = assetId;
  claimHistory.receiver = receiver;
  claimHistory.txHash = txHash;
  claimHistory.timestamp = event.block.timestamp;
  claimHistory.amount = event.params._amount;
  claimHistory.paymentToken = paymentToken.toHexString();
  claimHistory.metaverse = asset.metaverse;
  claimHistory.save();
}
