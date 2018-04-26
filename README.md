Class: Merkle Tree

MerkleTree functions:
	new MerkleTree(raw_data, hashAlgo)
		.getLeaves() ⇒ Array.<Buffer>
		.getLayers() ⇒ Array.<Buffer>
		.getRoot() ⇒ Buffer
		.getProof(raw_data, [index]) ⇒ Array.<Buffer>
		.verify(proof, targetNode, root) ⇒ Boolean

Explanation:
	new MerkleTree(raw_data, hashAlgo)
	Constructs a Merkle Tree.
	All raw_data(will be converted to leaves and nodes after hash calculation) are stored as Buffers.

Variables Type:
	raw_data: <Array.Buffer> Array of raw_data, each raw_data(also leaf) must be a Buffer.
	hashAlgo: <String> Algorithm used for hashing raw_data, leaves and nodes, now the code only supports "md5", "sha1", "sha256", "sha512", "ripemd160"

Example:
	const crypto = require('crypto')
	const MerkleTree = require('../merkle_tree_lib')

	const raw_data = ['a', 'b', 'c']
	const tree = new MerkleTree(raw_data, 'sha256')

Functions:
	1. merkleTree.getLeaves() => Array.<Buffer>
	   Returns array of leaves' hash of Merkle Tree.

	   Kind: instance method of MerkleTree Example
		const leaves = tree.getLeaves()
	   
	2. merkleTree.getLayers() => Array.<Buffer>
	   Returns array of all layers of Merkle Tree, including leaves and root.

	   Kind: instance method of MerkleTree Example
		const layers = tree.getLayers()
	   
	3. merkleTree.getRoot() ⇒ Buffer
	   Returns the Merkle root hash as a Buffer.

	   Kind: instance method of MerkleTree Example
		const root = tree.getRoot()
	
	4. merkleTree.getProof(raw_data, [index]) ⇒ Array.<Buffer>
	   Returns the proof for a target leaf.

	   Kind: instance method of MerkleTree Returns: Array.<Buffer> - - Array of Buffer hashes.
	   
	   Variable:
	   raw_data:	<Buffer>	Target leaf's raw data
	   [index]: 	<Number>	Target leaf index in leaves array. Use if there are leaves containing duplicate data in order to distinguish it.
	
	   If index is not defined, code will traverse the tree to find raw_data's corresponding index. If index is defined, Raw_data is invalid and code will proceed with index only.
	
	   Example1:
		const proof = tree.getProof(raw_data[2])
	   
	   Example2:
		const raw_data = ['a', 'b', 'c']
		const tree = new MerkleTree(raw_data, "sha256")
		const proof = tree.getProof(raw_data[2], 2)
	
	5. merkleTree.verify(proof, targetNode, root) ⇒ Boolean
	   Returns true if the proof path (array of hashes) can connect the target node to the Merkle root.

	   Kind: instance method of MerkleTree

	   Variables:
	   proof:	<Array.Buffer>	Array of proof Buffer hashes that should connect target node to Merkle root.
	   targetNode:	<Buffer>	Target node raw data Buffer
	   root:	<Buffer>	Merkle root Buffer
	   
	   Example:
	   const root = tree.getRoot()
	   const proof = tree.getProof(raw_data[2])
	   const verified = tree.verify(proof, raw_data[2], root)
	
Notes：
As is, this implemenation is vulnerable to a [second pre-image attack](https://en.wikipedia.org/wiki/Merkle_tree#Second_preimage_attack). Use a difference hashing algorithm function for leaves and nodes, so that `H(x) != H'(x)`.
Also, as is, this implementation is vulnerable to a forgery attack for an unbalanced tree, where the last leaf node can be duplicated to create an artificial balanced tree, resulting in the same Merkle root hash. Do not accept unbalanced tree to prevent this.

Resources:
https://github.com/miguelmota/merkle-tree

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	