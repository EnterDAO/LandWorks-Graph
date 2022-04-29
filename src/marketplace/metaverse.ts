import { SetMetaverseName, SetRegistry } from '../../generated/MarketplaceFacet/IMarketplaceFacet';
import { common } from '../common';

export function handleSetMetaverseName(event: SetMetaverseName): void {
  const id = event.params._metaverseId.toString();
  const metaverse = common.createMetaverseIfNotExists(id);
  metaverse.name = event.params._name;
  if (event.params._name.toLowerCase() == 'cryptovoxels') {
    metaverse.name = 'Voxels';
  }

  metaverse.save();
}

export function handleSetMetaverseRegistry(event: SetRegistry): void {
  const metaverse = event.params._metaverseId.toString();

  const registryAddress = event.params._registry;
  const registry = common.createMetaverseRegistryIfNotExists(registryAddress);
  common.createMetaverseIfNotExists(metaverse);
  registry.metaverse = metaverse;
  registry.isRemoved = !event.params._status;
  registry.save();
}
