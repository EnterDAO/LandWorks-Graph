import { ConsumerChanged, Transfer } from '../../generated/ERC721Facet/IERC721Facet';
import { common } from '../common';

export function handleTransferERC721(event: Transfer): void {
  const owner = event.params.to.toHexString();
  common.createUserIfNotExists(owner);
  const assetId = event.params.tokenId.toString();
  const asset = common.createAssetIfNotExists(assetId);
  asset.owner = owner;
  asset.save();
}

export function handleConsumerChanged(event: ConsumerChanged): void {
  const consumer = event.params.consumer.toHexString();
  common.createUserIfNotExists(consumer);

  const assetId = event.params.tokenId.toString();

  const asset = common.createAssetIfNotExists(assetId);
  asset.consumer = consumer;
  asset.save();
}
