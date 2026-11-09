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
  margin-bottom: clamp(24px, 4.2vmin, 100px);
}

.popup-form {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 1.2vmin, 28px);
}

.rm-readonly-box {
  width: 100%;
  height: clamp(30px, 2.9vmin, 70px);
  background-color: #d9d9d9;
  border-radius: clamp(5px, 0.5vmin, 12px);
  display: flex;
  align-items: center;
  padding: 0 clamp(11px, 1.1vmin, 26px);
  box-sizing: border-box;
}

.rm-readonly-text {
  font-size: clamp(12px, 1.15vmin, 28px);
  color: #574454;
  text-decoration: underline;
}

.popup-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(14px, 1.3vmin, 32px);
  width: 100%;
}

.popup-input-white {
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

.popup-input-white::placeholder {
  color: #574454;
}

.popup-textarea-white {
  width: 100%;
  height: clamp(84px, 8vmin, 195px);
  background-color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: clamp(5px, 0.5vmin, 12px);
  padding: clamp(7px, 0.7vmin, 18px) clamp(10px, 1vmin, 24px);
  font-size: clamp(12px, 1.15vmin, 28px);
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
  margin-top: clamp(24px, 2.6vmin, 64px);
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
    margin-bottom: 22px;
  }

  .popup-row-2col {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .rm-readonly-box,
  .popup-input-white {
    height: 40px;
    font-size: 14px;
  }

  .rm-readonly-text {
    font-size: 13px;
  }

  .popup-textarea-white {
    height: 90px;
    font-size: 14px;
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
