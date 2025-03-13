import { reactive, computed } from "vue";

const state = reactive({
  isAuthenticated: false,
  username: "",
});

export const useAuthStore = () => {
  const login = (userData) => {
    state.isAuthenticated = true;
    state.username = userData.fullName || userData.email || "Пользователь";

    // ✅ Сохраняем имя пользователя в локальное хранилище
    localStorage.setItem("token", userData.token);
    localStorage.setItem("username", state.username);
  };

  const logout = () => {
    state.isAuthenticated = false;
    state.username = "";
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username"); // Получаем сохраненное имя

    state.isAuthenticated = !!token;
    state.username = storedUsername || ""; // Используем сохраненное имя
  };

  return {
    isAuthenticated: computed(() => state.isAuthenticated),
    username: computed(() => state.username),
    login,
    logout,
    checkAuth,
  };
};
