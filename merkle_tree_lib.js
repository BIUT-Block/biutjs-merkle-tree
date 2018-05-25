const crypto = require('crypto')

/**
* All the supported hash algorithms
*/
const supported_hash_algo = [
    "md5",
    "sha1",
    "sha256",
    "sha512",
    "ripemd160"
]

/**
* digest
* @desc Returns hash result
* @param {String} data - Data for hash calculation
* @param {String} hashAlgo - Hash algorithm, must match "supported_hash_algo"
* @return {String}
* @example
* const hash = digest("sha256", 'a')
*/
function digest (hashAlgo, data) {
    return crypto.createHash(hashAlgo).update(data).digest()
}
 
/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
class MerkleTree {
    /**
    * @desc Constructs a Merkle Tree.
    * All nodes and leaves are stored as Buffers.
    * Lonely leaf nodes are promoted to the next level up without being hashed again.
    * @param {Buffer[]} raw_data - Array of raw data, will be convert to leaves after hash calculation. Each leaf must be a Buffer.
    * @param {String} hashAlgo - String of algorithm used for hashing leaves and nodes
    */
    constructor(raw_data, hashAlgo) {
        if (supported_hash_algo.indexOf(hashAlgo) < 0)
            throw TypeError('Expected a supported hash algorithm')
        if (!Array.isArray(raw_data))
            throw TypeError('Expected correct input format')
        
        this.hashAlgo = hashAlgo
        this.leaves = raw_data.map(x => digest(this.hashAlgo, x))
        this.layers = [this.leaves]

        this._createHashes(this.leaves)
    }

    _createHashes(nodes) {
        if (nodes.length === 1) {
            return false
        }

        const layerIndex = this.layers.length

        this.layers.push([])

        for (let i = 0; i < nodes.length - 1; i += 2) {
            const left = nodes[i]
            const right = nodes[i+1]
            let data = null

            data = Buffer.concat([left, right])

            let hash = digest(this.hashAlgo, data)

            this.layers[layerIndex].push(hash)
        }

        // is odd number of nodes
        if (nodes.length % 2 === 1) {
            let data = nodes[nodes.length-1]
            let hash = data

            this.layers[layerIndex].push(hash)
        }
        
        //console.log(layerIndex)
        //console.log(this.layers[layerIndex])

        this._createHashes(this.layers[layerIndex])
    }

    /**
    * getLeaves
    * @desc Returns array of leaves of Merkle Tree.
    * @return {Buffer[]}
    * @example
    * const leaves = tree.getLeaves()
    */
    getLeaves() {
        return this.leaves
    }

    /**
    * getLayers
    * @desc Returns array of all layers of Merkle Tree, including leaves and root.
    * @return {Buffer[]}
    * @example
    * const layers = tree.getLayers()
    */
    getLayers() {
        return this.layers
    }

    /**
    * getRoot
    * @desc Returns the Merkle root hash as a Buffer.
    * @return {Buffer}
    * @example
    * const root = tree.getRoot()
    */
    getRoot() {
        return this.layers[this.layers.length-1][0]
    }

    /**
    * getProof
    * @desc Returns the proof for a target leaf.
    * @param {Buffer} raw_data - Target leaf's raw data
    * @param {Number} [index] - Target leaf index in leaves array.
    * Use if there are leaves containing duplicate data in order to distinguish it.
    * @return {Buffer[]} - Array of Buffer hashes.
    * @example
    * const proof = tree.getProof(leaves[2])
    *
    * @example
    * const leaves = ['a', 'b', 'a'].map(x => sha3(x))
    * const tree = new MerkleTree(leaves, sha3)
    * const proof = tree.getProof(leaves[2], 2)
    */
    getProof(raw_data, index) {
        const proof = [];
        var leaf = digest(this.hashAlgo, raw_data)

        if (typeof index !== 'number') {
            index = -1

            for (let i = 0; i < this.leaves.length; i++) {
                if (Buffer.compare(leaf, this.leaves[i]) === 0) {
                    index = i
                }
            }
        }

        if (index <= -1) {
            return []
        }

        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i]
            const isRightNode = index % 2
            const pairIndex = (isRightNode ? index - 1 : index + 1)

            if (pairIndex < layer.length) {
                proof.push({
                    position: isRightNode ? 'left': 'right',
                    data: layer[pairIndex]
                })
            }

            // set index to parent index
            index = (index / 2) | 0
        }

        return proof
    }

    /**
    * verify
    * @desc Returns true if the proof path (array of hashes) can connect the target node
    * to the Merkle root.
    * @param {Buffer[]} proof - Array of proof Buffer hashes that should connect
    * target node to Merkle root.
    * @param {Buffer} targetNode - Target node Buffer
    * @param {Buffer} root - Merkle root Buffer
    * @return {Boolean}
    * @example
    * const root = tree.getRoot()
    * const proof = tree.getProof(leaves[2])
    * const verified = tree.verify(proof, leaves[2], root)
    *
    */
    verify(proof, targetNode, root) {
        let hash = digest(this.hashAlgo, targetNode)

        if (!Array.isArray(proof) || !proof.length || !targetNode || !root) {
            return false
        }

        for (let i = 0; i < proof.length; i++) {
            const node = proof[i]
            const isLeftNode = (node.position === 'left')
            const buffers = []

            buffers.push(hash)

            buffers[isLeftNode ? 'unshift' : 'push'](node.data)

            hash = digest(this.hashAlgo, Buffer.concat(buffers))
        }

        return Buffer.compare(hash, root) === 0
    }
}

module.exports = MerkleTree
