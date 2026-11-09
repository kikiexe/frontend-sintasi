<template>
  <div class="sintasi-page sintasi-bg flex flex-center">
    <div class="ui2-modal-card flex column">
      <div class="ui2-header">
        <div class="ui2-logo-container flex flex-center">
          <img
            :src="logoUrl"
            alt="Medisin"
            class="ui2-logo"
          />
        </div>
        <button
          type="button"
          class="ui2-logout-btn"
          title="Logout"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>

      <div class="ui2-actions-row row items-center">
        <button
          type="button"
          class="ui2-action-btn btn-blue"
          @click="showAddPatientModal = true"
        >
          TAMBAH PASIEN
        </button>
        <button
          type="button"
          class="ui2-action-btn btn-green"
          @click="showCreateVisitModal = true"
        >
          BUAT KUNJUNGAN
        </button>
      </div>

      <PatientTable
        :patients="patients"
        :loading="loading"
      />
    </div>

    <AddPatientModal
      v-model="showAddPatientModal"
      @saved="fetchPatients"
    />

    <CreateVisitModal
      v-model="showCreateVisitModal"
      :patients="patients"
      @saved="fetchPatients"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'
import logoUrl from '../assets/medisin-logo.png'
import PatientTable from '../components/PatientTable.vue'
import AddPatientModal from '../components/AddPatientModal.vue'
import CreateVisitModal from '../components/CreateVisitModal.vue'

const $q = useQuasar()
const router = useRouter()

const patients = ref([])
const loading = ref(false)

const showAddPatientModal = ref(false)
const showCreateVisitModal = ref(false)

onMounted(() => {
  fetchPatients()
})

async function fetchPatients() {
  loading.value = true
  try {
    const res = await api.get('/patients', { params: { per_page: 50 } })
    if (res.data?.status === 'success') {
      patients.value = res.data.data?.data || []
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Gagal memuat data pasien' })
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  try {
    await api.post('/logout')
  } catch (e) {
    // Abaikan kegagalan jaringan saat logout agar sesi lokal tetap dibersihkan.
  } finally {
    localStorage.removeItem('sintasi_token')
    localStorage.removeItem('sintasi_user')
    router.push('/login')
  }
}
</script>

<style scoped>
.sintasi-page {
  background-color: #0461cd;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  padding: clamp(12px, 3vw, 24px);
  box-sizing: border-box;
  overflow-y: auto;
}

.ui2-modal-card {
  width: min(850px, 94vw);
  height: clamp(580px, 86dvh, 820px);
  background-color: #ffffff;
  border-radius: 22px;
  box-sizing: border-box;
  padding: 40px 0 32px 0;
  position: relative;
  overflow: hidden;
}

.ui2-header {
  position: relative;
  padding: 0 24px;
  margin-bottom: clamp(28px, 5.5vh, 68px);
}

.ui2-logo-container {
  height: clamp(64px, 6.2vmin, 180px);
}

.ui2-logo {
  max-width: clamp(200px, 18vmin, 520px);
  max-height: clamp(64px, 6.2vmin, 180px);
  object-fit: contain;
}

.ui2-logout-btn {
  position: absolute;
  right: clamp(20px, 2vmin, 56px);
  top: clamp(6px, 0.6vmin, 18px);
  background: transparent;
  border: 1px solid #d9d9d9;
  border-radius: clamp(8px, 0.7vmin, 18px);
  font-size: clamp(12px, 1.1vmin, 28px);
  color: #574454;
  min-height: clamp(34px, 3.2vmin, 80px);
  padding: clamp(5px, 0.5vmin, 14px) clamp(12px, 1.2vmin, 32px);
  cursor: pointer;
}

.ui2-logout-btn:hover {
  background-color: #f2f2f2;
}

.ui2-actions-row {
  padding: 0 clamp(16px, 1.5vmin, 42px);
  gap: clamp(8px, 0.8vmin, 22px);
  margin-bottom: clamp(16px, 1.8vmin, 42px);
  flex-wrap: wrap;
}

.ui2-action-btn {
  width: clamp(190px, 18vmin, 480px);
  height: clamp(40px, 3.8vmin, 96px);
  border-radius: 999px;
  color: #ffffff;
  border: none;
  font-size: clamp(13px, 1.25vmin, 32px);
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.btn-blue {
  background-color: #0461cd;
}

.btn-green {
  background-color: #45cd04;
}

.ui2-action-btn:hover {
  opacity: 0.9;
}

@media (min-width: 1400px) {
  .ui2-modal-card {
    width: 74vw;
    max-width: none;
    height: 84dvh;
    max-height: none;
    border-radius: 2vmin;
    padding: 3.6vmin 0 3vmin 0;
  }
}

@media (max-width: 900px) {
  .ui2-modal-card {
    height: clamp(540px, 90dvh, 780px);
    padding: 28px 0 24px 0;
  }

  .ui2-header {
    margin-bottom: 32px;
  }
}

@media (max-width: 600px) {
  .sintasi-page {
    padding: 12px;
    align-items: flex-start;
  }

  .ui2-modal-card {
    height: auto;
    min-height: calc(100dvh - 24px);
    border-radius: 18px;
    padding: 20px 0 24px 0;
  }

  .ui2-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    margin-bottom: 24px;
  }

  .ui2-logo-container {
    height: 48px;
  }

  .ui2-logo {
    max-width: 145px;
    max-height: 48px;
  }

  .ui2-logout-btn {
    position: static;
    min-height: 40px;
    padding: 6px 14px;
    font-size: 13px;
  }

  .ui2-actions-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 0 14px;
    margin-bottom: 16px;
  }

  .ui2-action-btn {
    width: 100%;
    height: 44px;
    font-size: 13px;
  }
}

@media (max-width: 360px) {
  .ui2-actions-row {
    grid-template-columns: 1fr;
  }
}
</style>
