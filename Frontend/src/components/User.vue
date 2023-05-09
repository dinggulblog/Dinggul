<template>
  <UserInfo>
    <template #avatar>
      <Image v-if="profile.avatar" class="avatar" :src="profile.avatar?.thumbnail" />
      <Image v-else class="avatar" :src="DEFAULT_AVATAR_64" />
    </template>

    <template #avatar_upload v-if="state === 'edit'">
      <div class="wrap_input_file">
        <label for="input_file">아바타 업로드</label>
        <input type="file" id="input_file" @change="emits('updateAvatar', $event)" accept="image/*" />
      </div>
      <Button class="btn_avatar_reset" :size="'sm'" :shape="'line-round'" @click="emits('resetAvatar')">아바타 초기화</Button>
    </template>

    <template #nickname>
      <span class="nickname">{{ profile.nickname }}</span>
    </template>

    <template #greetings v-if="profile.greetings && state !== 'edit'">
      <p class="greetings">{{ profile.greetings }}</p>
    </template>

    <template #greetings_textarea v-else-if="state === 'edit'">
      <textarea class="textarea_greetings" placeholder="인사말을 적어보세요." :value="profile.greetings" @change="emits('updateGreetings', $event)" />
    </template>
  </UserInfo>
</template>

<script setup>
import UserInfo from './slots/UserInfo.vue'
import DEFAULT_AVATAR_64 from '../assets/default_avatar_64.webp'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  state: {
    type: String,
  },
})

const emits = defineEmits(['updateAvatar', 'updateGreetings', 'resetAvatar']) // views -> Profile function
</script>
