<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import SettingsSection from '@/components/SettingsSection.vue';
import SettingsButton from '@/components/SettingsButton.vue';

const isDisabled = ref(true);
</script>

<template>
  <div class="relative flex items-center w-3/5 m-auto py-5 gap-4 max-xl:w-4/5 max-lg:w-5/5 max-lg:px-4">
    <div class="flex flex-col w-full">
      <h1 class="text-3xl font-bold text-[#222222]">Настройки</h1>
      <SettingsSection title="Личное">
        <div class="flex items-center mx-auto gap-4 max-sm:flex-col">
          <img class="rounded-full" src="/public/avatar-full.jpg" width="115" height="115" alt="change avatar" />
          <div class="flex flex-col gap-2">
            <SettingsButton label="Изменить аватарку" />
            <SettingsButton label="Изменить пароль" />
            <SettingsButton label="Привязать почту" :disabled="isDisabled"/>
          </div>
        </div>
      </SettingsSection>
      
      <SettingsSection title="Оповещения">
        <div class="flex items-center mx-auto gap-4">
          <div class="flex flex-col gap-2">
            <SettingsButton label="Push-уведомления" :disabled="isDisabled" />
            <SettingsButton label="Email-уведомления" :disabled="isDisabled" />
            <SettingsButton label="SMS-уведомления" :disabled="isDisabled" />
          </div>
        </div>
      </SettingsSection>
      
      <SettingsSection title="Тема и внешний вид">
        <div class="flex items-center mx-auto gap-4">
          <div class="flex flex-col gap-2">
            <SettingsButton label="Выбор темы" :disabled="isDisabled" />
            <SettingsButton label="Размер шрифта" :disabled="isDisabled" />
            <SettingsButton label="Анимации" :disabled="isDisabled" />
          </div>
        </div>
      </SettingsSection>
    </div>
  </div>
</template>

<style scoped>
</style>