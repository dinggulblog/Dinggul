<template>
  <div id="header">
    <MyHeader />
  </div>

  <div class="content-container">
    <div id="content" :style="$route.name === 'dashboard' ? { width: '80%' } : ''">
      <div>
        <router-view @vnode-before-mount="getItem('user', null) && $store.dispatch('auth/refresh')" />
      </div>
    </div>
  </div>

  <div id="footer">
    <div class="wrap_contents">
      <p class="links">
        <a href="https://github.com/dinggulblog" target="_blank"> <Ico :size="'lg'" :svg="'github'" class="ico_link" />dinggul project github </a>
      </p>
    </div>
  </div>

  <div class="btn_create" v-if="$store.state.auth.user">
    <router-link :to="{ name: 'editor' }" class="a_create"><Ico :size="'md'" :svg="'create'" aria-label="create post"/></router-link>
  </div>

  <Dialog ref="DIALOG_EL" />
  <Toast ref="TOAST_EL" />
  <Account ref="ACCOUNT_EL" />
  <Contact ref="CONTACT_EL" />
</template>

<script setup>
import { getItem } from './common/localStorage'
import { ref, provide } from 'vue'

const DIALOG_EL = ref(null)
const TOAST_EL = ref(null)
const ACCOUNT_EL = ref(null)
const CONTACT_EL = ref(null)

provide('DIALOG_EL', DIALOG_EL)
provide('TOAST_EL', TOAST_EL)
provide('ACCOUNT_EL', ACCOUNT_EL)
provide('CONTACT_EL', CONTACT_EL)
</script>

<style lang="scss" rel="stylesheet/scss">
@import './scss/common.scss';
@import './scss/fade.scss';

#header {
  @include position(sticky, $t:0, $z: 997);
  background: var(--bg1);
}

.content-container {
  @include flex-center;

  #content {
    @include position;
    width: calc(120rem - 4.8rem);
    margin: 4.8rem 2.4rem;
    box-sizing: border-box;

    @include mobile {
      width: calc(100% - 4rem);
      margin: 4rem 2rem;
    }

    @include tablet {
      width: calc(100% - 12.8rem);
      margin: 4rem 6.4rem;
    }

    @include tablet_landscape {
      width: calc(100% - 6.4rem);
      margin: 4rem 3.2rem;
    }
  }
}

#footer {
  @include flex-center;
  width: 100%;
  height: 8rem;
  font-size: 1.2rem;
  color: #a5a5a5;
  letter-spacing: 0.05rem;
  border-top: 1px solid var(--border2);

  .wrap_contents {
    @include flex;
    width: calc(120rem - 4.8rem);
    text-transform: capitalize;

    @include mobile {
      width: calc(100% - 4rem);
      margin: 0 2rem;
    }

    @include tablet {
      width: calc(100% - 12.8rem);
      margin: 0 6.4rem;
    }

    @include tablet_landscape {
      width: calc(100% - 6.4rem);
      margin: 0 3.2rem;
    }

    .links {
      a {
        @include flex;
        color: var(--primary);
        font-weight: 500;

        .ico_link {
          margin: 0 0.8rem 0 0;
        }
      }
    }
  }
}

.btn_create {
  @include position(absolute, $b: 4.8rem, $r: 4.8rem, $z: 15);

  @include mobile {
    @include position(absolute, $b: 2.4rem, $r: 2.4rem);
  }

  .a_create {
    @include flex-center;
    width: 4.8rem;
    height: 4.8rem;
    color: var(--text1);
    background-color: var(--primary);
    border-radius: 50%;
    box-shadow: var(--shadow1);
  }
}
</style>
