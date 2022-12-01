<template>
    <div class="my-5 ml-5">
        <div class="row m-0 mb-2">
            <div class="label">ROW</div>
            <input class="grid-size-input" type="number" v-model.number="rowSize">
            <div class="label">COL</div>
            <input class="grid-size-input" type="number" v-model.number="columnSize">
        </div>
        <div style="display:flex;">
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import GridButton from '@/components/GridButton.vue';
import AStarLogo from'@/components/AStarLogo.vue';
import { GridNode, Coordinates, NodeType } from '@/types';

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

    // TODO : needs debounce
    @Watch('columnSize')
    onColSizeChanged(colVal: number) {
        if(colVal && colVal>0 && colVal<=105) {
            this.constructGrid(this.rowSize, this.columnSize);
        }
    }

    @Watch('rowSize')
    onRowSizeChanged(val: number) {
        if(val && val>0 && val<=50) {
            this.constructGrid(this.rowSize, this.columnSize);
        }
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
        this.columns = newColumnSize;
        this.rows = newRowSize;
    }

    mounted() {
        // initial grid construction
        this.rowSize = 8;
        this.columnSize = 12;
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

</style>

<style>
body {
    margin: 0;
    background-color: rgb(218, 218, 218);
}
</style>