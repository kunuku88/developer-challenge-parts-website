<script setup lang="ts">
const { loading } = useLoader();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppLoader :visible="loading" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
