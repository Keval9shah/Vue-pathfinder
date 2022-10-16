<template>
    <div>
        <template v-for="row in nodes">
            <GridButton v-for="node in row" :color="nodes[node.y][node.x].color" :y="node.y" :x="node.x" @buttonClicked="handleClick" :key="node.y.toString()+node.x.toString()"></GridButton>
            <br>
        </template>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import GridButton from '@/components/GridButton.vue';

@Component({ components: { GridButton } })
export default class App extends Vue {
    // nodes structure grid obj -> nodes array -> row array -> node obj
    rowSize = 0;
    columnSize = 0;
    nodes = [];
    source = {
        x:undefined,
        y:undefined,
        exists:false
    };
    destination = {
        x:undefined,
        y:undefined,
        exists:false
    };

    colors = {
        blank: "white",
        obstacle: "black",
        step: "#008000",
        source: "#b6cec7",
        destination: "#b6cec7",
        destinationFound: "#ffd700"
    }

    handleClick(location) {
        let currentNode = this.nodes[location.y][location.x];
        if(currentNode.type == "blank") {
            currentNode.type = "obstacle";
            return;
        }
        else if(currentNode.type == "obstacle") {
            currentNode.type = "blank";
            if(!this.source.exists) {
                currentNode.type = "source";
                this.source = {
                    x: currentNode.x,
                    y: currentNode.y,
                    exists: true
                }
            } else if(!this.destination.exists) {
                currentNode.type = "destination";
                this.destination = {
                    x: currentNode.x,
                    y: currentNode.y,
                    exists: true
                }
            }
        }
    }

    constructGrid(newRowSize, newColumnSize) {
        this.rowSize = newRowSize;
        this.columnSize = newColumnSize;
        let self = this;
        for (let rowNum = 0; rowNum < newRowSize; rowNum++) {
            !this.nodes[rowNum] && this.nodes.push([]);
            for (let columnNum = 0; columnNum < newColumnSize; columnNum++) {
                if(this.nodes[rowNum][columnNum]) { continue; }
                this.nodes[rowNum].push({
                    x: columnNum,
                    y: rowNum,
                    get color() {
                        return self.colors[this.type];
                    },
                    fDist: Math.max(),
                    type: "blank",
                    gDist: 0
                });
            }
        }
    }

    mounted() {
        this.constructGrid(5,12);
    }
}

// got it working but still ts not working!!!!
</script>