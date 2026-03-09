<template>
    <div class="w-full h-full">
        <div class="w-full h-14 flex items-center gap-4 bg-[#00345b] text-white text-xl px-4 content-center">
<!--            <el-icon size="24" class="cursor-pointer"><Expand /></el-icon>-->
            <p class="text-2xl">Adabiygid</p>
        </div>
        <div v-loading="loading" class="h-full w-full py-6 px-40 flex flex-col justify-between gap-4">
            <el-button @click="openNewsDialog" type="primary" :icon="Plus" class="w-28">Qo'shish</el-button>
            <div v-for="(item, idx) in newsData"
                 class="h-full w-full flex justify-between items-center border border-slate-300 shadow-md p-3 rounded text-lg hover:!shadow-lg transition-all">
                <p>{{ idx + 1 }}) {{ item.title }}</p>
                <div class="w2 flex items-center">
                    <el-button type="primary">
                        <el-icon class="font-bold"><Edit /></el-icon>
                    </el-button>
                    <el-button type="danger">
                        <el-icon class="font-bold"><Delete /></el-icon>
                    </el-button>
                </div>
            </div>
        </div>
        <NewsDialog ref="dialog"/>
    </div>
</template>

<script setup>
import {Delete, Edit, Expand, Plus} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import NewsDialog from "@/views/dashboard/NewsDialog.vue";


const newsData = ref([])
const loading = ref(false);
const dialog = ref(null);

const openNewsDialog = () => {
    dialog.value.open()
}

onMounted(async () => {
    loading.value = true;
    const res = await axios.get('https://api.adabiygid.uz/api/news')
    newsData.value = res.data

    loading.value = false
})

</script>

<style scoped>
.shadow-md {
    --tw-shadow: 0 0 6px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1)),
    0 0 4px -2px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}

.shadow-lg {
    --tw-shadow: 0 0 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)),
    0 0 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
</style>
