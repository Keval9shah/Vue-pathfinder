<template>
    <div class="my-5 ms-5">
        <div class="json-layout">
            <input ref="fileInput" @change="importJSON" style="display: none;" type="file" accept="application/json" name="fileupload" />
            <a href="#" @click="() => fileInput.click()" class="font-caveat me-2">Import Layout</a>
            <a href="#" @click="exportAsJSON" class="font-caveat me-2">Export Layout</a>
        </div>
        <div class="row m-0 mb-2">
            <div class="label font-caveat">ROW</div>
            <input class="grid-size-input font-caveat" type="number" v-model.number="rowSize">
            <div class="label font-caveat">COL</div>
            <input class="grid-size-input font-caveat" type="number" v-model.number="columnSize">
            <button @click="resetLayout" class="button">Reset</button>
            <button @click="findPath" class="button ms-2">Find Path</button>
            <button @click="clearPath" class="button ms-2">Clear Path</button>
        </div>
        <div class="main-section">
            <div :style="'grid-template-columns: repeat(' + columns + ', 52px);'" class="grid">
                <template v-for="row in nodes">
                    <GridButton v-for="node in row" :type="nodes[node.y][node.x].type" :y="node.y" :x="node.x" @buttonClicked="handleClick" @buttonEntered="handleEnter" :key="node.y.toString()+'x'+node.x.toString()"></GridButton>
                </template>
            </div>
            <AStarLogo />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import GridButton from "@/components/GridButton.vue";
import AStarLogo from "@/components/AStarLogo.vue";
import { GridNode, Coordinates, NodeType, AstarFile } from "@/types";
import { debounce, showToastWithPromise, showToast } from "@/utils";

@Component({ components: { GridButton, AStarLogo } })
export default class App extends Vue {
    // nodes structure grid obj -> nodes array -> row array -> node obj
    rowSize = 0;
    columnSize = 0;
    rows = 0;
    columns = 0;
    nodes: GridNode[][] = [];
    source = { exists: false } as GridNode;
    destination = { exists: false } as GridNode;
    debounceWait: number = 0;
    mouseIsDown = false;
    @Ref("fileInput") readonly fileInput!: HTMLInputElement;

    @Watch("columnSize")
    onColSizeChanged(colVal: number) {
        this.updateGridSize(colVal, 105);
    }

    @Watch("rowSize")
    onRowSizeChanged(val: number) {
        this.updateGridSize(val, 55);
    }

    updateGridSize(val: number, limit: number) {
        if (!val || val < 0 || val > limit) {
            return;
        }
        debounce(
            this.debounceWait,
            this.constructGrid,
            this.rowSize,
            this.columnSize
        );
    }

    handleEnter(location: Coordinates) {
        if (!this.mouseIsDown) {
            return;
        }
        this.handleClick(location);
    }

    handleClick(location: Coordinates) {
        let currentNode = this.nodes[location.y][location.x];
        if (currentNode.type == NodeType.blank) {
            currentNode.type = NodeType.obstacle;
            return;
        } else if (currentNode.type == NodeType.obstacle) {
            currentNode.type = NodeType.blank;

            if (!this.source.exists) {
                currentNode.type = NodeType.source;
                this.source = {
                    x: currentNode.x,
                    y: currentNode.y,
                    exists: true,
                    type: NodeType.source,
                    gCost: 0,
                    hCost: 0,
                    fCost: 0,
                    parent: null,
                };
            } else if (!this.destination.exists) {
                currentNode.type = NodeType.destination;
                this.destination = {
                    x: currentNode.x,
                    y: currentNode.y,
                    exists: true,
                    type: NodeType.destination,
                    gCost: Infinity,
                    hCost: 0,
                    fCost: Infinity,
                    parent: null,
                };
            }
        } else {
            if (currentNode.type == NodeType.source) {
                currentNode.type = NodeType.blank;
                this.source.exists = false;
            } else {
                currentNode.type = NodeType.blank;
                this.destination.exists = false;
            }
        }
    }

