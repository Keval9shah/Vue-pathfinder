<template>
    <div class="my-5 ml-5">
        <div class="csv-layout">
            <input ref="fileInput" @change="importCSV" style="display: none;" type="file" accept="text/csv" name="fileupload" />
            <a href="#" @click="() => fileInput.click()" class="import-button mr-2">Import Layout</a>
            <a href="#" @click="exportAsCSV" class="export-button mr-2">Export Layout</a>
        </div>
        <div class="row m-0 mb-2">
            <div class="label">ROW</div>
            <input class="grid-size-input" type="number" v-model.number="rowSize">
            <div class="label">COL</div>
            <input class="grid-size-input" type="number" v-model.number="columnSize">
        </div>
        <div class="main-section">
            <div :style="'grid-template-columns: repeat(' + columns + ', 52px);'" class="grid">
                <template v-for="row in nodes">
                    <GridButton v-for="node in row" :type="nodes[node.y][node.x].type" :y="node.y" :x="node.x" @buttonClicked="handleClick" :key="node.y.toString()+'x'+node.x.toString()"></GridButton>
                </template>
            </div>
            <A-star-logo />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
import GridButton from '@/components/GridButton.vue';
import AStarLogo from'@/components/AStarLogo.vue';
import { GridNode, Coordinates, NodeType } from '@/types';
import { debounce } from '@/utils';

// TODO : replace (create vue)/webpack with vite
// TODO :  obvious add A* algorithm
@Component({ components: { GridButton, AStarLogo } })
export default class App extends Vue {
    // nodes structure grid obj -> nodes array -> row array -> node obj
    rowSize = 0;
    columnSize = 0;
    rows = 0;
    columns = 0;
    nodes: GridNode[][] = [];
    source = { exists:false } as Coordinates;
    destination = { exists:false } as Coordinates;
    debounceWait: number = 0;
    @Ref("fileInput") readonly fileInput!: HTMLInputElement;

    @Watch('columnSize')
    onColSizeChanged(colVal: number) {
        this.updateGridSize(colVal, 105);
    }

    @Watch('rowSize')
    onRowSizeChanged(val: number) {
        this.updateGridSize(val, 55);
    }

    updateGridSize(val: number, limit: number) {
        if(!val || val<0 || val>limit) {return;}
        debounce(this.debounceWait, this.constructGrid, this.rowSize, this.columnSize);
    }

    handleClick(location: Coordinates) {
        let currentNode = this.nodes[location.y][location.x];
        if(currentNode.type == NodeType.blank) {
            currentNode.type = NodeType.obstacle;
            return;

        } else if(currentNode.type == NodeType.obstacle) {
            currentNode.type = NodeType.blank;

            if(!this.source.exists) {
                currentNode.type = NodeType.source;
                this.source = { x: currentNode.x, y: currentNode.y, exists: true };

            } else if(!this.destination.exists) {
                currentNode.type = NodeType.destination;
                this.destination = { x: currentNode.x, y: currentNode.y, exists: true };
            }
        } else {
            if(currentNode.type == NodeType.source) {
                currentNode.type = NodeType.blank;
                this.source = { x: -1, y: -1, exists: false };

            } else {
                currentNode.type = NodeType.blank;
                this.destination = { x: -1, y: -1, exists: false };
            }
        }
    }

    constructGrid(newRowSize: number, newColumnSize: number) {
        for(let rowNum = 0; rowNum < newRowSize; rowNum++) {
            !this.nodes[rowNum] && this.nodes.push([]);
            for(let columnNum = 0; columnNum < newColumnSize; columnNum++) {
                if(this.nodes[rowNum][columnNum]) { continue; }
                this.nodes[rowNum].push({
                    x: columnNum,
                    y: rowNum,
                    type: NodeType.blank,
                    visited: false
                });
            }
        }
        // node pruning
        if(this.columns > newColumnSize) {
            for (let rowNum = 0; rowNum < this.rows; rowNum++) {
                this.nodes[rowNum].splice(newColumnSize, this.columns);
            }
        }
        if(this.rows > newRowSize) {
            this.nodes.splice(newRowSize, this.rows);
        }
        (this.source.x>newRowSize -1 || this.source.y>newRowSize -1) && (this.source.exists = false);
        (this.destination.x>newRowSize -1 || this.destination.y>newRowSize -1) && (this.destination.exists = false);
        this.columns = newColumnSize;
        this.rows = newRowSize;
    }

    mounted() {
        // initial grid construction
        this.rowSize = 8;
        this.columnSize = 12;
        Vue.nextTick(() => this.debounceWait = 500);
    }

    exportAsCSV() {
        let text = "A* Path Finder Layout File\nAuthor - Keval\n";
        this.nodes.forEach((row, index) => {
            let rowText:string[] = [];
            row.forEach(node => {
                rowText.push(node.type);
            });
            text += rowText.join(",") + ((index == this.nodes.length - 1) ? "" : "\n");
        });
        const blob = new Blob([text], { type: 'text/csv' });
        const a = document.createElement('a');
        a.setAttribute('href', window.URL.createObjectURL(blob));
        a.setAttribute('download', 'layout.csv');
        a.click();
    }

    importCSV() {
        const importedFile = this.fileInput.files?.length && this.fileInput.files[0];
        const reader = new FileReader();
        if(!importedFile) {return;}
        reader.readAsText(importedFile);
        reader.onload = event => {
            let fileTextArr = event.target ? (event.target.result as string).split("\n") : [];
            if(fileTextArr[0] != "A* Path Finder Layout File") {return;}
            fileTextArr = fileTextArr.slice(2);
            this.debounceWait = 0;
            this.rowSize = fileTextArr.length;
            this.columnSize = fileTextArr[0].split(",").length;
            setTimeout(() => {
                this.nodes.forEach((row, rowIndex) => {
                    let currentLine = fileTextArr[rowIndex].split(",");
                    row.forEach((col, colIndex) => {
                        const nodeTypeInFile = currentLine[colIndex];
                        (nodeTypeInFile == "source") && (this.source = {x: colIndex, y: rowIndex, exists: true });
                        (nodeTypeInFile == "destination") && (this.destination = {x: colIndex, y: rowIndex, exists: true });
                        col.type = nodeTypeInFile as NodeType;
                    })
                })
            }, 200);
            Vue.nextTick(() => this.debounceWait = 500);
            // fileTextArr.forEach((row, rowIndex) => {
            //     !this.nodes[rowIndex] && this.nodes.push(new Array(this.columnSize).fill({}));
            //     row.split(",").forEach((col, colIndex) => {
            //         !this.nodes[rowIndex][colIndex] && this.nodes[rowIndex].push({} as GridNode);
            //         (col == "source") && (this.source = {x: colIndex, y: rowIndex, exists: true });
            //         (col == "destination") && (this.destination = {x: colIndex, y: rowIndex, exists: true });
            //         this.nodes[rowIndex][colIndex] = {
            //             x: colIndex,
            //             y: rowIndex,
            //             type: col as NodeType,
            //             visited: false
            //         }
            //     });
            // })
        }
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

.grid-size-input:hover, .grid-size-input:focus {
    text-decoration: underline;
}

.label {
    font-size: 10px;
    font-weight: bold;
    height: fit-content;
    color: rgb(90, 90, 90);
    font-family: 'Caveat', cursive;
    font-weight: 600;
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

.csv-layout {
    position: absolute;
    top: 0;
    right: 0;
}
</style>