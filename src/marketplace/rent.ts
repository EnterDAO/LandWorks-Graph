import { Rent as EventRent } from '../../generated/MarketplaceFacet/IMarketplaceFacet';
import { Rent } from '../../generated/schema';
import { common } from '../common';

export function handleRent(event: EventRent): void {
  const assetId = event.params._assetId.toString();
  const rentId = `${assetId}-${event.params._rentId.toString()}`;

  const rent = new Rent(rentId);
  rent.asset = event.params._assetId.toString();
  rent.start = event.params._start;
  rent.end = event.params._end;
  rent.fee = event.params._fee;
  rent.renter = event.params._renter.toString();
  common.assetUpdateLatest(assetId, rent.fee, rent.end);
  rent.save();

  common.incrementTotalRents();
}
