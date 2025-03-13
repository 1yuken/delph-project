<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
// import EditIcon from '@/icons/EditIcon.vue';
import StarIcon from '@/icons/StarIcon.vue';
import { ref } from 'vue'

const fullName = ref('yuken')
</script>

<template>
  <div class="relative flex items-center w-3/5 m-auto py-5 gap-4">
    <div>
      <div>
        <div class="relative inline-block">
          <img
            class="rounded-full block"
            src="/public/avatar-full.jpg"
            width="170"
            height="170"
            alt="avatar"
          />
          <img
            class="absolute top-0 right-0 bg-[#0A65CC] p-2 rounded-full cursor-pointer transition hover:bg-[#085BBA]"
            src="/public/edit-small.png"
            alt="edit avatar button"
          />
        </div>
        <h1 class="text-3xl font-bold text-[#222222] mt-4">{{ fullName }}</h1>
        <div class="mt-2">
          <p class="text-[#656565] text-sm mb-1">Дата регистрации</p>
          <p class="text-sm">23 февраля 2020, 0:04</p>
          <p class="text-sm">5 лет назад</p>
        </div>
      </div>
      <div class="mt-12">
        <h3 class="text-[#656565] text-sm mb-2">Отзывы</h3>
        <div class="flex flex-col gap-2 border border-[#C9C9C9] p-6">
          <p class="text-sm text-[#222222]">Рейтинг продавца</p>
          <span class="font-bold text-[#222222]"><span class="text-5xl">?</span> из 5</span>
          <div class="flex items-center mt-4 gap-4 border-t border-[#C9C9C9] pt-6">
            <img
              class="rounded-full"
              src="/public/avatar-full.jpg"
              width="40px"
              height="40px"
              alt="#"
            />
            <div>
              <div>
                <div class="flex gap-2">
                  <p class="text-sm font-bold">yuken</p>
                  <a href="#" class="text-sm text-[#0A65CC] font-bold hover:text-[#0A65CC]/80 hover:underline">Заказ #G6TXYXGE</a>
                  <p class="text-sm">23 февраля 2023 в 0:04, 2 года назад</p>
                  <StarIcon/>
                  <StarIcon/>
                  <StarIcon/>
                  <StarIcon/>
                  <StarIcon/>
                </div>
                <p class="text-sm text-[#a6a6a6] font-bold">React, 4000 руб</p>
              </div>
              <p class="text-sm mt-2">Все отлично, отзывчивый продавец</p>
            </div>
          </div>
          <div class="flex items-center mt-4 gap-4 border-t border-[#C9C9C9] pt-6">
            <img
              class="rounded-full"
              src="/public/avatar-full.jpg"
              width="40px"
              height="40px"
              alt="#"
            />
            <div>
              <div>
                <div class="flex gap-2">
                  <p class="text-sm font-bold">yuken</p>
                  <a href="#" class="text-sm text-[#0A65CC] font-bold hover:text-[#0A65CC]/80 hover:underline">Заказ #G6TXYXGE</a>
                  <p class="text-sm">23 февраля 2023 в 0:04, 2 года назад</p>
                  <StarIcon/>
                  <StarIcon/>
                  <StarIcon/>
                  <StarIcon/>
                </div>
                <p class="text-sm text-[#a6a6a6] font-bold">React, 4000 руб</p>
              </div>
              <p class="text-sm mt-2">Все отлично, отзывчивый продавец</p>
            </div>
          </div>
          <div class="flex items-center mt-4 gap-4 border-t border-[#C9C9C9] pt-6">
            <img
              class="rounded-full"
              src="/public/avatar-full.jpg"
              width="40px"
              height="40px"
              alt="#"
            />
            <div>
              <div>
                <div class="flex gap-2">
                  <p class="text-sm font-bold">yuken</p>
                  <a href="#" class="text-sm text-[#0A65CC] font-bold hover:text-[#0A65CC]/80 hover:underline">Заказ #G6TXYXGE</a>
                  <p class="text-sm">23 февраля 2023 в 0:04, 2 года назад</p>
                  <StarIcon/>
                  <StarIcon/>
                  <StarIcon/>
                  <StarIcon/>
                </div>
                <p class="text-sm text-[#a6a6a6] font-bold">React, 4000 руб</p>
              </div>
              <p class="text-sm mt-2">Все отлично, отзывчивый продавец</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
