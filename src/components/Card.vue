<template>
  <div class="card mb-2" @click="$emit('click');">
    <img :src="image" class="card-img-top" />
    <div class="card-body text-center">
      <h5 class="card-title">{{ name }}</h5>
      <a href="#" @click="$emit('click');" class="btn btn-primary">Delete</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ["name", "image"]
};
</script>
