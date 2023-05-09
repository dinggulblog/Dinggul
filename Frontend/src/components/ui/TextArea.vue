<template>
  <div class="TextArea">
    <label :for="name">{{ label }}</label>
    <textarea
      :name="name"
      :id="name"
      :value="inputValue"
      :placeholder="placeholder"
      @input="handleChange"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup>
  import { useField } from 'vee-validate'

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '',
    },
  })

  const {
    value: inputValue,
    handleBlur,
    handleChange,
    meta,
  } = useField(props.name, undefined, {
    initialValue: props.value,
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .TextArea {
    @include position;
    font-size: 1.4rem;
    width: 100%;
    
    textarea {
      @include placeholder(text2);
    }

    label {
      white-space: nowrap;
      color: var(--primary);
    }

    .help-message {
      @include position(absolute, $t: 7.7rem);
      margin: 0;
      font-size: 1.2rem;
    }

    &.has-error .help-message {
      color: var(--error);
    }

    &.success .help-message {
      color: var(--warning);
    }
  }
</style>
