<template>
  <div class="TextInput" :class="{ 'has-error': !!errorMessage, success: meta.valid }">
    <label :for="label" v-if="label">{{ label }}</label>
    <input spellcheck="false" :id="label" :name="name" :type="type" :value="inputValue" :disabled="disabled" :placeholder="placeholder" @input="handleChange" @blur="handleBlur" />
    <p class="help-message" v-if="errorMessage || meta.valid">{{ errorMessage || successMessage }}</p>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useField } from 'vee-validate'
import { debounce } from '../../common/util.js'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  label: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  successMessage: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['callback'])

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value,
})

watch(
  inputValue,
  debounce(() => {
    if (!errorMessage.value) emits('callback', inputValue.value)
  }, 500),
)
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.TextInput {
  @include position;
  font-size: 1.4rem;
  margin: 3.2rem 0 3.2rem;
  width: 100%;

  label {
    white-space: nowrap;
    color: var(--primary);
  }

  input {
    padding: 0 0 1.6rem;
    margin: 1.6rem 0 0;
    outline: none;
    font-weight: 400;
    background: transparent;
    border-bottom: 0.1rem solid var(--border2);
    width: 100%;
    color: var(--text4);

    @include placeholder(text2);
  }

  .help-message {
    @include position(absolute, $t: 7.7rem);
    margin: 0;
    font-size: 1.2rem;
    top: 7.7rem;
  }

  &.has-error .help-message {
    color: var(--error);
  }

  &.success .help-message {
    color: var(--warning);
  }
}
</style>