    constructGrid(newRowSize: number, newColumnSize: number) {
        for (let rowNum = 0; rowNum < newRowSize; rowNum++) {
            !this.nodes[rowNum] && this.nodes.push([]);
            for (let columnNum = 0; columnNum < newColumnSize; columnNum++) {
                if (this.nodes[rowNum][columnNum]) {
                    continue;
                }
                this.nodes[rowNum].push({
                    x: columnNum,
                    y: rowNum,
                    gCost: Infinity,
                    hCost: 0,
                    fCost: Infinity,
                    type: NodeType.blank,
                    parent: null,
                });
            }
        }
        // node pruning
        if (this.columns > newColumnSize) {
            for (let rowNum = 0; rowNum < this.rows; rowNum++) {
                this.nodes[rowNum].splice(newColumnSize, this.columns);
            }
        }
        if (this.rows > newRowSize) {
            this.nodes.splice(newRowSize, this.rows);
        }
        (this.source.x > newRowSize - 1 || this.source.y > newRowSize - 1) &&
            (this.source.exists = false);
        (this.destination.x > newRowSize - 1 ||
            this.destination.y > newRowSize - 1) &&
            (this.destination.exists = false);
        this.columns = newColumnSize;
        this.rows = newRowSize;
    }

    async mounted() {
        // initial grid construction
        document.onmousedown = () => (this.mouseIsDown = true);
        document.onmouseup = () => (this.mouseIsDown = false);
        this.rowSize = 8;
        this.columnSize = 12;
        Vue.nextTick(() => (this.debounceWait = 500));
        await showToastWithPromise("Rows and Cols are editable ✏️", "info");
        showToast("Tap Twice for Start/End Point 📌", "info");
        showToast("Tap once for Obstacles ⚫", "info");
    }

    exportAsJSON() {
        let text = JSON.stringify({
            Title: "A* Path Finder Layout File",
            Author: "Keval Shah",
            nodes: this.nodes,
            source: this.source,
            destination: this.destination,
        } as AstarFile);
        const blob = new Blob([text], { type: "application/json" });
        const a = document.createElement("a");
        a.setAttribute("href", window.URL.createObjectURL(blob));
        a.setAttribute("download", "layout.json");
        a.click();
    }

    importJSON() {
        let importedFile = {} as File | undefined | 0;
        importedFile = this.fileInput.files?.length && this.fileInput.files[0];
        if (
            !importedFile ||
            (importedFile as File).type != "application/json"
        ) {
            showToast("Invalid File or File Type.", "error");
            return;
        }
        const reader = new FileReader();
        reader.readAsText(importedFile);
        reader.onload = (event) => {
            let fileObj: AstarFile = event.target
                ? JSON.parse(event.target.result as string)
                : {};
            if (fileObj.Title != "A* Path Finder Layout File") {
                showToast("Invalid File or File Type.", "error");
                return;
            }
            this.debounceWait = 0;

            this.rowSize = fileObj.nodes.length;
            this.columnSize = fileObj.nodes[0].length;
            setTimeout(() => {
                this.nodes = fileObj.nodes;
                this.source = fileObj.source;
                this.destination = fileObj.destination;
                showToast("Imported the Layout", "success");
            }, 500);
            Vue.nextTick(() => (this.debounceWait = 500));
        };
    }

    resetLayout() {
        this.source.exists = false;
        this.destination.exists = false;
        this.nodes.forEach((row) => {
            row.forEach((node) => {
                node.type = NodeType.blank;
                node.parent = null;
                node.gCost = Infinity;
                node.hCost = 0;
                node.fCost = Infinity;
            });
        });
        this.source.exists = false;
        this.destination.exists = false;
    }

    clearPath() {
        this.nodes.forEach((row) => {
            row.forEach((node) => {
                if (node.type === NodeType.visited || node.type === NodeType.path) {
                    node.type = NodeType.blank;
                    node.parent = null;
                    node.gCost = Infinity;
                    node.hCost = 0;
                    node.fCost = Infinity;
                }
            });
        });
    }

