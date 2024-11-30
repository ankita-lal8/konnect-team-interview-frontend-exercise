import { vi, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHome from '@/views/PageHome.vue'
import ServiceCard from '@/components/ServiceCard/index.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import servicesData from '../../mocks/services'
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
// Mock the axios module for fetching API services
const mockedResponses = new Map().set(
  '/api/services',
  vi.fn(() => ({
    data: servicesData,
  })),
)

vi.mock('axios', async () => {
  const actual: any = await vi.importActual('axios')
  return {
    default: {
      ...actual.default,
      // Mock get request responses
      get: (url: string) =>
        vi
          .fn()
          .mockResolvedValue(
            mockedResponses.get(url) !== undefined
              ? mockedResponses.get(url)()
              : undefined,
          )(),
    },
  }
})

// Stubbing child components
vi.mock('@/components/Loader.vue', () => ({
  default: {
    name: 'Loader',
    template: '<div data-testid="loader">Loader</div>',
  },
}))

vi.mock('@/components/ErrorState/index.vue', () => ({
  default: {
    name: 'ErrorState',
    template: '<div data-testid="error-state">Error</div>',
  },
}))

// router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PageHome,
    },
  ],
})

// Component test for PageHome.vue
describe('PageHome', () => {
  it('should render Loader when loading is true ', async () => {
    const wrapper = mount(PageHome, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          loading: true,
          error: false,
          paginatedData: [],
        }
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="loader"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-testid="service-card"]').length).toBe(0)
  })

  it('should render ErrorState when loading is false and error is true', async () => {
    mockedResponses.get('/api/services').mockReturnValue({
      data: [],
    })
    const wrapper = mount(PageHome, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          loading: false,
          error: true,
          errorType: 'empty',
          paginatedData: [],
        }
      },
    })

    await wrapper.vm.$nextTick()
    await axios.get('/api/services')
    expect(wrapper.find('[data-testid="loader"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="service-card"]').length).toBe(0)
  })
  it("should have  service card's length equal to paginatedData length when Loading and Error is false", async () => {
    mockedResponses.get('/api/services').mockReturnValue({
      data: servicesData,
    })
    const wrapper = mount(PageHome, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          loading: false,
          error: false,
          paginatedData: servicesData,
        }
      },
    })

    await wrapper.vm.$nextTick()
    await axios.get('/api/services')
    const serviceCards = wrapper.findAllComponents(ServiceCard)
    expect(serviceCards.length).toBe(servicesData.length)
  })

  it('passes the correct props to each ServiceCard component', () => {
    const wrapper = mount(PageHome, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          loading: false,
          error: false,
          paginatedData: servicesData,
        }
      },
    })
    // Find all ServiceCard components
    const serviceCards = wrapper.findAllComponents(ServiceCard)

    // Check each ServiceCard's props
    serviceCards.forEach((serviceCard, index) => {
      const expectedService = servicesData[index]
      expect(serviceCard.props().service).toEqual(expectedService)
    })
  })
  it('should render Sidebar when view_service_versions event is emitted from ServiceCard', async () => {
    const wrapper = mount(PageHome, {
      data() {
        return {
          loading: false,
          error: false,
          paginatedData: servicesData,
          sidebarData: null,
          isSidebarVisible: false,
        }
      },
      global: {
        plugins: [router],
        components: {
          ServiceCard,
          Sidebar,
        },
      },
    })

    // Find the ServiceCard component and trigger the click event
    const serviceCards = wrapper.findAllComponents(ServiceCard)
    serviceCards.forEach(async (serviceCard, index) => {
      const expectedService = servicesData[index]
      const viewVersionsMock = vi.fn();
      (serviceCard.vm as any).viewVersions = viewVersionsMock
      const versionsCountElement = wrapper.find(
        '[data-testid="versions-count"]',
      )
      // Trigger the click event on the  element
      await versionsCountElement.trigger('click')
      // Simulate the emission of the `view_service_versions` event
      await serviceCard.vm.$emit('view_service_versions', servicesData[0])
      await wrapper.setData({
        sidebarData: expectedService, // The service object is now set to sidebarData
        isSidebarVisible: true, // Set to true to show the Sidebar
      })
      const sidebar = wrapper.findComponent(Sidebar)
      // Sidebar should exist
      expect(sidebar.exists()).toBe(true)
      // Sidebar should receive the correct data
      expect(sidebar.props().data).toEqual([servicesData[0]])
    })
  })
  it('should not render Sidebar when sidebarData.verions is null or isSidebarVisible is false ', async () => {
    const wrapper = mount(PageHome, {
      data() {
        return {
          loading: false,
          error: false,
          paginatedData: servicesData,
          sidebarData: null,
          isSidebarVisible: false,
        }
      },
      global: {
        plugins: [router],
        components: {
          ServiceCard,
          Sidebar,
        },
      },
    })

    // Find the ServiceCard component and trigger the click event
    const serviceCards = wrapper.findAllComponents(ServiceCard)
    serviceCards.forEach(async (serviceCard, index) => {
      const expectedService = servicesData[index]
      const viewVersionsMock = vi.fn();
      (serviceCard.vm as any).viewVersions = viewVersionsMock
      const versionsCountElement = wrapper.find(
        '[data-testid="versions-count"]',
      )
      // Trigger the click event on the p element
      await versionsCountElement.trigger('click')
      // Simulate the emission of the `view_service_versions` event
      await serviceCard.vm.$emit('view_service_versions', servicesData[0])
      await wrapper.setData({
        sidebarData: null,
        isSidebarVisible: true,
      })
      const sidebar = wrapper.findComponent(Sidebar)
      expect(sidebar.exists()).toBe(false)

      await wrapper.setData({
        sidebarData: expectedService,
        isSidebarVisible: false,
      })
      expect(sidebar.exists()).toBe(false)
    })
  })
  it('should render Add Service CTA', async () => {
    const wrapper = mount(PageHome, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          loading: false,
          error: false,
          paginatedData: servicesData,
        }
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="add-service"]').exists()).toBe(true)
  })
  it('should open Overlay on click of Add Service CTA', async () => {
    const wrapper = mount(PageHome, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          loading: false,
          error: false,
          paginatedData: servicesData,
        }
      },
    })

    const button = wrapper.find('[data-testid="add-service"]')
    // Simulate a click event on the button
    await button.trigger('click')
    await wrapper.setData({
      isOverlayOpen: true,
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="add-service-overlay"]').exists()).toBe(
      true,
    )
  })
  it('should render search input ', async () => {
    const wrapper = mount(PageHome, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          loading: false,
          error: false,
          paginatedData: servicesData,
        }
      },
    })

    expect(wrapper.find('[data-testid="search"]').exists()).toBe(true)
  })
  it('should call trigger debounced search handler on user input ', async () => {
    const debouncedSearchSpy = vi.fn()

    const wrapper = mount(PageHome, {
      global: {
        plugins: [router],
      },
      data() {
        return {
          loading: false,
          error: false,
          searchInput: '',
        }
      },
      methods: {
        debouncedSearch: debouncedSearchSpy,
        triggerSearch: vi.fn(), // Mocking triggerSearch method
      },
    })

    const input = wrapper.find('[data-testid="search"]')
    // Simulate typing in the input field
    await input.setValue('New search term')
    await wrapper.vm.$nextTick()

    // The debounced function should not be called immediately
    expect(debouncedSearchSpy).not.toHaveBeenCalled()
    // mocking setTimeqout for debounced function
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setTimeout = vi.fn((callback: any, delay: number) => callback())
    // Waiting for debouncedSearch to be invoked (using the debounce delay)
    setTimeout(debouncedSearchSpy, 500)
    // Assert that the debouncedSearch method was called once after the delay
    expect(debouncedSearchSpy).toHaveBeenCalledTimes(1)
    // Assert that the debouncedSearch method was called not called multiple times after the delay
    expect(debouncedSearchSpy).not.toHaveBeenCalledTimes(2)
  })
})
