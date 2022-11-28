<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col text-center">
        <h1>Vuex 101 (SNES Nostalgia Edition)</h1>
      </div>
    </div>

    <div class="row my-4">
      <div class="col-12 col-md-6 col-lg-4" style="color: red" :key="game.title" v-for="game in games">
        <card @click="removeGame(game);" :name="game.title" :image="game.img"></card>
      </div>
    </div>
    <ul class="list-group">
      <li class="list-group-item" v-for="title in gameTitles" style="color: pink; background-color: teal" :key="title">{{ title }}</li>
    </ul>
  </div>
</template>

<script>
import Card from "./components/Card";
import data from "./data/data.json";

export default {
  name: "App",
  components: {
    Card
  },
  methods: {
    getFromAPI() {
      // Assume were getting something frmo an api call here
      // axios.get().then() ...
      const apiData = data; // Our "pretend" ajax call
      apiData.forEach(game => {
        this.$store.dispatch("addGame", game);
      });
    },

    removeGame(game) {
      this.$store.dispatch("removeGame", game);
    }
  },
  computed: {
    gameTitles() {
      return this.$store.getters.gameTitles;
    },
    games() {
      return this.$store.state.games;
    }
  },
  created() {
    this.getFromAPI();
  }
};
</script>
