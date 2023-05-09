<template>
  <div class="container_bar">
    <div class="bar">
      <div class="wrap_left">
        <Button v-if="isMobile" class="btn_m-bar" svg="menu" @click="onToggleGnb" aria-label="mobile menu" />
        <Button v-else class="btn_search" svg="search" @click="$router.push({ name: 'search' })" aria-label="search" />
      </div>

      <div class="logo">
        <router-link :to="{ name: 'home' }" class="a_logo">
          <img :src="LOGO" alt="logo" />
        </router-link>
      </div>

      <div class="wrap_right">
        <Button v-if="isMobile" class="btn_search" svg="search" @click="$router.push({ name: 'search' })" aria-label="search" />

        <Button v-else-if="!$store.state.auth.user" class="btn_login" svg="lock" @click="ACCOUNT_EL.open('login')" aria-label="login" />

        <div v-else class="wrap_auth">
          <div class="auth dropdown">
            <User :profile="$store.state.auth.user" />
            <div class="auth_items dropdown_items">
              <ul>
                <li v-if="$store.state.auth.isAdmin"><router-link :to="{ name: 'dashboard', params: { section: 'chart' } }">Dashboard</router-link></li>
                <li><span @click="ACCOUNT_EL.open('update')">Account</span></li>
                <li><router-link :to="{ name: 'profile', params: { nickname: $store.state.auth.user.nickname } }">Profile</router-link></li>
                <li><span @click="$store.dispatch('auth/logout')">Logout</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade_left">
    <div class="container_gnb" v-if="!isMobile || isOpenGnb">
      <div class="gnb">
        <Navigation @closeAll="onCloseGnb" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { inject, ref } from 'vue'
import Navigation from './Navigation.vue'
import User from '../User.vue'
import LOGO from '../../assets/logo.png'

const isOpenGnb = ref(false)
const isMobile = inject('isMobileAndTablet')
const ACCOUNT_EL = inject('ACCOUNT_EL')

const onCloseGnb = () => {
  isOpenGnb.value = false
}

const onToggleGnb = () => {
  isOpenGnb.value = !isOpenGnb.value
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.fade_left-leave-active {
  transition: opacity 0s;
}

.container_bar {
  @include flex-center;
  width: 100%;
  margin: 0;
  border-bottom: 1px solid var(--border2);

  .bar {
    @include flex;
    min-width: calc(120rem - 4.8rem);
    max-width: calc(120rem - 4.8rem);
    height: 6.4rem;
    margin: 0 2.4rem;
    font-size: 1.4rem;
    color: var(--text3);

    @include mobile_all {
      font-size: 1.6rem;
    }

    @include mobile {
      min-width: calc(100% - 4rem);
      margin: 0 2rem;
    }

    @include tablet {
      min-width: calc(100% - 9.6rem);
      margin: 0 4.8rem;
    }

    @include tablet_landscape {
      min-width: calc(100% - 6.4rem);
      margin: 0 3.2rem;
    }

    a {
      color: var(--text3);
    }

    .logo {
      @include flex($jc: center);
      flex-basis: 60%;
      flex-shrink: 2;

      .a_logo {
        font-size: 2.4rem;

        img {
          width: 10.5rem;
          height: 2.6rem;
        }
      }
    }
    .wrap_left {
      flex-basis: 20%;
      flex-shrink: 1;
    }
    .wrap_right {
      @include flex($jc: end);
      flex-shrink: 1;
      flex-basis: 20%;

      .ico_lock {
        cursor: pointer;
      }

      .wrap_auth {
        @include flex;
        .a_create {
          @include mobile_all {
            display: none;
          }
        }
        .auth {
          @include flex;
          margin: 0 0 0 4.8rem;

          &:deep(.user-info) {
            flex-direction: row-reverse;

            .wrap_avatar {
              margin: 0 0 0 1.2rem;
            }
          }

          .auth_items {
            padding: 4rem 0 0;

            ul {
              @include position($z:999);
              background-color: var(--bg2);
              border: 1px solid var(--border2);
              border-radius: 1.2rem;
              cursor: default;
            }

            li {
              width: 10rem;
              margin: 2rem 0;
              text-align: center;

              @include tablet_landscape {
                width: 12rem;
                margin: 3.2rem 0;
              }

              a,
              span {
                font-size: 1.2rem;
                font-weight: 400;
                color: var(--text3);
                cursor: pointer;

                @include tablet_landscape {
                  font-size: 1.6rem;
                }

                @include hover;
                @include active;
              }
            }
          }
        }
      }

      .a_create,
      .a_login {
        @include flex;
      }
    }
  }
}

.container_gnb {
  @include flex-center;
  width: 100%;
  border-bottom: 1px solid var(--border2);

  @include mobile_all {
    @include flex($jc: start);
    @include position(fixed, $t:0);
  }

  .gnb {
    @include flex;
    width: calc(120rem - 4.8rem);
    height: 4.8rem;
    background-color: var(--bg1);

    @include mobile_all {
      width: auto;
      height: auto;
      border-right: 1px solid var(--border2);
    }

    @include mobile {
      width: 100%;
      border: 0;
    }
  }
}
</style>
