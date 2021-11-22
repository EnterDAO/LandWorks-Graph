import { constants } from '../constants';

import { Delist, List, UpdateConditions, Withdraw } from '../../generated/MarketplaceFacet/IMarketplaceFacet';
import { common } from '../common';

export function handleList(event: List): void {
  const asset = common.createAssetIfNotExists(event.params._assetId.toString());
  asset.metaverse = event.params._metaverseId.toString();
  asset.metaverseRegistry = event.params._metaverseRegistry.toHexString();
  asset.metaverseAssetId = event.params._metaverseAssetId;
  asset.minPeriod = event.params._minPeriod;
  asset.maxPeriod = event.params._maxPeriod;
  asset.maxFutureTime = event.params._maxFutureTime;
  asset.paymentToken = event.params._paymentToken.toHexString();
  asset.pricePerSecond = event.params._pricePerSecond;
  asset.unclaimedRentFee = constants.BIGINT_ZERO;
  asset.lastRentEnd = event.block.timestamp;
  asset.status = 'LISTED';
  asset.totalRents = constants.BIGINT_ZERO;
  asset.save();

  common.incrementTotalListings();
}

export function handleUpdateConditions(event: UpdateConditions): void {
  const asset = common.createAssetIfNotExists(event.params._assetId.toString());
  asset.paymentToken = event.params._paymentToken.toHexString();
  asset.pricePerSecond = event.params._pricePerSecond;
  asset.minPeriod = event.params._minPeriod;
  asset.maxPeriod = event.params._maxPeriod;
  asset.maxFutureTime = event.params._maxFutureTime;
  asset.unclaimedRentFee = constants.BIGINT_ZERO;

  asset.save();
}

export function handleDelist(event: Delist): void {
  const asset = common.createAssetIfNotExists(event.params._assetId.toString());
  asset.status = 'DELISTED';
  asset.save();
}

export function handleWithdraw(event: Withdraw): void {
  const asset = common.createAssetIfNotExists(event.params._assetId.toString());
  asset.status = 'WITHDRAWN';
  asset.save();
}
