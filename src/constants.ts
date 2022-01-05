import {Address, BigInt} from "@graphprotocol/graph-ts";

export namespace constants {
  export let BIGINT_ZERO = BigInt.fromI32(0);
  export let BIGINT_ONE = BigInt.fromI32(1);
  export let ZERO_ADDRESS = Address.fromByteArray(Address.fromHexString('0x0000000000000000000000000000000000000000'));
  export let ONE_ADDRESS = Address.fromByteArray(Address.fromHexString('0x0000000000000000000000000000000000000001'));
}
