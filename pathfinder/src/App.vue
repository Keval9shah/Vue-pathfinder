<template>
    <div :style="'grid-template-columns: repeat(' + columnSize + ', 52px);'" class="grid">
        <template v-for="row in nodes">
            <GridButton v-for="node in row" :type="nodes[node.y][node.x].type" :y="node.y" :x="node.x" @buttonClicked="handleClick" :key="node.y.toString()+node.x.toString()"></GridButton>
        </template>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GridButton from '@/components/GridButton.vue';
import { GridNode, Coordinates, NodeType } from '@/types';

@Component({ components: { GridButton } })
export default class App extends Vue {
    // nodes structure grid obj -> nodes array -> row array -> node obj
    rowSize = 0;
    columnSize = 0;
    nodes: GridNode[][] = [];
    source = { exists:false } as Coordinates;
    destination = { exists:false } as Coordinates;

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
        this.rowSize = newRowSize;
        this.columnSize = newColumnSize;
        for(let rowNum = 0; rowNum < newRowSize; rowNum++) {
            !this.nodes[rowNum] && this.nodes.push([]);
            for(let columnNum = 0; columnNum < newColumnSize; columnNum++) {
                if(this.nodes[rowNum][columnNum]) { continue; }
                this.nodes[rowNum].push({
                    x: columnNum,
                    y: rowNum,
                    fDist: Math.max(),
                    type: NodeType.blank,
                    visited: false
                });
            }
        }
    }

    mounted() {
        // initial grid construction
        this.constructGrid(8,15);
    }
}

</script>

<style>
body {
    margin: 0;
    background-color: rgb(218, 218, 218);
}
</style>

<style scoped>

.grid {
    margin: 140px 0 0 50px;
    width: fit-content;
    display: grid;
    box-shadow: 2px 2px 7px rgb(167, 167, 167);
}

</style>