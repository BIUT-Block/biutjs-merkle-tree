Class: Merkle Tree

<a name="MerkleTree"></a>

## MerkleTree
**Kind**: global class

* [MerkleTree](#MerkleTree)
    * [new MerkleTree(raw_data, hashAlgo)](#new_MerkleTree_new)
    * [.getLeaves()](#MerkleTree+getLeaves) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.getLayers()](#MerkleTree+getLayers) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.getRoot()](#MerkleTree+getRoot) ⇒ <code>Buffer</code>
    * [.getProof(raw_data, [index])](#MerkleTree+getProof) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.verify(proof, targetNode, root)](#MerkleTree+verify) ⇒ <code>Boolean</code>


* * *
<a name="new_MerkleTree_new"></a>

### new MerkleTree(raw_data, hashAlgo)
new MerkleTree(raw_data, hashAlgo)
Constructs a Merkle Tree.
All raw_data(will be converted to leaves and nodes after hash calculation) are stored as Buffers.


| Param | Type | Description |
| --- | --- | --- |
| raw_data | <code>Array.&lt;Buffer&gt;</code> | Array of raw_data, each raw_data(also leaf) must be a Buffer. |
| hashAlgo | <code>String</code> | Algorithm used for hashing raw_data, leaves and nodes, now the code only supports "md5", "sha1", "sha256", "sha512", "ripemd160" |


**Example**
```js
const crypto = require('crypto')
const MerkleTree = require('../merkle_tree_lib')

const raw_data = ['a', 'b', 'c']
const tree = new MerkleTree(raw_data, 'sha256')
```

* * *

<a name="MerkleTree+getLeaves"></a>

### merkleTree.getLeaves() ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns array of leaves of Merkle Tree.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const leaves = tree.getLeaves()
```

* * *

<a name="MerkleTree+getLayers"></a>

### merkleTree.getLayers() ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns array of all layers of Merkle Tree, including leaves and root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const layers = tree.getLayers()
```

* * *

<a name="MerkleTree+getRoot"></a>

### merkleTree.getRoot() ⇒ <code>Buffer</code>
Returns the Merkle root hash as a Buffer.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const root = tree.getRoot()
```

* * *

<a name="MerkleTree+getProof"></a>

### merkleTree.getProof(raw_data, [index]) ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns the proof for a target leaf.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array.&lt;Buffer&gt;</code> - - Array of Buffer hashes.

| Param | Type | Description |
| --- | --- | --- |
| raw_data | <code>Buffer</code> | Target leaf's raw data |
| [index] | <code>Number</code> | Target leaf index in leaves array. Use if there are leaves containing duplicate data in order to distinguish it. |

If index is not defined, code will traverse the tree to find raw_data's corresponding index. If index is defined, Raw_data is invalid and code will proceed with index only.

**Example**
```js
const proof = tree.getProof(raw_data[2])
```
**Example**
```js
const raw_data = ['a', 'b', 'c']
const tree = new MerkleTree(raw_data, "sha256")
const proof = tree.getProof(raw_data[2], 2)
```

* * *

<a name="MerkleTree+verify"></a>

### merkleTree.verify(proof, targetNode, root) ⇒ <code>Boolean</code>
Returns true if the proof path (array of hashes) can connect the target node
to the Merkle root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)

| Param | Type | Description |
| --- | --- | --- |
| proof | <code>Array.&lt;Buffer&gt;</code> | Array of proof Buffer hashes that should connect target node to Merkle root. |
| targetNode | <code>Buffer</code> | Target node Buffer |
| root | <code>Buffer</code> | Merkle root Buffer |

**Example**
```js
const root = tree.getRoot()
const proof = tree.getProof(raw_data[2])
const verified = tree.verify(proof, raw_data[2], root)
```

* * *
# Notes
As is, this implemenation is vulnerable to a [second pre-image attack](https://en.wikipedia.org/wiki/Merkle_tree#Second_preimage_attack). Use a difference hashing algorithm function for leaves and nodes, so that `H(x) != H'(x)`.
Also, as is, this implementation is vulnerable to a forgery attack for an unbalanced tree, where the last leaf node can be duplicated to create an artificial balanced tree, resulting in the same Merkle root hash. Do not accept unbalanced tree to prevent this.

Resources:
https://github.com/miguelmota/merkle-tree

	
	
	
	
	
中文简介：
代码用于SEC Merkle Tree Hash计算
主要的函数：
1.  定义MerkleTree:	MerkleTree(raw_data, hashAlgo)
	其中raw_data是原始的数据，例如区块链上每个区块utf-8编码形式的数据
	hashAlgo是Merkle树的hash运算算法，现在仅支持"md5", "sha1", "sha256", "sha512", "ripemd160"

2.  getProof(raw_data, [index]) => Array.<Buffer>
	该函数会返回目标节点在hash树每一层的配偶节点的位置（左/右）及其hash值，返回类型为带key键的Array
	该函数配套verify函数，用于确认目标节点的数据是否遭到篡改
	
3.  verify(proof, targetNode, root) => Boolean
	该函数需要的输入为：getProof函数返回的目标节点每一层的配偶节点位置及hash值， 想测试的目标节点raw data 以及 Merkle树根的值
	因此可以很容易的计算并确认数据没有遭到篡改
	
第二次原像攻击：
由于Merkle根值只是一个值，只能代表最后的值是否正确，而无法展示其他信息，如 树的节点个数，树的层数等等，因此容易受到伪造者攻创建一个具有相同Merkle树根的虚假文档进行攻击
解决方法：
每一层的树在计算hash值之前加上所在层数对应的一个前缀值，例如第一层在data前面加0x00，以此类推
	
	

		.
	
	
	
	
	
	
	
	
	
	
	