<template>
  <DropdownToolbar title="emoji" :visible="state.visible" @onChange="onChange">
    <template #overlay>
      <div class="emoji-container">
        <ol class="emojis">
          <li
            v-for="(emoji, index) of emojis"
            :key="`emoji-${index}`"
            @click="emojiHandler(emoji)"
          >{{ emoji }}</li>
        </ol>
      </div>
    </template>
    <template #trigger>
      <button class="md-editor-icon" tabindex="-1">
        🙂
      </button>
      <!--
      <svg class="md-editor-icon" aria-hidden="true">
        <use xlink:href="#icon-emoji"></use>
      </svg>
      -->
    </template>
  </DropdownToolbar>
</template>

<script setup>
import MdEditor from 'md-editor-v3';
import { reactive } from 'vue';
import { emojis } from '../common/editor/emojis.js';

const { DropdownToolbar } = MdEditor;

const props = defineProps({
  onInsert: {
    type: Function,
    default: () => () => null
  }
});

const state = reactive({
  visible: false
});

const emojiHandler = (emoji) => {
  const generator = () => {
    return {
      targetValue: emoji,
      select: false,
      deviationStart: 0,
      deviationEnd: 0
    };
  };

  props.onInsert(generator);
};

const onChange = (visible) => {
  state.visible = visible;
};
</script>