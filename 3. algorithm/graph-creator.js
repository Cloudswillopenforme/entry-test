// 1.	Вершины могут быть представлены различными типами +
// 2.	Граф должен быть взвешенным +
// 3.	Граф может быть как направленным, так и ненаправленным +
// 4.	Должна быть возможность выбрать вершину +
// 5.	Должна быть возможность выбрать ребро 
// 6.	Должна быть возможность выбрать всех соседей указанной вершины +
// 7.	Должна быть возможность добавить новую вершину +
// 8.	Должна быть возможность добавить новое ребро +
// 9.	Должна быть возможность удалить вершину +
// 10.	Должна быть возможность удалить ребро +
// 11.	Должна быть возможность развернуть граф, если он направленный +
// 12.	Должна быть возможность получить матрицы смежности +
// 13.	Должна быть возможность получить вес указанного ребра +
// 14.	Должна быть возможность сделать выборку подграфа по указанным вершинам (на входе массив вершин, на выходе указанные вершины со всеми ребрами между ними) +
// 15.	Должен быть реализован любой алгоритм поиска пути между двумя точками графа +

class PriorityQueue {
    nodesQueue = [];

    enqueue = (priority, key) => {
      this.nodesQueue.push({
        key: key,
        priority: priority
      });
      this.sort();
    };
    dequeue = () => {
      return this.nodesQueue.shift().key;
    };
    sort = () => {
      this.nodesQueue.sort((a, b) => {
        return a.priority - b.priority;
      });
    };
    isEmpty = () => {
      return !this.nodesQueue.length;
    };
  }

class Node {
  constructor(value, adjList) {
    this.value = value;
    if (!adjList) {
      this.adjList = new Map();
    } else {
      this.adjList = adjList;
    }
  }

  addAdjacent(node, weight) {
    this.adjList.set(node, weight);
  }

  removeAdjacent(node) {
    return this.adjList.delete(node);
  }

  isAdjacent(node) {
    return this.adjList.has(node);
  }

  getAdjacents() {
    return this.adjList.keys();
  }

}

class Graph {

