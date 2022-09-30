<template>
    <div v-for="row in nodes">
        <Button v-for="node in row" :y="row" :x="node"></Button>
        <br>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Button from './components/Button.vue';
import {GridNode,Coordinates,colors,NodeType} from './types'

@Component({ components: {Button} })
export default class App extends Vue {
    // nodes structure grid obj -> nodes array -> row array -> node obj
    rowSize = 0;
    columnSize = 0;
    nodes: GridNode[][] = [];
    source = {} as Coordinates;
    destination = {} as Coordinates;

}
</script>