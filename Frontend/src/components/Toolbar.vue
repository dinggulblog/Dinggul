<template>
  <div class="toolbar">
    <div class="wrap_breadcrumb_sort_type">
      <div class="breadcrumb">
        <ul>
          <li>
            <router-link :to="{ name: 'home' }">home</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'posts', params: { main } }">
              {{ main }}
            </router-link>
          </li>
          <li v-if="sub">
            <router-link :to="{ name: 'posts', params: { main, sub } }">
              {{ sub }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="type">
        <button v-for="view in views" :key="view.name" ref="typeBtnsEl" class="btn_type">
          <Ico :svg="view.path" :class="view.name" :size="'sm'" :aria-label="view.name" />
        </button>
      </div>
    </div>

    <div class="categories" v-show="type !== 'slide'">
      <ul ref="categoryEl">
        <li>전체</li>
        <li v-for="category in categories" :key="category">{{ category }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  main: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
  },
  type: {
    type: String,
    default: 'list',
    validator: (value) => ['list', 'card', 'slide'].includes(value),
  },
  categories: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['updateType', 'updateCategory'])

const route = useRoute()
const views = [
  {
    name: 'list',
    path: 'row',
  },
  {
    name: 'card',
    path: 'grid',
  },
  {
    name: 'slide',
    path: 'column',
  },
]

const typeBtnsEl = ref(null)
const categoryEl = ref(null)

const addOnClass = (element) => {
  element?.classList?.add('on')
}

const removeOnClass = (elements = []) => {
  for (const elem of elements) {
    if (elem.tagName === 'LI') {
      elem.classList.remove('on')
    } else if (elem.tagName === 'BUTTON') {
      elem.classList.remove('on')
      elem.firstChild.classList.remove('on')
    }
  }
}

const changeView = (event) => {
  if (event.currentTarget.firstChild.tagName === 'svg') {
    removeOnClass(typeBtnsEl.value)
    emits('updateType', event.currentTarget.firstChild.classList[0])
    addOnClass(event.currentTarget)
    addOnClass(event.currentTarget.firstChild)
  }
}

const changeCategory = (event) => {
  if (event.target.tagName === 'LI') {
    removeOnClass(categoryEl.value?.children)
    emits('updateCategory', event.target.innerText)
    addOnClass(event.target)
  }
}

const remountClass = () => {
  removeOnClass(typeBtnsEl.value)
  removeOnClass(categoryEl.value?.children)
  addOnClass(typeBtnsEl.value?.find((button) => button.firstChild.classList.value === props.type)?.firstChild)
  addOnClass(categoryEl.value?.firstChild)
}

watch(() => route.path, remountClass)

onMounted(() => {
  typeBtnsEl.value.forEach((button) => button.addEventListener('click', changeView))
  categoryEl.value.addEventListener('click', changeCategory)
  remountClass()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.toolbar {
  .wrap_breadcrumb_sort_type {
    @include flex;
    font-size: 1.2rem;
    margin: 0 0 4.8rem;
    z-index: 999;

    @include mobile {
      @include flex(column);
    }

    .breadcrumb {
      flex-basis: 50%;

      @include mobile {
        width: 100%;
      }

      ul {
        @include flex;
        list-style: none;

        li {
          @include flex;

          a {
            color: var(--text3);
            letter-spacing: 0.04rem;
            text-transform: uppercase;

            @include hover {
              border-color: var(--primary-light);
            }

            @include active {
              border-color: var(--primary-dark);
            }
          }

          &:not(:last-child)::after {
            content: '〉';
            margin: 0 1.4rem 0 1.8rem;
            color: var(--text3);
          }

          &:last-child a {
            color: var(--primary);
            font-weight: 500;
          }
        }
      }
    }

    .type {
      @include flex($jc: end);
      flex-basis: 50%;

      @include mobile {
        @include flex($jc: start);
        width: 100%;
        margin: 2.4rem 0 0;
      }

      button {
        @include flex;
        transition: all 0.3s ease;
        margin: 0 0 0 -0.1rem;
        color: var(--text2);
        padding: 0.8rem;
        border: 1px solid var(--border3);

        @include mobile {
          &:first-child {
            margin: 0;
          }
        }

        &.on {
          border: 1px solid var(--primary);
          z-index: 1;
        }

        svg.on {
          fill: var(--primary);
        }
      }
    }
  }

  .categories {
    width: 100%;
    margin: 4.8rem 0 3.2rem;

    ul {
      @include flex;
      flex-wrap: wrap;
      margin: 0 0 1.2rem 0;
      li {
        flex: 0 0 auto;
        margin: 0 1.6rem 0 0;
        padding: 0.8rem 1.6rem;
        font-size: 1.4rem;
        color: var(--text3);
        border: 1px solid var(--border3);
        border-radius: 2.4rem;
        cursor: pointer;

        @include hover {
          border-color: var(--primary-light);
        }

        @include active {
          border-color: var(--primary-dark);
        }

        &:last-child {
          margin-right: 0;
        }

        &.on {
          color: var(--primary);
          border: 1px solid var(--primary);
        }
      }

      @include mobile_all {
        flex-wrap: nowrap;
        overflow-y: hidden;
      }
    }
  }
}
</style>
