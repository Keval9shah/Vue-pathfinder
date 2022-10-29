<template>
    <div class="parent">
        <span :style="'font-family:' + changingFont + ';'"> A </span>
        <span class="star d-inline-block"> * </span>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class AStarLogo extends Vue {
    changingFont: string = "'Shalimar', cursive";
    fonts: string[] = [
        "'Shalimar', cursive",
        "'Caveat', cursive"
    ];

    // interval = setInterval(() => {
    //     this.changingFont = this.fonts[this.getRandomNumber(this.fonts.length)]
    //     console.log(this.changingFont);
    // },2000);

    getRandomNumber(max: number) {
        return Math.floor(Math.random() * max);
    }
}
</script>

<style scoped>

.parent {
    user-select: none;
    padding: 125px 135px;
    padding-bottom: 0;
    white-space: nowrap;
    font-size: 120px;
    height: fit-content;
    line-height: 120px;
}

.star {
    animation: spin 4s linear infinite;
    line-height: 70px;
    padding-top: 25px;
    position: relative;
    top: -28px;
    left: -40px;
}

@keyframes spin { 
    100% { 
        -webkit-transform: rotate(360deg); 
        transform:rotate(360deg); 
    } 
}

</style>
