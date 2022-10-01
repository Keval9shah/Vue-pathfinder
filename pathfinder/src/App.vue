<template>
    <div>
        <template v-for="row in nodes">
            <Button v-for="column in row" :y="row" :x="column" :color="nodes[row][column].color" @buttonClicked="updateGrid"></Button>
            <br>
        </template>
    </div>
</template>

<script lang="ts">
import nodeTest from 'node:test';
import { Vue, Component } from 'vue-property-decorator';
import Button from './components/Button.vue';
import {GridNode,Coordinates,colors,NodeType} from './types'

@Component({ components: {Button} })
export default class App extends Vue {
    // nodes structure grid obj -> nodes array -> row array -> node obj
    rowSizev: number = 0;
    columnSize: number = 0;
    nodes: GridNode[][] = [];
    source = {} as Coordinates;
    destination = {} as Coordinates;

    constructGrid(rowLength: number, colLength: number) {
        for (let row = 0; row < rowLength; row++) {
            !this.nodes[row] && this.nodes.push([]);
            for (let column = 0; column < colLength; column++) {
                if (this.nodes[row][column]) { continue; }
                this.nodes[row][column] = {
                    x: column,
                    y: row,
                    visited: false,
                    get color() {
                        return colors[this.type as NodeType];
                    },
                    type: NodeType.blank,
                }
            }
        }
    }
    
    updateGrid(nodeLocation: Coordinates) {
        let node = this.nodes[nodeLocation.x][nodeLocation.y];
        if (node.type == NodeType.blank) {
            node.type = NodeType.obstacle;
        } else if (node.type == NodeType.obstacle) {
            node.type = NodeType.blank;
            if (!this.source.exists) {
                node.type = NodeType.source;
                this.source = { x:node.x, y:node.y, exists: true };
            } else if (!this.destination.exists) {
                node.type = NodeType.destination;
                this.destination = { x:node.x, y:node.y, exists: true };
            }
        } else {
            node.type == NodeType.source ? (this.source.exists = false) : (this.destination.exists = false);
            node.type = NodeType.blank;
        }
    }

    mounted() {
        this.constructGrid(9,15);
    }
}
</script>