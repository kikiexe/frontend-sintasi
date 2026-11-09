<template>
  <div class="fullscreen sintasi-bg flex flex-center q-pa-md">
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
.sintasi-bg {
  background-color: #0461cd;
  min-height: 100vh;
}

.ui1-modal-card {
  width: 550px;
  max-width: 94vw;
  min-height: 360px;
  background-color: #ffffff;
  border-radius: 22px;
  box-sizing: border-box;
  padding: 26px 32px 34px 32px;
}

.ui1-logo-container {
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 34px;
}

.ui1-logo {
  max-width: 210px;
  max-height: 68px;
  object-fit: contain;
}

.ui1-form {
  width: 100%;
  gap: 18px;
}

.ui1-input {
  width: 492px;
  max-width: 100%;
  height: 48px;
  background-color: #d9d9d9;
  border-radius: 24px;
  border: none;
  box-sizing: border-box;
  padding: 0 28px;
  font-size: 16px;
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
  width: 376px;
  max-width: 85%;
  height: 48px;
  background-color: #0461cd;
  color: #ffffff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
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
</style>
