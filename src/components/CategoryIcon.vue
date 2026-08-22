<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  BriefcaseBusiness,
  Clapperboard,
  CloudCog,
  Code2,
  Gamepad2,
  Globe2,
  GraduationCap,
  HardDriveDownload,
  Headphones,
  Landmark,
  Network,
  Plane,
  RadioTower,
  Shapes,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from '@lucide/vue'
import type { CategoryIconKey } from '../domain/models'

const props = withDefaults(defineProps<{ iconKey?: CategoryIconKey; size?: number }>(), {
  iconKey: 'shapes',
  size: 18,
})

const icons: Record<CategoryIconKey, Component> = {
  sparkles: Sparkles,
  'code-2': Code2,
  'cloud-cog': CloudCog,
  'globe-2': Globe2,
  'briefcase-business': BriefcaseBusiness,
  'hard-drive-download': HardDriveDownload,
  clapperboard: Clapperboard,
  headphones: Headphones,
  'gamepad-2': Gamepad2,
  'users-round': UsersRound,
  network: Network,
  'radio-tower': RadioTower,
  'shopping-bag': ShoppingBag,
  landmark: Landmark,
  'graduation-cap': GraduationCap,
  plane: Plane,
  shapes: Shapes,
}
const icon = computed(() => icons[props.iconKey] || Shapes)
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :stroke-width="2"
    aria-hidden="true"
  />
</template>
