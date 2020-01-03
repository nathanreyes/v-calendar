<template>
  <div class="example">
    <v-calendar is-dark title-position="left" />
  </div>
</template>

<style lang="postcss" scoped>
.example {
  background-color: #1a202c;
}

/deep/ .vc-container {
  background-image: url('../../images/dark-woods.jpg');
  background-repeat: no-repeat;
  background-size: cover;

  --day-content-width: 30px;

  & .vc-title,
  & .vc-arrow {
    color: #4a5568;
    font-size: 26px;
    font-weight: 300;
    opacity: 0.8;
  }

  & .vc-weekday {
    color: #2d3748;
    padding: 24px 0;
    font-size: 18px;
    font-weight: 400;
    opacity: 0.8;
  }

  & .vc-day-content {
    color: #e2e8f0;
    opacity: 0.7;
    font-size: 16px;
    font-weight: 500;
    padding: 18px;
    margin: 8px;
  }
}
</style>

