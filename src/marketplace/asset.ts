import { constants } from '../constants';

import { Delist, List, UpdateConditions, Withdraw } from '../../generated/MarketplaceFacet/IMarketplaceFacet';
import { common } from '../common';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ILANDRegistry } from '../../generated/MarketplaceFacet/ILANDRegistry';
import { EstateRegistry } from '../../generated/MarketplaceFacet/EstateRegistry';

export function handleList(event: List): void {
  const assetId = event.params._assetId.toString();
  const asset = common.createAssetIfNotExists(assetId);
  asset.metaverse = event.params._metaverseId.toString();
  asset.metaverseRegistry = event.params._metaverseRegistry.toHexString();
  asset.metaverseAssetId = event.params._metaverseAssetId;
  asset.minPeriod = event.params._minPeriod;
  asset.maxPeriod = event.params._maxPeriod;
  asset.maxFutureTime = event.params._maxFutureTime;
  asset.paymentToken = event.params._paymentToken.toHexString();
  asset.pricePerSecond = event.params._pricePerSecond;
  asset.unclaimedRentFee = constants.BIGINT_ZERO;
  asset.lastRentEnd = constants.BIGINT_ZERO;
  asset.txHash = event.transaction.hash.toHexString();
  asset.timestamp = event.block.timestamp;
  asset.status = 'LISTED';
  asset.totalRents = constants.BIGINT_ZERO;
  asset.decentralandData = populateDecentralandData(event.params._metaverseRegistry, event.params._metaverseAssetId, assetId);
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

function populateDecentralandData(registry: Address, tokenId: BigInt, asset: string): string | null {
  const id = `${registry.toHexString()}-${tokenId}`;
  let LANDRegistry = ILANDRegistry.bind(registry);
  const tryDecodeTokenId = LANDRegistry.try_decodeTokenId(tokenId);

  if (!tryDecodeTokenId.reverted) {
    const x = tryDecodeTokenId.value.value0;
    const y = tryDecodeTokenId.value.value1;
    const data = common.createDecentralandDataIfNotExists(id, asset);
    data.metadata = LANDRegistry.landData(x, y);
    data.isLAND = true;
    data.save();

    common.createCoordinatesLANDIfNotExists(x, y, id);
    return data.id;
  }

  const estateRegistry = EstateRegistry.bind(registry);
  const tryGetEstateSize = estateRegistry.try_getEstateSize(tokenId);
  if (tryGetEstateSize.reverted) {
    return null;
  }

  LANDRegistry = ILANDRegistry.bind(estateRegistry.registry());
  const data = common.createDecentralandDataIfNotExists(id, asset);
  data.metadata = estateRegistry.getMetadata(tokenId);
  data.save();

  const size = tryGetEstateSize.value.toI32();
  for (let i = 0; i < size; i++) {
    const landId = estateRegistry.estateLandIds(tokenId, BigInt.fromI32(i));
    const coordinates = LANDRegistry.decodeTokenId(landId);
    common.createCoordinatesLANDIfNotExists(coordinates.value0, coordinates.value1, id);
  }

  return data.id;
}
