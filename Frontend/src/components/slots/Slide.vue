<template>
  <li class="slide_item">
    <slot name="thumbnail">
      <div class="thumbnail skeleton"></div>
    </slot>

    <div class="wrap_title">
      <div class="title">
        <slot name="title">
          <p class="skeleton-title"></p>
        </slot>
      </div>
    </div>

    <div class="wrap_info">
      <div class="createdAt">
        <slot name="createdAt">
          <p class="skeleton-info"></p>
        </slot>
      </div>
      <div class="wrap_comment_like">
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
  </li>
</template>

<script></script>

<style lang="scss" rel="stylesheet/scss">
@import '../../scss/slide.scss';
</style>
