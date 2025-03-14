<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import axios from 'axios';

const fullName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const error = ref('');

const router = useRouter();

const register = async () => {
  error.value = '';

  if (password.value !== passwordConfirm.value) {
    error.value = 'Пароли не совпадают';
    return;
  }

  try {
    const response = await axios.post(
      "https://51ee8a820928c63e.mokky.dev/register",
      {
        fullName: fullName.value,
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

    router.push('/login');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Ошибка регистрации';
    }
    console.error(err);
  }
};
</script>

<template>
  <div class="flex flex-col items-center w-full" style="min-height: calc(100vh - 150px); padding-top: 50px;">
    <div class="bg-[#F9F9F9] py-10 px-8 rounded-lg">
      <div class="flex items-center justify-center gap-7 border-b-2 border-[#C9C9C9] pb-2">
        <RouterLink
          class="text-2xl font-semibold text-[#0A65CC] hover:text-[#0A65CC]/80"
          to="/login"
        >
          Войти
        </RouterLink>
        <RouterLink class="text-2xl font-semibold relative active-line" to="/register">
          Зарегистрироваться
        </RouterLink>
      </div>
      <form class="flex flex-col gap-2 mt-4" @submit.prevent="register">
        <p class="text-[#656565] text-sm text-center">
          Создайте новый аккаунт
        </p>
        <input
          class="bg-white border border-[#C9C9C9] p-2 outline-none focus:border-[#0A65CC]"
          type="text"
          placeholder="Имя или псевдоним"
          v-model="fullName"
        />
        <input
          class="bg-white border border-[#C9C9C9] p-2 outline-none focus:border-[#0A65CC]"
          type="email"
          placeholder="Почта"
          v-model="email"
        />
        <input
          class="bg-white border border-[#C9C9C9] p-2 outline-none focus:border-[#0A65CC]"
          type="password"
          placeholder="Пароль"
          v-model="password"
        />
        <input
          class="bg-white border border-[#C9C9C9] p-2 outline-none focus:border-[#0A65CC]"
          type="password"
          placeholder="Повторите пароль"
          v-model="passwordConfirm"
        />
        <button
          class="cursor-pointer bg-[#0A65CC] text-white p-2 rounded-lg mt-2 hover:bg-[#0A65CC]/80"
          type="submit"
        >
          Зарегистрироваться
        </button>
        <p v-if="error" class="mt-2 text-red-500 text-sm text-center">
          {{ error }}
        </p>
        <p class="mt-2 text-[#656565] text-sm w-[350px] text-center">
          Регистрируясь, вы соглашаетесь с
          <a class="text-[#0A65CC] hover:text-[#0A65CC]/80" href="#">
            правилами обработки персональных данных
          </a>
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
  right: -4px;
}
</style>
