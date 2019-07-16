// 1.	Вершины могут быть представлены различными типами
// 2.	Граф должен быть взвешенным
// 3.	Граф может быть как направленным, так и ненаправленным +
// 4.	Должна быть возможность выбрать вершину +
// 5.	Должна быть возможность выбрать ребро +
// 6.	Должна быть возможность выбрать всех соседей указанной вершины +
// 7.	Должна быть возможность добавить новую вершину +
// 8.	Должна быть возможность добавить новое ребро +
// 9.	Должна быть возможность удалить вершину +
// 10.	Должна быть возможность удалить ребро +
// 11.	Должна быть возможность развернуть граф, если он направленный
// 12.	Должна быть возможность получить матрицы смежности
// 13.	Должна быть возможность получить вес указанного ребра
// 14.	Должна быть возможность сделать выборку подграфа по указанным вершинам (на входе массив вершин, на выходе указанные вершины со всеми ребрами между ними)
// 15.	Должен быть реализован любой алгоритм поиска пути между двумя точками графа

Graph.UNDIRECTED = 'undirected graph'; 
Graph.DIRECTED = 'directed graph'; 

class Node {
    constructor(value) {
      this.value = value;
      this.adjList = new Map(); 
    }
    
    addAdjacent(node) {
      this.adjacents.add(node);
    }
    
    removeAdjacent(node) {
      return this.adjacents.delete(node);
    }
    
    isAdjacent(node) {
      return this.adjacents.has(node);
    }

    getAdjacents() {
      return Array.from(this.adjacents);
    }
    
  }

class Graph {
  
  constructor(edgeDirection) {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }
  
  addVertex(value) {
    if (this.nodes.has(value)) { 
      return this.nodes.get(value);
    }
    const vertex = new Node(value); 
    this.nodes.set(value, vertex); 
    return vertex;
  }
  
  removeVertex(value) {
    const current = this.nodes.get(value); 
    if (current) {
      Array.from(this.nodes.values()).forEach(node => node.removeAdjacent(current)); 
    }
    return this.nodes.delete(value); 
  }
  
  addEdge(source, destination) {
    const sourceNode = this.addVertex(source); 
    const destinationNode = this.addVertex(destination); 

    sourceNode.addAdjacent(destinationNode); 

    if (this.edgeDirection === Graph.UNDIRECTED) {
      destinationNode.addAdjacent(sourceNode); 
    }

    return [sourceNode, destinationNode];
  }
  
  removeEdge(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destinationNode);

      if (this.edgeDirection === Graph.UNDIRECTED) {
        destinationNode.removeAdjacent(sourceNode);
      }
    }

    return [sourceNode, destinationNode];
  }
  
  areNeighbours(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      return sourceNode.isAdjacent(destinationNode);
    }

    return false;
  }

  findPath(source, destination, path = new Map()) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);
    const newPath = new Map(path);

    if (!destinationNode || !sourceNode) return [];

    newPath.set(sourceNode);

    if (source === destination) {
      return Array.from(newPath.keys());
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


}