  constructor(edgeDirection) {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  // 4
  getVertex(value) {
    return this.nodes.get(value);
  }

  // 7
  addVertex(value, adjList) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    }
    const vertex = new Node(value, adjList);
    this.nodes.set(value, vertex);
    return vertex;
  }

  // 9
  removeVertex(value) {
    const current = this.nodes.get(value);
    if (current) {
      Array.from(this.nodes.values()).forEach(node => node.removeAdjacent(current));
    }
    return this.nodes.delete(value);
  }

  // 5 the task is not clear enough
  getEdge(source, destination) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);

    if (!(sourceNode && destinationNode)) {
      console.log("Entered not existing vertices");
      return;
    }

    if (sourceNode.isAdjacent(destinationNode)) {
      console.log(`There is an adge between node ${source} and ${destination} with weight: ${this.getWeight(source, destination)}`);
      return;
    } else {
      console.log("No edge found");
      return;
    }
  }

  // 8
  addEdge(source, destination, weight) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);

    sourceNode.addAdjacent(destinationNode, weight);

    if (this.edgeDirection === Graph.UNDIRECTED) {
      destinationNode.addAdjacent(sourceNode, weight);
    }

    return [sourceNode, destinationNode];
  }

  // 10
  removeEdge(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destinationNode);

      if (this.edgeDirection === Graph.UNDIRECTED) {
        destinationNode.removeAdjacent(sourceNode);
      }
      console.log('Edge is successfully removed');
      return [sourceNode, destinationNode];
    } else {
      console.log("No such edge found")
    }
  }

  // 6
  getAdjacentsList(source) {
    const sourceNode = this.nodes.get(source);
    let adjacents = [];
    for (let key of sourceNode.adjList.keys()) {
      adjacents.push(key.value);
    };
    return adjacents;
  }

  // 13
  getWeight(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode.isAdjacent(destinationNode)) {
      const weight = sourceNode.adjList.get(destinationNode);
      return weight;
    } else {
      return 0;
    }
  }

  // 12
  getAdjacencyMatrix() {
    const matrix = [];
    for (let key1 of this.nodes.keys()) {
      matrix[key1] = [];
      for (let key2 of this.nodes.keys()) {
        let weight = this.getWeight(key1, key2);
        if (weight) {
          matrix[key1][key2] = weight;
        } else {
          matrix[key1][key2] = 0;
        }
      };
    };
    return matrix;
  }

  // 14
  getSubGraph(listOfVertices) {
    const sourceAdjList = this.nodes;
    var keysArePresent = listOfVertices.every((key) => {
      return sourceAdjList.has(key);
    });
    if (!keysArePresent) {
      console.log("Not all entered nodes are present in the source graph");
      return;
    }
    const subGraph = new Graph(this.edgeDirection);
    listOfVertices.forEach((key) => {
      const sourceNode = sourceAdjList.get(key);
      let newAdjList = new Map();
      for (let adj of sourceNode.adjList.entries()) {
        newAdjList.set(adj);
      }
      const newNode = subGraph.addVertex(sourceNode.value, newAdjList);

      for (let adj of newNode.adjList.keys()) {
        if (!listOfVertices.includes(adj)) {
          newNode.removeAdjacent(adj);
        }
      }
    });


    return subGraph;
  }

  // 11
  getDirectedGraphReversed() {
    if (this.edgeDirection === Graph.UNDIRECTED) {
      console.log("this graph is undirected, can't reverse undirected graphs");
      return;
    } else {

      const tempGraph = new Graph(Graph.DIRECTED);

      for (let node of this.nodes.values()) {

        let newNode = tempGraph.addVertex(node.value);

        for (let adj of node.adjList.keys()) {
          let weight = this.getWeight(node.value, adj.value);
          node.adjList.clear();

          let newAdjNode = tempGraph.addVertex(adj.value);
          newAdjNode.addAdjacent(newNode, weight);
        };

      };

      this.nodes = tempGraph.nodes;
      return this.getAdjacencyMatrix();
    }
  }


  // 15 any path
  findPath(source, destination, path = new Map()) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);
    const newPath = new Map(path);

    if (!destinationNode || !sourceNode) return [];

    newPath.set(sourceNode);

    if (source === destination) {
      const result = [];
      for(let vertex of newPath.keys()) {
      	result.push(vertex.value);
    }
    return result;
}
    

    for (const node of sourceNode.getAdjacents()) {
      if (!newPath.has(node)) {

        const nextPath = this.findPath(node.value, destination, newPath);
        if (nextPath.length) {
          return nextPath;
        }
      }
    }

    return [];
  }


  // 15 shortest path (Dijkstra algorithm)

  findShortestPath(start, finish) {
    let nodes = new PriorityQueue(),
    	vertices = this.nodes,
	      distances = {},
	      previous = {},
	      path = [],
	      smallest, vertex, neighbor, alt;



    for (vertex of vertices.keys()) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(Infinity, vertex);
      }

      previous[vertex] = null;
    }

    while (!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if (smallest === finish) {
        path = [];

        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }

        break;
      }

      if (!smallest || distances[smallest] === Infinity) {
        continue;
      }

      for (neighbor of vertices.get(smallest).getAdjacents()) {
      	let neighborValue = neighbor.value;
        alt = distances[smallest] + vertices.get(smallest).adjList.get(neighbor);

        if (alt < distances[neighborValue]) {
          distances[neighborValue] = alt;
          previous[neighborValue] = smallest;

          nodes.enqueue(alt, neighborValue);
        }
      }
    }

    return path.concat([start]).reverse();;
  };
}

Graph.UNDIRECTED = Symbol('undirected graph');
Graph.DIRECTED = Symbol('directed graph');

//TEST
const graph = new Graph(Graph.UNDIRECTED);

graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");

graph.addEdge("A", "B", 1);
graph.addEdge("C", "A", 4);
graph.addEdge("B", "C", 2);

console.log(graph.getVertex("A")); // Node entity
console.log(graph.getEdge("A", "C")); // found edge message
console.log(graph.getEdge("A", "D")); // error message


graph.addVertex("D");
graph.addEdge("D", "A", 4);
console.log(graph.removeEdge("D", "A")) // message and array of nodes, between which the edge was removed
console.log(graph.removeVertex("D")); // true
console.log(graph.removeVertex("M")); // false

console.log(graph.getAdjacentsList("A")); //Array of adjacents
console.log(graph.getWeight("A", "C")); // 4
console.log(graph.getAdjacencyMatrix()); // Matrix 
console.log(graph.getSubGraph(["A", "B"])); // new Graph instance
console.log(graph.getDirectedGraphReversed()); // error message 

graph.addVertex("D");
graph.addVertex("E");
graph.addEdge("C", "D", 5);
graph.addEdge("D", "E", 3);
console.log(graph.findPath("A", "E")); // path array with nodes names 
console.log(graph.findPath("D", "A")); // path array with nodes names
console.log(graph.findShortestPath("A", "E")); // path array with nodes names
console.log(graph.findShortestPath("D", "A")); // // path array with nodes names

const directedGraph = new Graph(Graph.DIRECTED);

directedGraph.addVertex("A");
directedGraph.addVertex("B");
directedGraph.addVertex("C");

directedGraph.addEdge("A", "B", 1);
directedGraph.addEdge("B", "C", 2);
directedGraph.addEdge("C", "A", 3);

console.log(directedGraph.getAdjacencyMatrix()); // adj Matrix
console.log(directedGraph.getDirectedGraphReversed()); // adjacency Matrix with opposite values
