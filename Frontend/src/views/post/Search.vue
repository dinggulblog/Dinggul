<template>
  <div class="search">
    <Form as="div" class="wrap_search-form" v-slot="{ handleSubmit }" :validation-schema="searchSchema">
      <form @submit="handleSubmit($event, null)">
        <TextInput
          name="text"
          type="text"
          placeholder="검색어를 입력해주세요"
          @callback="handleSubmit($event, onSearch)" />
      </form>
      <Ico class="ico_search" :svg="'search'" :color="'primary'"></Ico>
    </Form>
  </div>

  <div class="posts">
    <Suspense v-if="searchText.length">
      <template #default>
        <Posts
          :sort="sort"
          :searchText="searchText"
        />
      </template>
      <template #fallback>
        <ul :id="'recent'">
          <Recent v-for="skeleton in 6" :key="skeleton" />
        </ul>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { inject, ref, onErrorCaptured } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import Posts from '../../components/Posts.vue'
import List from '../../components/slots/List.vue'

const TOAST_EL = inject('TOAST_EL')
const searchSchema = Yup.object().shape({
  text: Yup.string()
    .required('검색어를 입력해 주세요.')
    .min(2, '검색어를 2글자 이상 입력해 주세요.'),
})

const sort = ref(null)
const searchText = ref('')

const onSearch = (values) => {
  searchText.value = values.text
}

onErrorCaptured((err) => {
  TOAST_EL.value.open('error', err)
  return true
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search {
  border-bottom: 1px solid var(--primary);
  .wrap_search-form {
    @include flex;
    @include position;
    padding: 0 0 1.2rem;

    form {
      width:90%;
    }

    &:deep(.TextInput) {
      width:100%;
      margin:0;

      input {
        border:0;
        margin:0;
        padding:1.6rem 0;
        font-size:2rem;
      }

    }

     .ico_search {
      @include position(absolute, $r: 0);
    }
  }
}

.posts {
  margin:6.4rem 0 0;
}
</style>
