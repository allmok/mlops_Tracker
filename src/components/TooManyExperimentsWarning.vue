<template>
  <div class="text-center py-8">
    <i class="pi pi-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">Too many experiments</h3>
    <p class="text-gray-600 mb-4">
      {{ selectedCount }} experiments selected.
    </p>
    <Button 
      @click="$emit('select-first-ten')"
      label="Select the first 10"
      class="p-button-outlined"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedCount: number
}

defineProps<Props>()

defineEmits<{
  'select-first-ten': []
}>()
</script>s