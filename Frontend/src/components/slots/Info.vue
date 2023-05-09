<template>
  <div class="info">
    <ul>
      <slot name="createdAt"></slot>
      <slot name="category"></slot>
    </ul>
  </div>
</template>

<script></script>

<style lang="scss" rel="stylesheet/scss" scoped>
.info {
  ul {
    display: flex;
    align-items: center;

    &:deep(li) {
      margin: 0 1.2rem 0 0;
      padding: 0 0 0 1.2rem;
      display: flex;
      align-items: center;
      position: relative;

      span {
        font-size: 1.3rem;
        color: var(--text2);
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 0.01rem;
        height: 1.2rem;
        background-color: var(--border3);
      }

      &:first-child {
        padding: 0;

        &::before {
          display: none;
        }
      }

      &:last-child {
        margin: 0;
      }

      .author {
        align-items: center;
        flex-direction: row;

        .avatar {
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 0.8rem 0 0;
        }
      }
    }
  }
}
</style>
