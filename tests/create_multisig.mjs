import { createKeyMulti } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

let multi = createKeyMulti(
    // key names:
    // multi1, multi2, multi3
    ['5FyPp8LArQngJdoEGAVqaE539EKZQLfaJuLd5hmp4FiURURs',
        '5E7siV4YTJRn1yNP7JnJE43votSQShjinTu6Dgu69sXd1UXF',
        '5D4xmWFyu44c3GqkU5ixo9pgyr7vpHjBGDhboNaUgTMmXdYA'],
    2);

console.log(encodeAddress(u8aToHex(multi), 42));