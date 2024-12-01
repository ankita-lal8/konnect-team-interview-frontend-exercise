import { ref, onBeforeMount } from 'vue'
import axios from 'axios'
import type { SERVICE } from '@/types'

// This composable is a simplified example for the exercise **and could likely be improved**.
// Feel free to leave as-is, modify, or remove this file (and any others) as desired.
// https://vuejs.org/guide/reusability/composables.html

export default function useServices(): any {
  const services = ref<SERVICE[]>([])
  const loading = ref<boolean>(false)
  const error = ref<boolean>(false)
  const errorType = ref<string>('generic')

  const getServices = async (): Promise<any> => {
    try {
      // Initialize loading state
      loading.value = true

      // Fetch data from the API
      const { data } = await axios.get('/api/services')
      if (!data.length) {
        errorType.value = 'empty'
        error.value = true
      }
      // Store data in Vue ref
      services.value = data
    } catch (err: any) {
      error.value = true
    } finally {
      // Reset loading state
      loading.value = false
    }
  }

  const refreshServices = async (): Promise<void> => {
    // Fetch services from the API
    await getServices()
  }

  const getFilteredServices = async (search: string): Promise<any> => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/services?q=${search}`)
      if (!data.length) {
        errorType.value = 'empty'
        error.value = true
      }
      return data
    } catch (err: any) {
      error.value = true
    } finally {
      // Reset loading state
      loading.value = false
    }
  }

  onBeforeMount(async (): Promise<void> => {
    // Fetch services from the API
    await getServices()
  })

  // Return stateful data
  return {
    services,
    loading,
    error,
    errorType,
    getFilteredServices,
    refreshServices,
  }
}
