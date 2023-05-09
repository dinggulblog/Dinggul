<template>
  <li class="list_item">
    <div class="wrap_contents">
      <div class="contents">
        <div class="title">
          <slot name="title">
            <p class="skeleton-title"></p>
          </slot>
          <slot name="lock_ico"></slot>
        </div>
        <div class="summary">
          <slot name="summary">
            <p v-for="summary in 2" :key="summary" class="skeleton-summary"></p>
          </slot>
        </div>
        <div class="wrap_info">
          <div class="createdAt">
            <slot name="createdAt">
              <p class="skeleton-info"></p>
            </slot>
          </div>
          <div class="comment_count">
            <slot name="comment_count">
              <p class="skeleton-info"></p>
            </slot>
          </div>
          <div class="like_count">
            <slot name="like_count">
              <p class="skeleton-info"></p>
            </slot>
          </div>
        </div>
      </div>

      <slot name="thumbnail">
        <div class="thumbnail skeleton"></div>
      </slot>
    </div>
  </li>
</template>

<script></script>

<style lang="scss" rel="stylesheet/scss">
@import '../../scss/list.scss';
</style>
