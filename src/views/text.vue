<template>
  <div>
    <h1>
      <svg-icon
        style="font-size: 24px; color: yellowgreen; margin-right: 5px"
        icon-class="bagua2"
      />
      <router-link
        style="font-size: 26px; color: yellowgreen; margin: 0 5px"
        to="/"
        >市场</router-link
      >
      |
      <!-- <svg-icon style="color: cadetblue" icon-class="my" /> -->
      <router-link style="color: black; margin: 0 5px" to="/myself"
        >自选</router-link
      >|
      <!-- <svg-icon style="color: cadetblue" icon-class="taiji" /> -->
      <router-link style="color: black; margin: 0 5px" to="/zhouyi"
        >周易</router-link
      >
      <!-- <svg-icon style="color: aqua" icon-class="set" /> -->
      <!-- <svg-icon style="color: cadetblue" icon-class="taiji" /> -->|
      <router-link style="color: black; margin: 0 5px" to="/text"
        >测试页面</router-link
      >|
      <svg-icon
        style="font-size: 22px; color: yellowgreen; margin: 0 5px"
        icon-class="set"
      />
    </h1>
    <button @click="toggleTheme">Toggle Theme</button>
    <p>Current Theme: {{ currentTheme }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTheme: "light",
    };
  },
  methods: {
    toggleTheme() {
      if (this.currentTheme === "light") {
        this.currentTheme = "dark";
      } else {
        this.currentTheme = "light";
      }
    },
  },
};
</script>

<style>
body.light {
  background-color: white;
  color: black;
}

body.dark {
  background-color: black;
  color: white;
}

a {
  color: inherit;
}

.header {
  background-color: inherit;
  color: inherit;
}

.footer {
  background-color: inherit;
  color: inherit;
}

.btn {
  background-color: inherit;
  color: inherit;
  border: 1px solid inherit;
}

.btn:hover {
  background-color: white;
  color: black;
}
</style>