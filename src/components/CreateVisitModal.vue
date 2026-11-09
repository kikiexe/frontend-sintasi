<template>
  <q-dialog
    :model-value="modelValue"
    backdrop-filter="none"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="popup-box">
      <button
        type="button"
        class="popup-close-btn"
        aria-label="Close"
        @click="closeModal"
      >
        X
      </button>

      <div class="popup-title">BUAT KUNJUNGAN</div>

      <form @submit.prevent="submitVisit" class="popup-form">
        <div class="section-heading">Cari Pasien</div>
        <input
          v-model="medicalRecordNumber"
          type="text"
          placeholder="No Rekam Medik"
          class="popup-input-search-white"
          required
          @input="handleMrnInput"
          @change="lookupPatient"
        />

        <hr class="popup-divider" />

        <div class="section-heading">Data Pasien</div>

        <div class="popup-row-2col">
          <input
            v-model="patientData.name"
            type="text"
            placeholder="Nama Pasien"
            class="popup-input-gray"
            readonly
          />
          <input
            v-model="patientData.nik"
            type="text"
            placeholder="NIK"
            class="popup-input-gray"
            readonly
          />
        </div>

        <textarea
          v-model="patientData.address"
          placeholder="Alamat"
          class="popup-textarea-gray"
          readonly
        ></textarea>

        <div class="flex flex-center popup-submit-wrap">
          <button
            type="submit"
            class="btn-popup-primary"
            :disabled="submitting || !patientData.id"
          >
            {{ submitting ? 'MEMPROSES...' : 'BUAT KUNJUNGAN' }}
          </button>
        </div>
      </form>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  patients: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])
const $q = useQuasar()

const medicalRecordNumber = ref('')
const submitting = ref(false)
let lookupTimer = null

const patientData = ref({
  id: null,
  name: '',
  nik: '',
  address: ''
})

// Bersihkan state pencarian setiap kali modal dibuka atau ditutup.
watch(
  () => props.modelValue,
  () => {
    resetForm()
  }
)

function resetForm() {
  if (lookupTimer) {
    clearTimeout(lookupTimer)
    lookupTimer = null
  }
  medicalRecordNumber.value = ''
  patientData.value = { id: null, name: '', nik: '', address: '' }
}

function closeModal() {
  resetForm()
  emit('update:modelValue', false)
}

function handleMrnInput() {
  if (lookupTimer) clearTimeout(lookupTimer)
  medicalRecordNumber.value = (medicalRecordNumber.value || '').toUpperCase()
  const rm = medicalRecordNumber.value.trim()

  if (!rm || rm.length < 3) {
    patientData.value = { id: null, name: '', nik: '', address: '' }
    return
  }

  // Pencarian cepat di daftar lokal sebelum memanggil API.
  const localMatch = props.patients.find(
    (p) => p.medical_record_number.toUpperCase() === rm
  )
  if (localMatch) {
    patientData.value = {
      id: localMatch.id,
      name: localMatch.name,
      nik: localMatch.nik,
      address: localMatch.address
    }
    return
  }

  lookupTimer = setTimeout(() => {
    lookupPatient()
  }, 350)
}

async function lookupPatient() {
  const rm = medicalRecordNumber.value?.trim()
  if (!rm) {
    patientData.value = { id: null, name: '', nik: '', address: '' }
    return
  }

  try {
    const res = await api.get(`/patients/${encodeURIComponent(rm.toUpperCase())}`)
    if (res.data?.status === 'success') {
      const data = res.data.data
      patientData.value = {
        id: data.id,
        name: data.name,
        nik: data.nik,
        address: data.address
      }
    }
  } catch (err) {
    patientData.value = { id: null, name: '', nik: '', address: '' }
  }
}

