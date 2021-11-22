import { SetMetaverseName, SetRegistry } from '../../generated/MarketplaceFacet/IMarketplaceFacet';
import { MetaverseRegistry } from '../../generated/schema';
import { common } from '../common';
import { IERC721Facet } from '../../generated/ERC721Facet/IERC721Facet';

export function handleSetMetaverseName(event: SetMetaverseName): void {
  const id = event.params._metaverseId.toString();
  const metaverse = common.createMetaverseIfNotExists(id);
  metaverse.name = event.params._name;

  metaverse.save();
}

export function handleSetMetaverseRegistry(event: SetRegistry): void {
  const metaverse = event.params._metaverseId.toString();


  if (event.params._status) {
    common.createMetaverseIfNotExists(metaverse);

    const registryAddress = event.params._registry;
    let registry = MetaverseRegistry.load(registryAddress.toHexString());
    if (registry == null) {
      registry = new MetaverseRegistry(registryAddress.toHexString());
      const token = IERC721Facet.bind(registryAddress);
      registry.name = token.name();
      registry.symbol = token.symbol();
    } else {
      // TODO: If it already exists and it is added to another Metaverse.
    }
    registry.metaverse = metaverse;
    registry.save();
  } else {
    // TODO: how to delete?
  }
}
