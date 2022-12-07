<template>
<div>{{hi}}</div>
</template>
<script lang="ts">

import { Vue, Component, Watch, Ref } from 'vue-property-decorator';

@Component({})
export default class ImportCSV extends Vue {
    hi = "hello";
}


</script>