<template>
    <div class="w-full h-full">
        <div class="w-full h-14 flex items-center justify-between gap-4 bg-[#00345b] text-white text-xl px-4 z-10">
<!--            <el-icon size="24" class="cursor-pointer"><Expand /></el-icon>-->
            <p class="text-2xl">Adabiygid</p>
            <el-button @click="logout" class="!font-semibold text-gray-800" :icon="Right">Chiqish</el-button>
        </div>
        <el-button @click="openNewsDialog(null)" type="primary" :icon="Plus" class="w-28 ml-40 mt-6">Qo'shish</el-button>
        <div v-loading="loading" class="w-full h-[calc(100vh-150px)] overflow-y-auto mt-4 py-2 px-40 flex flex-col justify-between gap-4">
            <div v-for="(item, idx) in newsData"
                 class="w-full flex justify-between items-center border border-slate-300 shadow-md p-3 rounded text-lg hover:!shadow-lg transition-all">
                <div class="flex gap-4 items-center">
                    <img :src="`https://api.adabiygid.uz${item.newsDetails[0].attachment.url}`" class="h-20 w-32" alt="">
                    <div class="flex flex-col justify-between">
                        <p class="font-semibold text-gray-700 text-2xl">{{ item.title }}</p>
                        <p class="w-[80%] text-ellipsis overflow-hidden font-medium text-gray-500 text-sm">{{ item.newsDetails[0].description }}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <el-tag class="w-24 mr-6 !text-sm">
                        <div class="flex gap-0.5">
                            <el-icon class="translate-y-[2.5px]"><Calendar /></el-icon>
                            <span>{{ moment(item.newsDetails[0].localDateTime).format('DD.MM.YYYY') }}</span>
                        </div>
                    </el-tag>
                    <el-button @click="openNewsDialog(item)" type="primary">
                        <el-icon class="font-bold"><Edit /></el-icon>
                    </el-button>
                    <el-popconfirm title="O'chirishni tasdiqlang" @confirm="removeItem(item, idx)" width="150" confirm-button-text="Ha" cancel-button-text="Yo'q">
                        <template #reference>
                            <el-button type="danger">
                                <el-icon class="font-bold"><Delete /></el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
        </div>
        <NewsDialog ref="dialog" @saved="getNewsData"/>
    </div>
</template>

<script setup>
import {Calendar, Delete, Edit, Expand, Plus, Right} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import NewsDialog from "@/views/dashboard/NewsDialog.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import store from "@/store/store.js";
import moment from "moment";
import router from "@/router/index.js";


const newsData = ref([])
const loading = ref(false);
const dialog = ref(null);

const openNewsDialog = (item) => {
    dialog.value.open(item)
}

const getNewsData = async () => {
    loading.value = true;
    const res = await axios.get('https://api.adabiygid.uz/api/news')
    newsData.value = res.data.sort((a, b) => new Date(b.newsDetails[0].localDateTime) - new Date(a.newsDetails[0].localDateTime))
    loading.value = false
}

const removeItem = (item, idx) => {
    axios.delete(`https://api.adabiygid.uz/api/news/${item.id}`, {
        headers: {
            Authorization: `Bearer ${store.state.token || localStorage.getItem("token")}`
        }
    }).then(() => {
        ElMessage.success('Muvaffaqiyatli o\'chirildi')
        newsData.value.splice(idx, 1)
    }).catch(() => {
        ElMessage.error('Xatolik yuz berdi!')
    })
}

const logout = () => {
    ElMessageBox.confirm(
        'Chindan ham chiqishni istaysizmi?',
        'Ogohlantiruv',
        {
            confirmButtonText: 'Ha',
            cancelButtonText: 'Yo\'q',
            type: 'warning',
        }
    ).then(() => {
        store.state.token = null
        localStorage.clear()
        router.push('/')
    })
}

onMounted(async () => {
   await getNewsData()
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

.el-button.el-button--primary {
    background-color: #00345b !important;
    border: #00345b !important;
}
</style>
