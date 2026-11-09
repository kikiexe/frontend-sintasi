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
  width: 462px;
  max-width: 92vw;
  min-height: 520px;
  background-color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: 22px;
  box-sizing: border-box;
  padding: 36px 26px 32px 26px;
  position: relative;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.28);
}

.popup-close-btn {
  position: absolute;
  top: 10px;
  right: 16px;
  background: none;
  border: none;
  font-size: 18px;
  font-weight: 400;
  color: #333333;
  cursor: pointer;
  line-height: 1;
  padding: 4px 6px;
}

.popup-title {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.3px;
  margin-bottom: 34px;
}

.popup-form {
  display: flex;
  flex-direction: column;
}

.section-heading {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 7px;
}

.popup-input-search-white {
  width: 100%;
  height: 29px;
  background-color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 12px;
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
  margin: 18px 0 12px 0;
}

.popup-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
}

.popup-input-gray {
  width: 100%;
  height: 29px;
  background-color: #d9d9d9;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 12px;
  color: #574454;
  box-sizing: border-box;
  outline: none;
}

.popup-input-gray::placeholder {
  color: #574454;
}

.popup-textarea-gray {
  width: 100%;
  height: 84px;
  background-color: #d9d9d9;
  border: none;
  border-radius: 5px;
  padding: 7px 10px;
  font-size: 12px;
  color: #574454;
  box-sizing: border-box;
  resize: none;
  outline: none;
  font-family: inherit;
  margin-top: 16px;
}

.popup-textarea-gray::placeholder {
  color: #574454;
}

.popup-submit-wrap {
  margin-top: 20px;
}

.btn-popup-primary {
  width: 182px;
  height: 31px;
  background-color: #0461cd;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.btn-popup-primary:hover {
  opacity: 0.92;
}

.btn-popup-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
