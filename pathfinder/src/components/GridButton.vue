<template>
    <!-- TODO : add source and destination icon for UX -->
    <button :style="'background-color:' + color" @click="buttonClicked">{{buttonText}}</button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { colors, NodeType } from '@/types';

@Component({})
export default class GridButton extends Vue {
    @Prop({default: 0}) x!: number;
    @Prop({default: 0}) y!: number;
    @Prop({default: NodeType.blank}) type!: NodeType;

    get color() {
        return colors[this.type];
    }

    get buttonText() {
        if(this.type == NodeType.source) return 'src';
        if([NodeType.destination, NodeType.destinationFound].includes(this.type)) return 'dest';
        return '';
    }

    buttonClicked() {
        this.$emit('buttonClicked', {
            x: this.x,
            y: this.y,
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
    width: 52px;
    height: 52px;
    border: none;
    border-left: 1px solid black;
    border-top: 1px solid black;
    cursor: pointer;
    outline: none;
}
</style>
