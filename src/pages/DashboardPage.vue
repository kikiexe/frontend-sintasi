<template>
  <div class="fullscreen sintasi-bg flex flex-center q-pa-md">
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
.sintasi-bg {
  background-color: #0461cd;
  min-height: 100vh;
}

.ui2-modal-card {
  width: 850px;
  max-width: 96vw;
  height: 820px;
  max-height: 92vh;
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
  margin-bottom: 68px;
}

.ui2-logo-container {
  height: 68px;
}

.ui2-logo {
  max-width: 205px;
  max-height: 68px;
  object-fit: contain;
}

.ui2-logout-btn {
  position: absolute;
  right: 24px;
  top: 6px;
  background: transparent;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 12px;
  color: #574454;
  padding: 5px 12px;
  cursor: pointer;
}

.ui2-logout-btn:hover {
  background-color: #f2f2f2;
}

.ui2-actions-row {
  padding: 0 16px;
  gap: 6px;
  margin-bottom: 18px;
}

.ui2-action-btn {
  width: 196px;
  height: 40px;
  border-radius: 20px;
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  padding: 0;
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
</style>
