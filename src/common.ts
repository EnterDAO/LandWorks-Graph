import { Asset, Metaverse, Overview, Rent, User } from '../generated/schema';
import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { constants } from './constants';

export namespace common {
  export function getOverview(): Overview {
    let overview = Overview.load('OVERVIEW');
    if (overview == null) {
      overview = new Overview('OVERVIEW');
      overview.totalListings = constants.BIGINT_ZERO;
      overview.totalRents = constants.BIGINT_ZERO;
      overview.administrativeOperator = constants.ZERO_ADDRESS;

      overview.save();
    }
    return overview as Overview;
  }

  export function updateAdministrativeOperator(administrativeOperator: Bytes): void {
    const overview = getOverview();
    overview.administrativeOperator = administrativeOperator;
    overview.save();
  }

  export function incrementTotalListings(): void {
    const overview = getOverview();
    overview.totalListings = overview.totalListings.plus(constants.BIGINT_ONE);
    overview.save();
  }

  export function incrementTotalRents(): void {
    const overview = getOverview();
    overview.totalRents = overview.totalRents.plus(constants.BIGINT_ONE);
    overview.save();
  }

  export function createMetaverseIfNotExists(id: string): Metaverse {
    let metaverse = Metaverse.load(id);
    if (metaverse == null) {
      metaverse = new Metaverse(id);
      metaverse.save();
    }

    return metaverse;
  }

  export function createAssetIfNotExists(id: string): Asset {
    let asset = Asset.load(id);
    if (asset == null) {
      asset = new Asset(id);

      asset.save();
    }

    return asset;
  }

  export function createRentIfNotExists(id: string): Rent {
    let rent = Rent.load(id);
    if (rent == null) {
      rent = new Rent(id);

      rent.save();
    }

    return rent;
  }

  export function createUserIfNotExists(id: string): User {
    let user = User.load(id);
    if (user == null) {
      user = new User(id);
      user.save();
    }

    return user;
  }

  export function assetUpdateLatest(id: string, fee: BigInt, lastRentEnd: BigInt): void {
    const asset = createAssetIfNotExists(id);
    asset.totalRents = asset.totalRents.plus(constants.BIGINT_ONE);
    asset.unclaimedRentFee = asset.unclaimedRentFee.plus(fee);
    asset.lastRentEnd = lastRentEnd;
    asset.save();
  }

  export function updateAssetOperator(id: string, address: Bytes): void {
    const asset = createAssetIfNotExists(id);
    asset.operator = address;
    asset.save();
  }
}
