<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const email = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  error.value = '';

  try {
    const response = await axios.post(
      "https://51ee8a820928c63e.mokky.dev/auth",
      {
        email: email.value,
        password: password.value
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    // Проверяем структуру ответа и извлекаем нужные данные
    const userData = {
      token: response.data.token,
      name: response.data.user?.name || email.value,
      email: email.value
    };

    // Сохраняем данные пользователя
    authStore.login(userData);

    // Перенаправляем пользователя на домашнюю страницу или личный кабинет
    router.push('/');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Ошибка авторизации. Проверьте введённые данные.';
    }
    console.error(err);
  }
};
</script>

<template>
  <div class="flex flex-col items-center w-full" style="min-height: calc(100vh - 150px); padding-top: 50px;">
    <div class="bg-[#F9F9F9] py-10 px-8 rounded-lg">
      <div class="flex items-center justify-center gap-7 border-b-2 border-[#C9C9C9] pb-2">
        <RouterLink class="relative text-2xl font-semibold active-line" to="/login">
          Войти
        </RouterLink>
        <RouterLink class="text-2xl font-semibold text-[#0A65CC] hover:text-[#0A65CC]/80" to="/register">
          Зарегистрироваться
        </RouterLink>
      </div>
      <form class="flex flex-col gap-2 mt-4" @submit.prevent="login">
        <p class="text-[#656565] text-sm text-center">
          Войдите в аккаунт, чтобы продолжить
        </p>
        <input
          class="bg-white border border-[#C9C9C9] p-2 outline-none focus:border-[#0A65CC]"
          type="text"
          placeholder="Почта"
          v-model="email"
        />
        <input
          class="bg-white border border-[#C9C9C9] p-2 outline-none focus:border-[#0A65CC]"
          type="password"
          placeholder="Пароль"
          v-model="password"
        />
        <a href="#" class="text-sm text-[#0A65CC] text-right hover:text-[#0A65CC]/80">
          Забыли пароль?
        </a>
        <button
          class="cursor-pointer bg-[#0A65CC] text-white p-2 rounded-lg mt-2 hover:bg-[#0A65CC]/80"
          type="submit"
        >
          Войти
        </button>
        <!-- Вывод ошибки, если она имеется -->
        <p v-if="error" class="mt-2 text-red-500 text-sm text-center">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.active-line::after {
  position: absolute;
  content: '';
  width: 100%;
  height: 2px;
  background-color: #000;
  bottom: -10px;
  left: 0;
}
</style>
