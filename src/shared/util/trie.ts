export class TrieNode {
  phrase = "";
  children: Map<string, TrieNode> = new Map();
}

function nodeIterator<T>(
  word: string,
  root: TrieNode,
  callback: (letter: string, node: TrieNode, previousNode?: TrieNode) => T
) {
  const letters = word.split("");
  let node: TrieNode | undefined = root;
  let previousNode: TrieNode | undefined = undefined;

  for (let index = 0; index < letters.length; ++index) {
    if (!node) {
      break;
    }
    const letter = letters[index];
    if (!node.children.has(letter)) {
      node.children.set(letter, new TrieNode());
    }
    node = node.children.get(letter);
    if (!node) {
      break;
    }
    if (index === letters.length - 1) {
      return callback(letter, node, previousNode);
    }
    previousNode = node;
  }
  return false;
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string) {
    return nodeIterator(word, this.root, (letter, node, previous) => {
      node.phrase = word;
      return node;
    });
  }

  remove(word: string) {
    return nodeIterator(word, this.root, (letter, node, previous) => {
      if (node.phrase) {
        if (node.children.size === 0 && previous) {
          previous.children.delete(letter);
        }
        return node;
      }
      return false;
    });
  }

  has(word: string) {
    return nodeIterator(word, this.root, (letter, node, previous) => (node.phrase ? node : false));
  }

  searchFor(word: string) {
    return nodeIterator(word, this.root, (letter, node, previous) => {
      return { found: node.phrase, node: node };
    });
  }

  private breadthFirstCommandList(node: TrieNode) {
    const nodeList: TrieNode[] = [];
    const queue = [node];
    while (true) {
      const currentNode = queue.shift();
      if (!currentNode) {
        break;
      }
      if (currentNode.phrase) {
        nodeList.push(currentNode);
      }
      queue.push(...currentNode.children.values());
    }

    return nodeList;
  }

  allWordsFrom(node: TrieNode = this.root) {
    return this.breadthFirstCommandList(node);
  }
}
