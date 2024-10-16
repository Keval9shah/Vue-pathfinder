<template>
    <button :class="className" @mouseenter="buttonEntered" @mousedown="buttonClicked"></button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { NodeType } from "@/types";

@Component({})
export default class GridButton extends Vue {
    @Prop({ default: 0 }) x!: number;
    @Prop({ default: 0 }) y!: number;
    @Prop({ default: NodeType.blank }) type!: NodeType;

    get className() {
        return this.type;
    }

    buttonEntered() {
        this.$emit("buttonEntered", {
            x: this.x,
            y: this.y,
        });
    }

    buttonClicked() {
        this.$emit("buttonClicked", {
            x: this.x,
            y: this.y,
        });
    }
}
</script>

<style scoped>
button {
    width: 52px;
    height: 52px;
    border: none;
    border-left: 1px solid black;
    border-top: 1px solid black;
    cursor: pointer;
    outline: none;
    font-size: 20px;
}
.blank {
    background-color: white;
}
.obstacle {
    background-color: black;
}
.visited {
    background-color: #adcabb;
}
.path {
    background-color: #008000;
}
.source,
.destination {
    background-color: rgba(255, 255, 255, 0.564);
    background-size: 2rem;
    background-position: center;
    background-repeat: no-repeat;
}
.source {
    background-image: url("../assets/source.png");
}
.destination {
    background-image: url("../assets/destination.png");
}
</style>
