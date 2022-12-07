<template>
    <div class="parent">
        <span id="A"> A </span>
        <span class="star"> * </span>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class AStarLogo extends Vue {
    changingFont: string = "font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;";
    fontNum: number = 0;
    fonts: string[] = [
        "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
        "'Verdana, Geneva, Tahoma, sans-serif",
        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        "Helvetica"
    ];

    mounted() {
        const interval = setInterval(() => {
            this.fontNum = (this.fontNum + 1) % this.fonts.length;
            (<HTMLElement>document.querySelector('#A')).style.fontFamily = this.fonts[this.fontNum];
        }, 5000);
    }

}
</script>

<style scoped>

.parent {
    user-select: none;
    padding: 125px 100px 0 125px;
    white-space: nowrap;
    font-size: 120px;
    height: fit-content;
    width: 120px;
    line-height: 120px;
}

.star {
    display: inline-block;
    animation: spin 20s linear infinite;
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
