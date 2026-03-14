<script setup>
useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ href: '/favicon.ico', rel: 'icon' }],
  meta: [{ content: 'width=device-width, initial-scale=1', name: 'viewport' }]
})

const title = 'Fault Tree Editor'
const description =
  'A visual editor for building and analyzing fault trees. Create, modify, and evaluate fault tree diagrams with an intuitive interface.'

useSeoMeta({
  description,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  ogTitle: title,
  title,
  twitterCard: 'summary_large_image',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png'
})
</script>

<template>
  <UApp>
    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
