<template>
  <div class="sintasi-page sintasi-bg flex flex-center">
    <div class="ui1-modal-card flex column items-center">
      <div class="ui1-logo-container">
        <img
          :src="logoUrl"
          alt="Medisin"
          class="ui1-logo"
        />
      </div>

      <form @submit.prevent="handleLogin" class="ui1-form flex column items-center">
        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          class="ui1-input"
          autocomplete="username"
          required
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="ui1-input"
          autocomplete="current-password"
          required
        />

        <button
          type="submit"
          class="ui1-btn-login"
          :disabled="loading"
        >
          {{ loading ? 'LOADING...' : 'LOGIN' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'
import { encryptPayload } from '../boot/crypto'
import logoUrl from '../assets/medisin-logo.png'

const $q = useQuasar()
const router = useRouter()

const form = ref({
  username: 'admin@sintasi.com',
  password: 'password123'
})

const loading = ref(false)

async function handleLogin() {
  if (!form.value.username?.trim() || !form.value.password) {
    $q.notify({
      type: 'negative',
      message: 'Username dan Password wajib diisi.'
    })
    return
  }

  loading.value = true
  try {
    const encryptedUsername = encryptPayload(form.value.username.trim())
    const encryptedPassword = encryptPayload(form.value.password)

    const response = await api.post('/login', {
      username: encryptedUsername,
      password: encryptedPassword
    })

    if (response.data?.status === 'success') {
      const { token, user } = response.data.data
      localStorage.setItem('sintasi_token', token)
      localStorage.setItem('sintasi_user', JSON.stringify(user))

      $q.notify({
        type: 'positive',
        message: 'Login berhasil!'
      })

      router.push('/dashboard')
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Login gagal. Periksa username dan password Anda'
    $q.notify({
      type: 'negative',
      message: errorMsg
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.sintasi-page {
  background-color: #0461cd;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  padding: clamp(16px, 4vw, 32px);
  box-sizing: border-box;
  overflow-y: auto;
}

.ui1-modal-card {
  width: min(550px, 94vw);
  min-height: clamp(350px, 38dvh, 960px);
  background-color: #ffffff;
  border-radius: clamp(22px, 2vmin, 48px);
  box-sizing: border-box;
  padding: clamp(26px, 3vmin, 72px) clamp(28px, 3.4vmin, 84px) clamp(32px, 3.6vmin, 88px);
  justify-content: center;
}

.ui1-logo-container {
  height: clamp(72px, 7vmin, 190px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(28px, 3.2vmin, 80px);
}

.ui1-logo {
  max-width: clamp(205px, 19vmin, 520px);
  max-height: clamp(66px, 6.4vmin, 175px);
  object-fit: contain;
}

.ui1-form {
  width: 100%;
  gap: clamp(16px, 1.8vmin, 44px);
}

.ui1-input {
  width: 100%;
  height: clamp(46px, 4.6vmin, 114px);
  background-color: #d9d9d9;
  border-radius: 999px;
  border: none;
  box-sizing: border-box;
  padding: 0 clamp(24px, 2.5vmin, 64px);
  font-size: clamp(16px, 1.5vmin, 38px);
  color: #574454;
  outline: none;
}

.ui1-input::placeholder {
  color: #574454;
  opacity: 0.9;
}

.ui1-input:focus {
  box-shadow: 0 0 0 2px #0461cd;
}

.ui1-btn-login {
  width: 76%;
  height: clamp(46px, 4.6vmin, 114px);
  background-color: #0461cd;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-size: clamp(16px, 1.5vmin, 38px);
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s;
}

.ui1-btn-login:hover {
  opacity: 0.92;
}

.ui1-btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 1400px) {
  .ui1-modal-card {
    width: 44vw;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .ui1-modal-card {
    max-width: 480px;
    min-height: 330px;
    padding: 24px 24px 30px 24px;
  }

  .ui1-logo-container {
    height: 64px;
    margin-bottom: 24px;
  }

  .ui1-logo {
    max-width: 185px;
    max-height: 58px;
  }
}

@media (max-width: 480px) {
  .ui1-modal-card {
    min-height: auto;
    border-radius: 18px;
    padding: 22px 18px 26px 18px;
  }

  .ui1-logo-container {
    height: 56px;
    margin-bottom: 20px;
  }

  .ui1-logo {
    max-width: 165px;
    max-height: 52px;
  }

  .ui1-form {
    gap: 14px;
  }

  .ui1-input {
    height: 46px;
    padding: 0 20px;
    font-size: 16px;
  }

  .ui1-btn-login {
    width: 100%;
    max-width: 100%;
    height: 46px;
  }
}
</style>
