<template>
  <li class="recent_item">
    <div class="wrap_contents">
      <slot name="thumbnail">
        <div class="thumbnail skeleton"></div>
      </slot>

      <div class="contents">
        <div class="category">
          <slot name="category"><p class="skeleton-category"></p></slot>
        </div>

        <div class="title">
          <slot name="title"><p class="skeleton-title"></p></slot>
          <slot name="lock_ico"></slot>
        </div>
        <div class="summary">
          <slot name="summary"><p class="skeleton-summary"></p></slot>
        </div>
        <div class="wrap_info">
          <div class="author">
            <slot name="author"><p class="skeleton-info"></p></slot>
          </div>
          <div class="createdAt">
            <slot name="createdAt"><p class="skeleton-info"></p></slot>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script></script>

<style lang="scss" rel="stylesheet/scss">
@import '../../scss/recent.scss';
</style>
