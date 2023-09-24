import { ChainMap, ModuleType, MultisigIsmConfig } from '@hyperlane-xyz/sdk';

export const multisigIsmConfig: ChainMap<MultisigIsmConfig> = {
  // ----------- Your chains here -----------------
  scrollsepolia: {
    type: ModuleType.LEGACY_MULTISIG,
    threshold: 1,
    validators: [
      // Last scroll address
      '0xbF57d398b7a166E255c0Bf83f6e9C322d12FB00a',
    ],
  },
  // anvil2: {
  //   type: ModuleType.LEGACY_MULTISIG,
  //   threshold: 1,
  //   validators: [
  //     // Last anvil address
  //     '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
  //   ],
  // },
};