    findPath() {
        if (!this.source || !this.destination) return;

        const openList: GridNode[] = [];
        const closedList: GridNode[] = [];

        openList.push(this.nodes[this.source.y][this.source.x]);

        while (openList.length > 0) {
            // Find the node with the lowest fCost in the open list
            let currentNode = openList[0];
            for (let i = 1; i < openList.length; i++) {
                if (
                    openList[i].fCost < currentNode.fCost ||
                    (openList[i].fCost === currentNode.fCost &&
                        openList[i].hCost < currentNode.hCost)
                ) {
                    currentNode = openList[i];
                }
            }

            // Remove currentNode from the open list and add it to the closed list
            openList.splice(openList.indexOf(currentNode), 1);
            closedList.push(currentNode);

            // Check if we have reached the end node
            if (
                currentNode.x === this.destination.x &&
                currentNode.y === this.destination.y
            ) {
                this.retracePath(this.nodes[this.source.y][this.source.x], this.nodes[this.destination.y][this.destination.x]);
                return;
            }

            // Get neighboring nodes
            const neighbors = this.getNeighbors(currentNode);

            for (const neighbor of neighbors) {
                if (closedList.includes(neighbor) || neighbor.type === "obstacle") continue;
                if(neighbor.type != NodeType.destination) neighbor.type = NodeType.visited;
                const newMovementCostToNeighbor =
                    currentNode.gCost + this.getDistance(currentNode, neighbor);
                if (newMovementCostToNeighbor < neighbor.gCost || !openList.includes(neighbor)) {
                    neighbor.gCost = newMovementCostToNeighbor;
                    neighbor.hCost = this.getDistance(neighbor, this.destination);
                    neighbor.fCost = neighbor.gCost + neighbor.hCost;
                    neighbor.parent = currentNode;
                    
                    if (!openList.includes(neighbor)) openList.push(neighbor);
                }
            }
        }
        console.log(this.source, this.destination);
    }

    getDistance(nodeA: GridNode, nodeB: GridNode): number {
        const distX = Math.abs(nodeA.x - nodeB.x);
        const distY = Math.abs(nodeA.y - nodeB.y);
        return distX + distY;
    }

    getNeighbors(node: GridNode): GridNode[] {
        const neighbors: GridNode[] = [];
        const { x, y } = node;

        // Add valid neighbor nodes (4 directions: up, down, left, right)
        if (this.isInGrid(x - 1, y)) neighbors.push(this.nodes[y][x - 1]); // Left
        if (this.isInGrid(x + 1, y)) neighbors.push(this.nodes[y][x + 1]); // Right
        if (this.isInGrid(x, y - 1)) neighbors.push(this.nodes[y - 1][x]); // Up
        if (this.isInGrid(x, y + 1)) neighbors.push(this.nodes[y + 1][x]); // Down

        return neighbors;
    }

    isInGrid(x: number, y: number): boolean {
        return x >= 0 && x < this.columnSize && y >= 0 && y < this.rowSize;
    }

    retracePath(startNode: GridNode, endNode: GridNode) {
        const path: GridNode[] = [];
        let currentNode = endNode;

        while (currentNode !== startNode) {
            path.push(currentNode);
            currentNode = currentNode.parent!;
        }

        path.reverse();
        let y = path.pop();
        this.highlightPath(path); // You can create a method to visually show the path
    }

    highlightPath(path: GridNode[]) {
        path.forEach((node) => {
            this.nodes[node.y][node.x].type = NodeType.path;
        });
    }
}
</script>

<style scoped>
.grid {
    height: fit-content;
    width: fit-content;
    display: grid;
    box-shadow: 2px 2px 7px rgb(167, 167, 167);
}

input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.grid-size-input {
    font-size: 22px;
    width: 45px;
    border: none;
    outline: none;
    background: transparent;
}

.grid-size-input:hover,
.grid-size-input:focus {
    text-decoration: underline;
}

.label {
    font-size: 10px;
    font-weight: bold;
    height: fit-content;
    color: rgb(90, 90, 90);
    font-weight: 600;
}

.font-caveat {
    font-family: "Caveat", cursive;
}

.main-section {
    display: flex;
    width: fit-content;
}
</style>

<style>
body {
    margin: 0;
    background-color: rgb(218, 218, 218);
}

.button {
    cursor: pointer;
    outline: none;
    background-color: rgb(244, 244, 244);
    border-radius: 2px;
    border: 1px solid black;
    padding: 1px 8px;
}

.json-layout {
    position: absolute;
    top: 0;
    right: 0;
}

a {
    text-decoration: underline;
    color: black;
}
</style>
