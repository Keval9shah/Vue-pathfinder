<template>
    <button :style="'background-color:'+color" @click="buttonClicked"></button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Coordinates } from "@/types";

@Component({})
export default class Button extends Vue {
    @Prop({default: 0}) x!: number;
    @Prop({default: 0}) y!: number;
    @Prop({default: ''}) color!: string;

    buttonClicked() {
        this.$emit('buttonClicked', {
            x: this.x,
            y: this.y,
        } as Coordinates)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
    width: 52px;
    height: 52px;
}
</style>
