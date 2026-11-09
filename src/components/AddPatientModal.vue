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

      <div class="popup-title">TAMBAH PASIEN</div>

      <form @submit.prevent="submitPatient" class="popup-form">
        <div class="rm-readonly-box">
          <span class="rm-readonly-text">No. Rekam Medik</span>
        </div>

        <div class="popup-row-2col">
          <input
            v-model="form.name"
            type="text"
            placeholder="Nama Pasien"
            class="popup-input-white"
            required
          />
          <input
            v-model="form.nik"
            type="text"
            inputmode="numeric"
            maxlength="16"
            placeholder="NIK"
            class="popup-input-white"
            required
          />
        </div>

        <textarea
          v-model="form.address"
          placeholder="Alamat"
          class="popup-textarea-white"
          required
        ></textarea>

        <div class="flex flex-center popup-submit-wrap">
          <button
            type="submit"
            class="btn-popup-primary"
            :disabled="submitting"
          >
            {{ submitting ? 'MENYIMPAN...' : 'SIMPAN' }}
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
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])
const $q = useQuasar()

const submitting = ref(false)
const form = ref({
  name: '',
  nik: '',
  address: ''
})

// Reset input form setiap kali modal dibuka.
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      form.value = { name: '', nik: '', address: '' }
    }
  }
)

function closeModal() {
  emit('update:modelValue', false)
}

async function submitPatient() {
  const name = form.value.name.trim()
  const nik = form.value.nik.trim()
  const address = form.value.address.trim()

  if (name.length < 3) {
    $q.notify({ type: 'negative', message: 'Nama Pasien minimal 3 karakter.' })
    return
  }

  if (!/^\d{16}$/.test(nik)) {
    $q.notify({ type: 'negative', message: 'NIK wajib berisi tepat 16 digit angka.' })
    return
  }

  if (address.length < 5) {
    $q.notify({ type: 'negative', message: 'Alamat minimal 5 karakter.' })
    return
  }

  submitting.value = true
  try {
    const res = await api.post('/patients', { name, nik, address })

    if (res.data?.status === 'success') {
      $q.notify({
        type: 'positive',
        message: `Pasien berhasil ditambahkan (${res.data.data.medical_record_number})`
      })
      closeModal()
      emit('saved')
    }
  } catch (err) {
    const firstValidationErr = err.response?.data?.errors
      ? Object.values(err.response.data.errors).flat()[0]
      : null
    const msg = firstValidationErr || err.response?.data?.message || 'Gagal menyimpan pasien'
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
  margin-bottom: 46px;
}

.popup-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rm-readonly-box {
  width: 100%;
  height: 30px;
  background-color: #d9d9d9;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 11px;
  box-sizing: border-box;
}

.rm-readonly-text {
  font-size: 12px;
  color: #574454;
  text-decoration: underline;
}

.popup-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
}

.popup-input-white {
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

.popup-input-white::placeholder {
  color: #574454;
}

.popup-textarea-white {
  width: 100%;
  height: 84px;
  background-color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: 5px;
  padding: 7px 10px;
  font-size: 12px;
  color: #000000;
  box-sizing: border-box;
  resize: none;
  outline: none;
  font-family: inherit;
}

.popup-textarea-white::placeholder {
  color: #574454;
}

.popup-submit-wrap {
  margin-top: 28px;
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
