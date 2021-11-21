import { Transfer } from '../../generated/ERC721Facet/IERC721Facet';
import { common } from '../common';

export function handleTransfer(event: Transfer): void {
  const assetId = event.params.tokenId.toString();
  const asset = common.createAssetIfNotExists(assetId);
  asset.owner = event.params.to.toString();
  asset.save();
}
