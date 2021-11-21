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

export function handleSetRegistry(event: SetRegistry): void {
  const metaverseId = event.params._metaverseId.toString();
  const registryAddress = event.params._registry;
  const id = registryAddress.toString();

  if (event.params._status) {
    let registry = MetaverseRegistry.load(id);
    common.createMetaverseIfNotExists(id);

    if (registry == null) {
      registry = new MetaverseRegistry(id);
      const token = IERC721Facet.bind(registryAddress);
      registry.name = token.name();
      registry.symbol = token.symbol();
    } else {
      // TODO: If it already exists and it is added to another Metaverse.
    }
    registry.metaverseId = metaverseId;
  } else {
    // TODO: how to delete?
  }
}
