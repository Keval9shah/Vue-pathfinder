<template>
    <div>
        <template v-for="row in nodes">
            <GridButton v-for="node in row" :y="row" :x="node"></GridButton>
            <br>
        </template>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GridButton from '@/components/GridButton.vue';
import {GridNode,Coordinates,colors,NodeType} from '@/types'

@Component({ components: { GridButton } })
export default class App extends Vue {
    // nodes structure grid obj -> nodes array -> row array -> node obj
    rowSize = 0;
    columnSize = 0;
    nodes: GridNode[][] = [];
    source = {} as Coordinates;
    destination = {} as Coordinates;

}
</script>