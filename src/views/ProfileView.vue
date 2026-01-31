<template>
  <div class="page">
    <h1 class="title">PROFILE</h1>
    <p class="sub">Login / account (MVP)</p>

    <div class="panel">
      <h2>Quick actions</h2>
      <div class="row">
        <RouterLink class="btn" to="/b2b">Go B2B</RouterLink>
        <RouterLink class="btn2" to="/">Home</RouterLink>
      </div>

      <p class="muted">
        Auth sistemi bir sonraki adımda bağlanacak.
      </p>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
