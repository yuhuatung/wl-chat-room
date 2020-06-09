<template>
  <div class="user-page">
    <!-- <div>个人主页</div> -->
    <template v-if="consultant && consultant.added">
      <img class="user-icon" :src="consultant.added.icon" />
      <div>{{consultant.nickname}}</div>
    </template>
  </div>
</template>

<script>
export default {
  name: "user",
  props: {
    consultant: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.user-page {
  text-align: center;
  margin: 50px auto;
}

.user-icon {
  width: 60px;
  height: 60px;
  -webkit-clip-path: circle(50% at 50% 50%);
}
</style>