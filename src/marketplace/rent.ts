import { Rent as EventRent } from '../../generated/MarketplaceFacet/IMarketplaceFacet';
import { common } from '../common';

export function handleRent(event: EventRent): void {
  const assetId = event.params._assetId.toString();
  const rentId = `${assetId}-${event.params._rentId.toString()}`;
  const renter = event.params._renter.toHexString();

  const rent = common.createRentIfNotExists(rentId);
  rent.asset = assetId;
  rent.start = event.params._start;
  rent.end = event.params._end;
  rent.fee = event.params._fee;
  common.createUserIfNotExists(renter);
  rent.renter = renter;
  rent.save();
  common.assetUpdateLatest(assetId, rent.fee, rent.end);
  common.incrementTotalRents();
}
