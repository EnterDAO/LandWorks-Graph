import { Rent as EventRent } from '../../generated/MarketplaceFacet/IMarketplaceFacet';
import { common } from '../common';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleRent(event: EventRent): void {
  const assetId = event.params._assetId.toString();
  const rentId = `${assetId}-${event.params._rentId.toString()}`;
  const renter = event.params._renter.toHexString();
  const paymentToken = event.params._paymentToken;
  const payment = common.createPaymentTokenIfNotExists(paymentToken);
  const unclaimedRentFee = event.params._fee.times(payment.feePercentage).div(BigInt.fromI32(100_000)); // TODO: update on version after audit

  const rent = common.createRentIfNotExists(rentId);
  rent.asset = assetId;
  rent.start = event.params._start;
  rent.end = event.params._end;
  rent.paymentToken = paymentToken.toHexString();
  rent.fee = event.params._fee;
  common.createUserIfNotExists(renter);
  rent.renter = renter;
  rent.txHash = event.transaction.hash.toHexString();
  rent.save();
  common.assetUpdateLatest(assetId, unclaimedRentFee, rent.end);
  common.incrementTotalRents();
}
