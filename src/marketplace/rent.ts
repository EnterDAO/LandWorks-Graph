import { Rent as EventRent } from '../../generated/RentFacet/IRentFacet';
import { AccrueReferralFee as EventAccrueReferralFee } from '../../generated/RentFacet/IRentFacet';
import { common } from '../common';

export function handleRent(event: EventRent): void {
  const assetId = event.params._assetId.toString();
  const rentId = `${assetId}-${event.params._rentId.toString()}`;
  const renter = event.params._renter.toHexString();
  const paymentToken = event.params._paymentToken;

  const asset = common.createAssetIfNotExists(assetId);
  const rent = common.createRentIfNotExists(rentId);
  rent.asset = assetId;
  rent.start = event.params._start;
  rent.end = event.params._end;
  rent.paymentToken = paymentToken.toHexString();
  rent.fee = rent.fee.plus(event.params._rent.plus(event.params._protocolFee));
  common.createUserIfNotExists(renter);
  rent.renter = renter;
  rent.txHash = event.transaction.hash.toHexString();
  rent.timestamp = event.block.timestamp;
  rent.metaverse = asset.metaverse;
  rent.save();
  common.assetUpdateLatest(assetId, event.params._rent, rent.end, event.block.timestamp);
  common.incrementTotalRents();
}

export function handleAccrueReferralFee(event: EventAccrueReferralFee): void {
  const assetId = event.params._assetId.toString();
  const rentId = `${assetId}-${event.params._rentId.toString()}`;
  const referrer = event.params._referrer.toHexString();
  const paymentToken = event.params._paymentToken.toHexString();

  const rent = common.createRentIfNotExists(rentId);
  rent.fee = rent.fee.plus(event.params._fee);
  rent.save();

  common.createUserIfNotExists(referrer);
  const referralReward = common.createUserReferralRewardIfNotExists(referrer, paymentToken);
  referralReward.amount = referralReward.amount.plus(event.params._fee);
  referralReward.save();
}
