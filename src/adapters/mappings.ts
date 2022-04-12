import { Rent } from '../../generated/schema';
import { common } from '../common';
import {
  AdministrativeConsumerUpdated,
  UpdateAdapterAdministrativeConsumer,
  UpdateAdapterConsumer,
  UpdateRentConsumer
} from '../../generated/ConsumableAdapterFacet/IMetaverseConsumableAdapterFacet';

export function handleUpdateRentConsumer(event: UpdateRentConsumer): void {
  const assetId = event.params._assetId.toString();
  const rentId = `${assetId}-${event.params._rentId.toString()}`;

  const rent: Rent = common.createRentIfNotExists(rentId);
  rent.operator = event.params._consumer;

  rent.save();
}

export function handleUpdateAdapterConsumer(event: UpdateAdapterConsumer): void {
  const assetId = event.params._assetId.toString();

  common.updateAssetOperator(assetId, event.params._consumer);
}

export function handleUpdateAdapterAdministrativeConsumer(event: UpdateAdapterAdministrativeConsumer): void {
  const assetId = event.params._assetId.toString();

  common.updateAssetOperator(assetId, event.params._consumer);
}
