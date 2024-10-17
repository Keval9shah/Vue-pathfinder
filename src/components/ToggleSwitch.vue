<template>
    <div class="switch-wrapper">
        <slot></slot>
        <label class="switch">
            <input type="checkbox" v-model="isToggled" @change="toggleSwitch" />
            <span class="slider round"></span>
        </label>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";

@Component({})
export default class ToggleSwitch extends Vue {
    // Local data to track switch state
    isToggled: boolean = false;

    @Emit('toggle')
    toggleSwitch() {
        return this.isToggled;
    }
}
</script>


<style scoped>
.switch-wrapper {
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
}

.switch {
    margin-left: 0.2rem;
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #787878;
    transition: 0.2s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 5px;
    bottom: 4px;
    background-color: white;
    transition: 0.2s;
}

input:checked + .slider {
    background-color: #1562a09c;
}

input:checked + .slider:before {
    transform: translateX(21px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
