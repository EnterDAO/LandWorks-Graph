import { Rent as EventRent } from '../../generated/MarketplaceFacet/IMarketplaceFacet';
import { common } from '../common';

export function handleRent(event: EventRent): void {
  const assetId = event.params._assetId.toString();
  const rentId = `${assetId}-${event.params._rentId.toString()}`;
  const renter = event.params._renter.toHexString();
  const paymentToken = event.params._paymentToken;

  const rent = common.createRentIfNotExists(rentId);
  rent.asset = assetId;
  rent.start = event.params._start;
  rent.end = event.params._end;
  rent.paymentToken = paymentToken.toHexString();
  rent.fee = event.params._rent.plus(event.params._protocolFee);
  common.createUserIfNotExists(renter);
  rent.renter = renter;
  rent.txHash = event.transaction.hash.toHexString();
  rent.timestamp = event.block.timestamp;
  rent.save();
  common.assetUpdateLatest(assetId, event.params._rent, rent.end, event.block.timestamp);
  common.incrementTotalRents();
}
