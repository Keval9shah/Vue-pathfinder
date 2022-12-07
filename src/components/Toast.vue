<template>
    <div style="position: relative; min-height: 200px;">
        <div style="position: absolute; top: 0; right: 0;">
            <div class="toast" role="info">
            <div class="toast-header">
                <strong class="mr-auto">Info</strong>
                <button type="button" class=" mr-auto ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span>&times;</span>
                </button>
            </div>
            <div class="toast-body">
                Rows and Cols are editable
            </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Vue} from 'vue-property-decorator';

export default class Toast extends Vue {
    
}
</script>