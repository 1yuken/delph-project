<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import SpecialistCard from '@/components/SpecialistCard.vue'
import SearchIcon2 from '@/icons/SearchIcon2.vue'
import FilterIcon from '@/icons/FilterIcon.vue'
import axios from 'axios'

const sortOptions = [
  { value: 'recommended', label: 'Рекомендуемые' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'reviews', label: 'По отзывам' },
  { value: 'new', label: 'Новые' },
]

const sortOption = ref('recommended')
const searchQuery = ref('')
const showFilters = ref(false)
const selectedSkills = ref([])
const isLoading = ref(false)
const error = ref('')

const specialists = ref([])

const allSkills = [
  'Vue',
  'JavaScript',
  'TypeScript',
  'React',
  'Angular',
  'Node.js',
  'PHP',
  'Laravel',
  'Python',
  'Django',
  'Ruby',
  'Rails',
  'Java',
  'Spring',
  'C#',
  '.NET',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'Flutter',
  'React Native',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Firebase',
  'MongoDB',
  'MySQL',
  'PostgreSQL',
  'Redis',
  'GraphQL',
  'REST API',
  'WebSockets',
  'HTML',
  'CSS',
  'SCSS',
  'Tailwind CSS',
  'Bootstrap',
  'Material UI',
  'Figma',
  'Adobe XD',
  'Sketch',
  'UI/UX',
  'Vite',
  'Webpack',
  'Nuxt.js',
  'Next.js',
  'Gatsby',
  'Svelte',
  'Electron',
  'PWA',
  'SEO',
  'DevOps',
  'CI/CD',
  'Git',
  'GitHub',
  'GitLab',
  'Bitbucket',
  'Jira',
  'Confluence',
  'Trello',
  'Agile',
  'Scrum',
  'Kanban',
  'Waterfall',
  'TDD',
  'BDD',
  'Unit Testing',
  'E2E Testing',
  'Jest',
  'Cypress',
  'Selenium',
  'Puppeteer',
  'Playwright',
  'Storybook',
  'Swagger',
  'OpenAPI',
  'OAuth',
  'JWT',
  'SAML',
  'SSO',
  'LDAP',
  'Active Directory',
  'Blockchain',
  'Smart Contracts',
  'Solidity',
  'Ethereum',
  'Bitcoin',
  'NFT',
  'Web3',
  'DeFi',
  'AI',
  'Machine Learning',
  'Deep Learning',
  'NLP',
  'Computer Vision',
  'TensorFlow',
  'PyTorch',
  'Keras',
  'scikit-learn',
  'pandas',
  'numpy',
  'matplotlib',
  'seaborn',
  'Jupyter',
  'R',
  'Data Science',
  'Big Data',
  'Hadoop',
  'Spark',
  'Kafka',
  'ELK Stack',
  'Logstash',
  'Kibana',
  'Elasticsearch',
  'Prometheus',
  'Grafana',
  'Datadog',
  'New Relic',
  'Sentry',
  'Rollbar',
  'Bugsnag',
  'Mixpanel',
  'Google Analytics',
  'Hotjar',
  'Amplitude',
  'Segment',
  'Customer.io',
  'Intercom',
  'Zendesk',
  'Salesforce',
  'HubSpot',
  'Mailchimp',
  'SendGrid',
  'Twilio',
  'Stripe',
  'PayPal',
  'Braintree',
  'Square',
  'Shopify',
  'WooCommerce',
  'Magento',
  'WordPress',
  'Drupal',
  'Joomla',
  'Ghost',
  'Contentful',
  'Sanity',
  'Strapi',
  'Prismic',
  'Netlify',
  'Vercel',
  'Heroku',
  'DigitalOcean',
  'Linode',
  'Vultr',
  'OVH',
  'Cloudflare',
  'Akamai',
  'Fastly',
  'Imperva',
  'Cloudinary',
  'imgix',
  'Uploadcare',
  'Filestack',
  'Algolia',
  'Elasticsearch',
  'Meilisearch',
  'Typesense',
  'Redis Search',
  'Solr',
  'Sphinx',
  'Lucene',
  'Vite',
  'Nuxt.js',
]

// Загрузка фрилансеров с сервера
const loadFreelancers = async () => {
  try {
    isLoading.value = true
    const response = await axios.get('http://localhost:3000/users/freelancers')
    specialists.value = response.data.map((freelancer) => ({
      id: freelancer.id,
      image: freelancer.avatarUrl || '/avatar-default.jpg',
      title: freelancer.bio || 'Фрилансер',
      username: freelancer.username,
      rating: 5, // TODO: Добавить реальный рейтинг
      reviewCount: 0, // TODO: Добавить реальное количество отзывов
      skills: freelancer.skills || [],
      lastActive: freelancer.registrationDate,
      completedProjects: 0, // TODO: Добавить реальное количество выполненных проектов
    }))
    console.log('Loaded specialists:', specialists.value)
  } catch (err) {
    console.error('Error loading freelancers:', err)
    error.value = 'Ошибка загрузки специалистов'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFreelancers()
})

const filteredSpecialists = computed(() => {
  let result = specialists.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (specialist) =>
        specialist.title.toLowerCase().includes(query) ||
        specialist.username.toLowerCase().includes(query) ||
        specialist.skills.some((skill) => skill.toLowerCase().includes(query)),
    )
  }

  if (selectedSkills.value.length > 0) {
    result = result.filter((specialist) =>
      selectedSkills.value.every((skill) => specialist.skills.includes(skill)),
    )
  }

  return result
})

