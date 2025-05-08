<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import SettingsSection from '@/components/SettingsSection.vue';
import SettingsButton from '@/components/SettingsButton.vue';
import Mail from '@/icons/Mail.vue'
import Smartphone from '@/icons/Smartphone.vue'

const isDisabled = ref(true);
const userInfo = ref({
  name: 'Осман Асанов',
  username: '@yuken1',
  email: 'a***@gmail.com',
  phone: '+7 (9**) ***-**-25'
});
</script>

<template>
  <div class="relative flex flex-col w-3/5 mx-auto py-6 max-xl:w-4/5 max-lg:w-full max-lg:px-6">
    <div class="w-full">
      <h1 class="text-3xl font-bold text-[#222222] mb-6 max-sm:text-2xl">Настройки</h1>
      
      <!-- Профиль пользователя -->
      <div class="bg-white rounded-lg border border-[#E5E9F2] p-6 mb-6 shadow-sm">
        <div class="flex items-center gap-5 max-sm:flex-col">
          <div class="relative">
            <img 
              class="rounded-full w-24 h-24 object-cover border-2 border-[#E5E9F2]" 
              src="/public/avatar-full.jpg" 
              alt="Аватар пользователя" 
            />
            <div class="absolute bottom-0 right-0 bg-[#0A65CC] rounded-full p-1.5 border-2 border-white cursor-pointer hover:bg-[#085BBA] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
          </div>
          
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-[#222222]">{{ userInfo.name }}</h2>
            <p class="text-[#656565] text-sm mb-3">{{ userInfo.username }}</p>
            <div class="flex flex-wrap gap-4 max-sm:flex-col max-sm:gap-2">
              <div class="flex items-center gap-1.5 text-sm text-[#656565]">
                <Mail class="w-4 h-4" />
                {{ userInfo.email }}
              </div>
              <div class="flex items-center gap-1.5 text-sm text-[#656565]">
                <Smartphone class="w-4 h-4" />
                {{ userInfo.phone }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SettingsSection title="Личное" icon="User">
        <div class="flex flex-col gap-3">
          <SettingsButton label="Изменить аватарку" icon="User" />
          <SettingsButton label="Изменить пароль" icon="Lock" />
          <SettingsButton 
            label="Привязать почту" 
            icon="Mail" 
            :disabled="isDisabled"
            tooltip="Эта функция будет доступна в ближайшее время"
          />
        </div>
      </SettingsSection>
      
      <SettingsSection title="Оповещения" icon="Bell">
        <div class="flex flex-col gap-3">
          <SettingsButton 
            label="Push-уведомления" 
            icon="Bell" 
            :disabled="isDisabled" 
            tooltip="Функция в разработке"
          />
          <SettingsButton 
            label="Email-уведомления" 
            icon="Mail" 
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
          <SettingsButton 
            label="SMS-уведомления" 
            icon="Smartphone" 
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
        </div>
      </SettingsSection>
      
      <SettingsSection title="Тема и внешний вид" icon="Palette">
        <div class="flex flex-col gap-3">
          <SettingsButton 
            label="Выбор темы" 
            icon="Palette" 
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
          <SettingsButton 
            label="Размер шрифта" 
            icon="Type" 
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
          <SettingsButton 
            label="Анимации" 
            icon="Zap" 
            :disabled="isDisabled"
            tooltip="Функция в разработке"
          />
        </div>
      </SettingsSection>
      
      <div class="mt-8 text-center text-sm text-[#656565]">
        <p>Версия приложения: 1.0.0</p>
      </div>
    </div>
  </div>
</template>