<template>
  <div class="TextInput checkbox">
    <input :id="label" type="checkbox" :checked="checked" @input="handleChange(value)" />
    <label :for="label">{{ label }}</label>
  </div>
</template>

<script setup>
import { toRefs, onMounted } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  modelValue: {
    type: null,
  },
  value: {
    type: String,
  },
  name: {
    type: String,
  },
  label: {
    type: String,
  },
  check: {
    type: Boolean,
    default: null,
  },
})

const { name } = toRefs(props)

const { checked, handleChange } = useField(name, undefined, {
  type: 'checkbox',
  checkedValue: props.value,
})

onMounted(() => {
  if (props.check) handleChange(props.value)
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.TextInput {
  font-size: 1.4rem;
  margin: 3.2rem 0 3.2rem;
  @include flex;
  @include position;

  label {
    white-space: nowrap;
    color: var(--primary);
  }

  input:not([type='checkbox']):not([type='radio']) {
    padding: 0 0 1.6rem;
    margin: 1.6rem 0 0;
    outline: none;
    font-weight: 400;
    background: transparent;
    border-bottom: 0.1rem solid var(--border2);
    width: 100%;
    color: var(--text4);
  }

  input[type='checkbox'] {
    margin: 0 0.4rem 0;
  }

  input::placeholder {
    color: var(--text2);
  }

  .help-message {
    margin: 0;
    font-size: 1.2rem;
    @include position(absolute, $t: 7.7rem);
  }

  &.has-error .help-message {
    color: var(--error);
  }

  &.success .help-message {
    color: var(--warning);
  }

  &.checkbox {
    @include flex;
    line-height: 1.5;
    margin: 0 1.2rem 0 0;

    label {
      color: var(--text4);
      font-size: 1.2rem;
    }
  }
}
</style>
