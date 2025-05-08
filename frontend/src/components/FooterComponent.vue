<script setup>
import { MessageSquare, CreditCard, User, Shield, BookOpen, HelpCircle, Mail, Phone, MapPin } from 'lucide-vue-next';
</script>

<template>
  <footer class="bg-[#F9F9F9] border-t border-[#E5E9F2] mt-12">
    <!-- Основная часть футера -->
    <div class="w-full max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Колонка с логотипом и описанием -->
        <div>
          <div class="mb-4">
            <h2 class="font-bold text-2xl text-[#0A65CC]">
              Delph<span class="text-[#CCC1D2]">.</span>
            </h2>
          </div>
          <p class="text-[#656565] text-sm mb-6">
            Платформа для поиска и сотрудничества с профессиональными фрилансерами. Находите лучших специалистов для ваших проектов или предлагайте свои услуги.
          </p>
          <div class="flex items-center gap-3">
            <a 
              href="#" 
              class="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0F7FF] text-[#0A65CC] hover:bg-[#0A65CC] hover:text-white transition-colors duration-200"
              aria-label="Telegram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3L11 14M22 3L15 22L11 14M22 3L2 10L11 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a 
              href="#" 
              class="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0F7FF] text-[#0A65CC] hover:bg-[#0A65CC] hover:text-white transition-colors duration-200"
              aria-label="VK"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12C2 6.48 6.47 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.47 22 2 17.52 2 12ZM11.99 9.74C12.97 9.74 13.87 9.8 14.68 9.95C15.1 10.04 15.32 10.24 15.36 10.67C15.39 10.92 15.34 11.28 15.13 11.32C14.94 11.35 14.67 11.21 14.49 11.18C13.94 11.08 13.44 11.03 12.95 11.03C12.42 11.03 11.95 11.14 11.97 11.73C11.97 12.26 12.45 12.53 12.88 12.77C13.85 13.29 15.14 13.7 15.14 15.19C15.14 16.43 13.96 17.12 12.86 17.28C11.77 17.44 10.64 17.24 9.61 16.92C9.11 16.77 8.84 16.5 8.84 15.95C8.84 15.75 8.87 15.54 8.94 15.35C9.07 15 9.36 15.07 9.7 15.15C10.71 15.39 11.75 15.55 12.77 15.34C13.27 15.24 13.63 14.91 13.58 14.38C13.53 13.91 13.11 13.61 12.71 13.39C12.35 13.18 11.97 13.03 11.61 12.83C10.87 12.46 10.19 11.96 10.19 11.05C10.19 9.79 11.3 9.74 11.99 9.74Z" fill="currentColor"/>
              </svg>
            </a>
            <a 
              href="#" 
              class="flex items-center justify-center w-9 h-9 rounded-full bg-[#F0F7FF] text-[#0A65CC] hover:bg-[#0A65CC] hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 2.5H8C4.96243 2.5 2.5 4.96243 2.5 8V16C2.5 19.0376 4.96243 21.5 8 21.5H16C19.0376 21.5 21.5 19.0376 21.5 16V8C21.5 4.96243 19.0376 2.5 16 2.5Z" stroke="currentColor" stroke-width="2"/>
                <path d="M17.5 7C18.0523 7 18.5 6.55228 18.5 6C18.5 5.44772 18.0523 5 17.5 5C16.9477 5 16.5 5.44772 16.5 6C16.5 6.55228 16.9477 7 17.5 7Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Колонка с навигацией -->
        <div>
          <h3 class="font-semibold text-[#222222] mb-4">Навигация</h3>
          <ul class="space-y-3">
            <li>
              <a href="/" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <span class="w-4 h-4 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                Главная
              </a>
            </li>
            <li>
              <a href="/specialists" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <User class="w-4 h-4" />
                Специалисты
              </a>
            </li>
            <li>
              <a href="/how-it-works" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <HelpCircle class="w-4 h-4" />
                Как это работает
              </a>
            </li>
            <li>
              <a href="/guarantees" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <Shield class="w-4 h-4" />
                Гарантии и FAQ
              </a>
            </li>
            <li>
              <a href="/rules" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <BookOpen class="w-4 h-4" />
                Правила
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Колонка с личным кабинетом -->
        <div>
          <h3 class="font-semibold text-[#222222] mb-4">Личный кабинет</h3>
          <ul class="space-y-3">
            <li>
              <a href="/profile" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <User class="w-4 h-4" />
                Профиль
              </a>
            </li>
            <li>
              <a href="/messages" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <MessageSquare class="w-4 h-4" />
                Сообщения
              </a>
            </li>
            <li>
              <a href="/finances" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <CreditCard class="w-4 h-4" />
                Финансы
              </a>
            </li>
            <li>
              <a href="/settings" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Настройки
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Колонка с контактами -->
        <div>
          <h3 class="font-semibold text-[#222222] mb-4">Контакты</h3>
          <ul class="space-y-3">
            <li>
              <a href="mailto:minzatov.i.21@gmail.com" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <Mail class="w-4 h-4" />
                minzatov.e.i.21@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+79788907832" class="flex items-center gap-2 text-[#656565] hover:text-[#0A65CC] transition-colors text-sm">
                <Phone class="w-4 h-4" />
                +7 978 890 7832
              </a>
            </li>
            <li>
              <div class="flex items-start gap-2 text-[#656565] text-sm">
                <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Симферополь, ул. Минзатова, д. 12, офис 36</span>
              </div>
            </li>
          </ul>
          
          <div class="mt-6">
            <h4 class="font-medium text-[#222222] text-sm mb-3">Подписаться на новости</h4>
            <div class="flex">
              <input 
                type="email" 
                placeholder="Ваш email" 
                class="flex-1 px-3 py-2 text-sm border border-r-0 border-[#E5E9F2] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#0A65CC] focus:border-[#0A65CC]"
              />
              <button class="px-3 py-2 bg-[#0A65CC] text-white text-sm rounded-r-md hover:bg-[#085BBA] transition-colors">
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Нижняя часть футера -->
    <div class="border-t border-[#E5E9F2] bg-white">
      <div class="w-full max-w-7xl mx-auto px-4 py-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p class="text-sm text-[#656565]">© 2025 Delph. Все права защищены.</p>
            <div class="flex items-center gap-4">
              <a href="#" class="text-sm text-[#656565] hover:text-[#0A65CC] transition-colors">Политика конфиденциальности</a>
              <a href="#" class="text-sm text-[#656565] hover:text-[#0A65CC] transition-colors">Политика cookie</a>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <span class="text-xs text-[#656565]">Способы оплаты:</span>
            <div class="flex items-center gap-2">
              <div class="w-8 h-5 bg-[#F0F7FF] rounded flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 10H22" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="w-8 h-5 bg-[#F0F7FF] rounded flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12H16" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 8V16" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="w-8 h-5 bg-[#F0F7FF] rounded flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 7H7.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@media (max-width: 640px) {
  .grid {
    gap: 2rem;
  }
}
</style>
