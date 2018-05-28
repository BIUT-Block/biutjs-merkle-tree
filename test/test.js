const MerkleTree = require('../secjs-merkle-tree')
let expect = require('chai').expect

describe('secjs merklet ree test', () => {
  it('sha256 test', () => {
    const rawData = ['a', 'b', 'c']
    console.log()

    const tree = new MerkleTree(rawData, 'sha256')

    const strRoot = '7075152d03a5cd92104887b476862778ec0c87be5c2fa1c0a90f87c49fad6eff'
    expect(tree.getRoot().toString('hex')).to.equal(strRoot)

    // const a_hash = 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
    const bHash = '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d'
    const cHash = '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6'

    const proof = tree.getProof(rawData[0])
    expect(proof.length).to.equal(2)
    expect(proof[0].position).to.equal('right')
    expect(proof[0].data.toString('hex')).to.equal(bHash)
    expect(proof[1].position).to.equal('right')
    expect(proof[1].data.toString('hex')).to.equal(cHash)

    const bufBoot = Buffer.from(strRoot, 'hex')
    expect(tree.verify(proof, rawData[0], bufBoot)).to.equal(true)
  })
})