async function submitVisit() {
  if (!patientData.value.id) {
    $q.notify({ type: 'warning', message: 'Masukkan No Rekam Medik pasien yang terdaftar terlebih dahulu.' })
    return
  }

  submitting.value = true
  try {
    const res = await api.post('/visits', {
      medical_record_number: medicalRecordNumber.value.trim().toUpperCase()
    })
    if (res.data?.status === 'success') {
      $q.notify({ type: 'positive', message: 'Kunjungan pasien berhasil dibuat!' })
      closeModal()
      emit('saved')
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Gagal menyimpan kunjungan'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.popup-box {
  width: min(462px, 92vw);
  min-height: clamp(380px, 56dvh, 1180px);
  max-height: 90dvh;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: clamp(22px, 2vmin, 48px);
  box-sizing: border-box;
  padding: clamp(32px, 3.2vmin, 76px) clamp(24px, 2.4vmin, 58px) clamp(28px, 2.8vmin, 66px);
  position: relative;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.28);
}

.popup-close-btn {
  position: absolute;
  top: clamp(8px, 0.9vmin, 22px);
  right: clamp(12px, 1.2vmin, 28px);
  min-width: clamp(36px, 3.4vmin, 80px);
  min-height: clamp(36px, 3.4vmin, 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: clamp(18px, 1.7vmin, 42px);
  font-weight: 400;
  color: #333333;
  cursor: pointer;
  line-height: 1;
  padding: 4px 6px;
}

.popup-title {
  text-align: center;
  font-size: clamp(20px, 1.9vmin, 46px);
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.3px;
  margin-bottom: clamp(20px, 3.2vmin, 76px);
}

.popup-form {
  display: flex;
  flex-direction: column;
}

.section-heading {
  font-size: clamp(14px, 1.35vmin, 32px);
  font-weight: 700;
  color: #000000;
  margin-bottom: clamp(7px, 0.7vmin, 16px);
}

.popup-input-search-white {
  width: 100%;
  height: clamp(29px, 2.8vmin, 68px);
  background-color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: clamp(5px, 0.5vmin, 12px);
  padding: 0 clamp(10px, 1vmin, 24px);
  font-size: clamp(12px, 1.15vmin, 28px);
  color: #000000;
  box-sizing: border-box;
  outline: none;
}

.popup-input-search-white::placeholder {
  color: #574454;
}

.popup-divider {
  width: 100%;
  border: none;
  border-top: 1.5px solid #000000;
  margin: clamp(16px, 1.6vmin, 38px) 0 clamp(12px, 1.2vmin, 28px) 0;
}

.popup-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(14px, 1.3vmin, 32px);
  width: 100%;
}

.popup-input-gray {
  width: 100%;
  height: clamp(29px, 2.8vmin, 68px);
  background-color: #d9d9d9;
  border: none;
  border-radius: clamp(5px, 0.5vmin, 12px);
  padding: 0 clamp(10px, 1vmin, 24px);
  font-size: clamp(12px, 1.15vmin, 28px);
  color: #574454;
  box-sizing: border-box;
  outline: none;
}

.popup-input-gray::placeholder {
  color: #574454;
}

.popup-textarea-gray {
  width: 100%;
  height: clamp(84px, 8vmin, 195px);
  background-color: #d9d9d9;
  border: none;
  border-radius: clamp(5px, 0.5vmin, 12px);
  padding: clamp(7px, 0.7vmin, 18px) clamp(10px, 1vmin, 24px);
  font-size: clamp(12px, 1.15vmin, 28px);
  color: #574454;
  box-sizing: border-box;
  resize: none;
  outline: none;
  font-family: inherit;
  margin-top: clamp(14px, 1.5vmin, 36px);
}

.popup-textarea-gray::placeholder {
  color: #574454;
}

.popup-submit-wrap {
  margin-top: clamp(20px, 2.2vmin, 52px);
}

.btn-popup-primary {
  width: clamp(182px, 17vmin, 420px);
  height: clamp(31px, 3vmin, 74px);
  background-color: #0461cd;
  color: #ffffff;
  border: none;
  border-radius: clamp(7px, 0.7vmin, 16px);
  font-size: clamp(11px, 1.1vmin, 26px);
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

@media (min-width: 1400px) {
  .popup-box {
    width: 38vw;
    max-width: none;
  }
}

.btn-popup-primary:hover {
  opacity: 0.92;
}

.btn-popup-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 520px) {
  .popup-box {
    width: 94vw;
    min-height: auto;
    border-radius: 18px;
    padding: 28px 18px 24px 18px;
  }

  .popup-title {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .popup-row-2col {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .popup-input-search-white,
  .popup-input-gray {
    height: 40px;
    font-size: 14px;
  }

  .popup-textarea-gray {
    height: 90px;
    font-size: 14px;
    margin-top: 12px;
  }

  .popup-submit-wrap {
    margin-top: 20px;
  }

  .btn-popup-primary {
    width: 100%;
    height: 42px;
    font-size: 13px;
  }
}
</style>
