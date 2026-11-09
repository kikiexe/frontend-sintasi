<template>
  <div class="ui2-table-wrapper">
    <table class="ui2-table">
      <thead>
        <tr>
          <th style="width: 7%;">NO</th>
          <th style="width: 19%;">NO REKAM MEDIK</th>
          <th style="width: 20%;">NAMA PASIEN</th>
          <th style="width: 19%;">NIK</th>
          <th style="width: 20%;">ALAMAT</th>
          <th style="width: 15%; white-space: nowrap;">JML KUNJUNGAN</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="6" class="text-center text-grey-7 q-pa-md">Memuat data...</td>
        </tr>
        <tr v-else-if="patients.length === 0">
          <td colspan="6" class="text-center text-grey-7 q-pa-md">Belum ada data pasien.</td>
        </tr>
        <tr v-else v-for="(p, index) in patients" :key="p.id">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-center">{{ p.medical_record_number }}</td>
          <td class="text-center">{{ p.name }}</td>
          <td class="text-center">{{ p.nik }}</td>
          <td class="text-center">{{ p.address }}</td>
          <td class="text-center">{{ p.visit_count ?? 0 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  patients: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
/* Tabel menempel penuh dari tepi kiri ke kanan card sesuai referensi Figma. */
.ui2-table-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

.ui2-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  color: #000000;
  table-layout: fixed;
}

.ui2-table th {
  background-color: #d9d9d9;
  border: 1.5px solid #8b8b8b;
  padding: 8px 4px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
}

.ui2-table td {
  border: 1.5px solid #8b8b8b;
  padding: 6px 6px;
  background-color: #ffffff;
  line-height: 1.3;
  word-break: break-word;
}
</style>