const sortedSpecialists = computed(() => {
  const specialists = [...filteredSpecialists.value]

  switch (sortOption.value) {
    case 'rating':
      return specialists.sort((a, b) => b.rating - a.rating)
    case 'reviews':
      return specialists.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'new':
      return specialists.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
    default:
      return specialists.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
  }
})

const popularSkills = computed(() => {
  return allSkills.slice(0, 10)
})

const toggleSkill = (skill) => {
  const index = selectedSkills.value.indexOf(skill)
  if (index === -1) {
    selectedSkills.value.push(skill)
  } else {
    selectedSkills.value.splice(index, 1)
  }
}

const clearFilters = () => {
  selectedSkills.value = []
  searchQuery.value = ''
}
</script>

<template>
  <div class="relative w-full md:w-4/5 lg:w-3/5 mx-auto py-4 md:py-5 px-4 md:px-6">
    <div class="flex flex-col w-full">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6"
      >
        <h1 class="text-2xl md:text-3xl font-bold text-[#222222]">Специалисты</h1>

        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            @click="showFilters = !showFilters"
            class="flex items-center gap-1 px-3 py-2 text-sm border border-[#E5E9F2] rounded-md hover:border-[#0A65CC] transition-colors cursor-pointer"
            :class="{ 'bg-[#F0F7FF] border-[#0A65CC]': showFilters }"
          >
            <FilterIcon class="w-4 h-4" />
            <span>Фильтры</span>
            <span
              v-if="selectedSkills.length"
              class="ml-1 px-1.5 py-0.5 bg-[#0A65CC] text-white text-xs rounded-full"
            >
              {{ selectedSkills.length }}
            </span>
          </button>

          <div class="relative flex-grow sm:flex-grow-0">
            <select
              v-model="sortOption"
              class="w-full sm:w-auto px-3 py-2 border border-[#E5E9F2] rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0A65CC] appearance-none pr-8 bg-white"
            >
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#656565"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <div class="relative mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск специалистов по имени, навыкам или специализации"
            class="w-full px-4 py-3 pl-10 border border-[#E5E9F2] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0A65CC] focus:border-[#0A65CC]"
          />
          <SearchIcon2
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#656565]"
          />
        </div>

        <div
          v-if="showFilters"
          class="bg-[#F9F9F9] p-4 rounded-md border border-[#E5E9F2] mb-4 animate-fadeIn"
        >
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-medium">Фильтр по навыкам</h3>
            <button
              @click="clearFilters"
              class="text-sm text-[#0A65CC] hover:underline"
              :class="{ 'opacity-50 cursor-not-allowed': !selectedSkills.length && !searchQuery }"
              :disabled="!selectedSkills.length && !searchQuery"
            >
              Очистить все
            </button>
          </div>

          <div class="mb-3">
            <p class="text-sm text-[#656565] mb-2">Популярные навыки:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="skill in popularSkills"
                :key="skill"
                @click="toggleSkill(skill)"
                class="px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer"
                :class="
                  selectedSkills.includes(skill)
                    ? 'bg-[#0A65CC] text-white'
                    : 'bg-[#F0F7FF] text-[#0A65CC] hover:bg-[#E1EFFF]'
                "
              >
                {{ skill }}
              </button>
            </div>
          </div>

          <div v-if="selectedSkills.length" class="mt-4">
            <p class="text-sm text-[#656565] mb-2">Выбранные навыки:</p>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="skill in selectedSkills"
                :key="skill"
                class="flex items-center gap-1 px-3 py-1.5 bg-[#0A65CC] text-white text-xs rounded-md"
              >
                {{ skill }}
                <button @click="toggleSkill(skill)" class="ml-1 hover:text-gray-200 cursor-pointer">
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L7 7M1 7L7 1"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-8 md:py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A65CC]"></div>
        <p class="mt-4 text-[#656565]">Загрузка специалистов...</p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-8 md:py-12 text-center"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mb-4 text-red-500"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 9L9 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 9L15 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h3 class="text-lg font-medium mb-2 text-red-500">{{ error }}</h3>
        <button
          @click="loadFreelancers"
          class="px-4 py-2 bg-[#0A65CC] text-white rounded-md hover:bg-[#085BBA] transition-colors cursor-pointer"
        >
          Попробовать снова
        </button>
      </div>

      <!-- No results state -->
      <div
        v-else-if="!sortedSpecialists.length"
        class="flex flex-col items-center justify-center py-8 md:py-12 text-center"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mb-4 text-[#E5E9F2]"
        >
          <path
            d="M10 10L4 16M4 10L10 16"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M19 10C19 10 20 12.5 20 14C20 15.5 19 16 17.5 16C16 16 14 15 14 15"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path d="M3 21L21 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <h3 class="text-lg font-medium mb-2">Специалисты не найдены</h3>
        <p class="text-[#656565] mb-4">Попробуйте изменить параметры поиска или фильтры</p>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-[#0A65CC] text-white rounded-md hover:bg-[#085BBA] transition-colors cursor-pointer"
        >
          Сбросить фильтры
        </button>
      </div>

      <!-- Results -->
      <div v-else class="flex flex-col gap-4">
        <SpecialistCard
          v-for="specialist in sortedSpecialists"
          :key="specialist.id"
          :specialist="specialist"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (hover: none) {
  button,
  select {
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
  }
}

@media (max-width: 360px) {
  .flex-wrap {
    margin-top: 0.5rem;
  }
}
</style>
