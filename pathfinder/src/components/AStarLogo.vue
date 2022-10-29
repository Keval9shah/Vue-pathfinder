<template>
    <div class="parent">
        <span id="A"> A </span>
        <span class="star d-inline-block"> * </span>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class AStarLogo extends Vue {
    changingFont: string = "font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;";
    fonts: string[] = [
        "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
        "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
        "'Verdana, Geneva, Tahoma, sans-serif",
        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        "monospace",
        "Helvetica"
    ];

    interval = setInterval(() => {
        (<HTMLElement>document.querySelector('#A')).style.fontFamily = this.fonts[this.getRandomNumber(this.fonts.length)];
    }, 2500);

    getRandomNumber(max: number) {
        return Math.floor(Math.random() * max);
    }
}
</script>

<style scoped>

.parent {
    user-select: none;
    padding: 125px 75px 0 125px;
    white-space: nowrap;
    font-size: 120px;
    height: fit-content;
    width: 350px;
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
