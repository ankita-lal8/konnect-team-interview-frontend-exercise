import { vi, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHome from '@/views/PageHome.vue'
import ServiceCard from '@/components/ServiceCard/index.vue'
import servicesData from '../../../mocks/services'
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

// Stub child components

// vi.mock("@/components/ServiceCard/index.vue", () => ({
//   default: {
//     name: "ServiceCard",
//     template: '<div data-testid="service-card">Service Card</div>',
//   },
// }));

// const serviceData: SERVICE = {
//   id: "3f285716-163b-4ddc-9407-f3984c8a1328",
//   name: "Luxurious Concrete Soap",
//   description: "Function-based hybrid task-force",
//   type: "REST",
//   published: true,
//   configured: true,
//   versions: [
//     {
//       id: "e99f0377-a254-4315-924d-721db1588f9a",
//       name: "9.6.2",
//       description: "Multi-tiered 5th generation process improvement",
//       developer: {
//         id: "14543288-21f2-4522-96a7-363bc1966278",
//         name: "Loren Thiel",
//         email: "Loren_Thiel@gmail.com",
//         avatar: "https://avatars.githubusercontent.com/u/43187312",
//       },
//       updated_at: "2023-09-13T23:04:17.640Z",
//     },
//   ],
//   metrics: {
//     latency: 0.46,
//     uptime: 0.9643,
//     requests: 317133,
//     errors: 0.0865,
//   },
// };

// Create a router instance
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
describe('ServiceCard', async () => {
  it('receive proper prop on mount ', async () => {
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
    serviceCards.forEach((serviceCard, index) => {
      const expectedService = servicesData[index] // The service at this index
      expect(serviceCard.props().service).toEqual(expectedService)
    })
    // expect(wrapper.props().service).toBeDefined();
    // expect(wrapper.props().service).toEqual(serviceData);
    // expect(wrapper.find('[data-testid="service-card"]').exists()).toBe(true);
    // expect(wrapper.find('[data-testid="service-name"]').exists()).toBe(true);
  })
  it('should render service name on the card ', async () => {
    // mockedResponses.get("/api/services").mockReturnValue({
    //   data: servicesData,
    // });
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

    const serviceCards = wrapper.findAllComponents(ServiceCard)
    serviceCards.forEach((serviceCard) => {
      expect(serviceCard.find('[data-testid="service-name"]').exists()).toBe(
        true,
      )
    })
  })
  it('should emit click event when clicked on versions count element if count >0 ', async () => {
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
      expect(expectedService.versions.length).toBeGreaterThan(0)
      // Check if the mock method was called with the correct service
      expect(viewVersionsMock).toHaveBeenCalledWith(expectedService)
      expect(serviceCard.emitted().view_service_versions[0]).toEqual([
        expectedService,
      ])
    })
  })
  it('should not emit event when clicked on versions count when count<=0 ', async () => {
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
      expect(expectedService.versions.length).toHaveLength(0)
      // Check if the mock method was called with the correct service
      expect(serviceCard.emitted().view_service_versions[0]).toBeFalsy()
    })
  })
})
