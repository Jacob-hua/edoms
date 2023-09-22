<template>
  <div>
    <GmctEditor
      class="editor"
      :project="{
        id: '',
        name: '',
        gridType: 'mesh',
        gridSize: 25,
        gridColor: 'rgba(123, 123, 123, 0.49)',
        vertexes: [],
        links: [],
      }"
      :editor-layout="editorLayout"
    >
      <template #topBar></template>
    </GmctEditor>
  </div>
</template>

<script setup lang="ts">
import { EditorLayout, GmctEditor } from '@gmct/editor';

const editorLayout = EditorLayout.Workspace;
</script>

<style lang="scss">
.editor {
  width: 100%;
  height: 100%;
}
</style>
