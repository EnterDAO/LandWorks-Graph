import {
  Asset, ClaimHistory,
  DecentralandData, CoordinatesLAND,
  Metaverse,
  MetaverseRegistry,
  Overview,
  PaymentToken,
  Rent,
  User
} from '../generated/schema';
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { constants } from './constants';
import { IERC721Facet } from '../generated/ERC721Facet/IERC721Facet';
import { IERC20Metadata } from '../generated/FeeFacet/IERC20Metadata';

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

  export function createMetaverseRegistryIfNotExists(id: Address): MetaverseRegistry {
    let registry = MetaverseRegistry.load(id.toHexString());
    if (registry == null) {
      registry = new MetaverseRegistry(id.toHexString());
      const token = IERC721Facet.bind(id);
      registry.name = token.name();
      registry.symbol = token.symbol();
      registry.save();
    }

    return registry;
  }

  export function createAssetIfNotExists(id: string): Asset {
    let asset = Asset.load(id);
    if (asset == null) {
      asset = new Asset(id);

      asset.save();
    }

    return asset;
  }

  export function createPaymentTokenIfNotExists(id: Address): PaymentToken {
    let paymentToken = PaymentToken.load(id.toHexString());

    if (paymentToken == null) {
      paymentToken = new PaymentToken(id.toHexString());
      paymentToken = setERC20Data(id, paymentToken);
      paymentToken.save();
    }

    return paymentToken;
  }

  export function createRentIfNotExists(id: string): Rent {
    let rent = Rent.load(id);
    if (rent == null) {
      rent = new Rent(id);

      rent.save();
    }

    return rent;
  }

  export function createClaimHistoryIfNotExists(id: string): ClaimHistory {
    let claimHistory = ClaimHistory.load(id);
    if (claimHistory == null) {
      claimHistory = new ClaimHistory(id);

      claimHistory.save();
    }
    return claimHistory;
  }

  export function createUserIfNotExists(id: string): User {
    let user = User.load(id);
    if (user == null) {
      user = new User(id);
      user.save();
    }

    return user;
  }

  export function createDecentralandDataIfNotExists(id: string, asset: string): DecentralandData {
    let decentralandData = DecentralandData.load(id);
    if (decentralandData == null) {
      decentralandData = new DecentralandData(id);
    }

    decentralandData.asset = asset;
    decentralandData.save();
    return decentralandData;
  }

  export function createCoordinatesLANDIfNotExists(x: BigInt, y: BigInt, data: string): CoordinatesLAND {
    const id = `${x.toString()}-${y.toString()}`;
    let coordinates = CoordinatesLAND.load(id);
    if (coordinates == null) {
      coordinates = new CoordinatesLAND(id);
    }

    coordinates.x = x;
    coordinates.y = y;
    coordinates.data = data;
    coordinates.save();

    return coordinates;
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

  function setERC20Data(id: Address, paymentToken: PaymentToken): PaymentToken {
    if (id.equals(constants.ZERO_ADDRESS)) {
      paymentToken.name = 'Ether';
      paymentToken.symbol = 'ETH';
      paymentToken.decimals = 18;
    } else {
      const token = IERC20Metadata.bind(id);
      paymentToken.name = token.name();
      paymentToken.symbol = token.symbol();
      paymentToken.decimals = token.decimals();
    }

    return paymentToken;
  }
}
