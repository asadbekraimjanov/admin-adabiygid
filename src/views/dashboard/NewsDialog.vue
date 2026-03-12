<template>
    <el-dialog v-model="visible" title="Yangilik qo'shish" width="70%" @close="close">
        <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
            <el-form-item label="Yangilik nomi" prop="title">
                <el-input v-model="formData.title" placeholder="Yangilik nomi"/>
            </el-form-item>
            <p>Rasm/video</p>
            <fieldset v-for="(item, idx) in formData.newsDetails"
                      class="border border-gray-300 rounded-md px-2 relative">

                <legend class="px-2 text-gray-700 font-semibold text-lg">
                    {{ idx + 1 }})
                </legend>
                <div class="absolute right-2 -top-8 px-1.5 bg-white">
                    <el-button circle :icon="Plus" type="primary" @click="onDetailAdded"
                               class="!bg-[#00345b] active:!bg-[#0163ACFF] !border-[#00345b] active:!border-[#0163ACFF]" />
                    <el-button @click="removeNewsDetail(idx)" circle :icon="Delete" type="danger" :disabled="formData.newsDetails.length < 2"></el-button>
                </div>
                <div class="w-full p-2 flex items-center justify-between">
                    <div class="w-[60%]">
                        <el-row :gutter="20">
                            <el-col :span="11">
                                <el-form-item :prop="'newsDetails.' + idx + '.orderDetail'" label="Tartibi" label-position="left">
                                    <el-input v-model="formData.newsDetails[idx].orderDetail" @change="onOrderDetailChange(idx)" type="number" placeholder="Tartibi" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="13">
                                <el-form-item :prop="'newsDetails.' + idx + '.localDateTime'" label="Sana va vaqt" label-position="left">
                                    <el-date-picker @change="localDateTimeChanged(idx)" v-model="formData.newsDetails[idx].localDateTime" placeholder="Sana va vaqtni kiriting"
                                                    value-format="YYYY-MM-DDTHH:mm:ss" type="datetime" class="!w-full" clearable></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item :prop="'newsDetails.' + idx + '.description'" label="Tavsif" label-position="left">
                            <el-input v-model="formData.newsDetails[idx].description" @change="onOrderDetailChange(idx)" type="textarea" :rows="7" placeholder="Batafsil..." clearable />
                        </el-form-item>
                    </div>
                    <div class="w-[40%] flex items-center justify-end">
                        <el-form-item :prop="'newsDetails.' + idx + '.attachmentId'">
                            <el-upload list-type="picture-card" :on-remove="(file) => handleRemove(file, idx)"  :before-upload="(file) => beforeUpload(file, idx)"
                                       :http-request="(options) => uploadFile(options, idx)" :file-list="item.fileList" :limit="1">
                                <el-icon><Plus /></el-icon>
                            </el-upload>
                        </el-form-item>
                    </div>
                </div>
            </fieldset>
        </el-form>

        <div class="w-full flex justify-end items-center mt-4">
            <el-button type="danger" @click="close">Bekor qilish</el-button>
            <el-button type="primary" @click="save" :loading="loadingUploadFile"
                       class="!bg-[#00345b] active:!bg-[#0163ACFF] !border-[#00345b] active:!border-[#0163ACFF]">Saqlash</el-button>
        </div>
    </el-dialog>
</template>

<script setup>
import {computed, ref} from "vue"
import {CloseBold, Delete, Plus} from "@element-plus/icons-vue";
import store from "@/store/store.js";
import axios from "axios";
import {ElMessage} from "element-plus";

const visible = ref(false)
const methodPut = ref(false)
const loadingUploadFile = ref(false)
const formRef = ref(null)
const formData = ref({
    title: '',
    newsDetails: [
        {
            localDateTime: null,
            orderDetail: 1,
            attachmentId: null,
            description: '',
            fileList: []
        }
    ]
})
const emit = defineEmits(['saved'])

const rules = {
    title: [
        { required: true, message: "Yangilik nomi kiritilishi shart", trigger: "blur" }
    ],

    "newsDetails.0.orderDetail": [
        { required: true, message: "Tartib raqami kiritilishi shart", trigger: "change" }
    ],

    "newsDetails.0.localDateTime": [
        { required: true, message: "Sana va vaqt kiritilishi shart", trigger: "change" }
    ],

    "newsDetails.0.description": [
        { required: true, message: "Tavsif kiritilishi shart", trigger: "change" }
    ],

    'newsDetails.0.attachmentId': [
        { required: true, message: "Rasm/video kiritilishi shart", trigger: "change" }
    ]
}

const open = (item) => {
    if (item) formData.value = item
    visible.value = true
}

const onDetailAdded = () => {
    formData.value.newsDetails.push({
        localDateTime: new Date().toISOString(),
        orderDetail: formData.value.newsDetails.length+1,
        attachmentId: null,
        description: '',
        fileList: []
    })
}

const localDateTimeChanged = (idx) => {
    if (formData.value.newsDetails[idx].localDateTime)
        formData.value.newsDetails[idx].localDateTime = new Date(formData.value.newsDetails[idx].localDateTime).toISOString()
}

const removeNewsDetail = (idx) => {
    formData.value.newsDetails.splice(idx, 1)
}

const beforeUpload = (file, idx) => {
    const item = formData.value.newsDetails[idx];

    if (item.fileList.length >= 1) {
        ElMessage.warning('Faqat 1 ta fayl yuklash mumkin!');
        return false;
    }
    return true;
};

const handleRemove = (file, idx) => {
    loadingUploadFile.value = true
    axios.delete(`https://api.adabiygid.uz/api/attachment/${formData.value.newsDetails[idx].attachmentId || formData.value.id}`, {
        headers: {
            Authorization: `Bearer ${store.state.token || localStorage.getItem("token")}`
        }
    }).then(() => {
        formData.value.newsDetails[idx].fileList = []
        formData.value.newsDetails[idx].attachmentId = null
        ElMessage.success('Muvaffaqiyatli o\'chirildi')
    }).catch(() => {ElMessage.error('Xatolik yuz berdi!')}).finally(() => {
        loadingUploadFile.value = false
    })

}

const uploadFile = async ({ file, onSuccess, onError }, idx) => {
    loadingUploadFile.value = true
    try {
        const form = new FormData();
        form.append('file', file);

        const res = await axios.post(
            "https://api.adabiygid.uz/api/attachment",
            form,
            {
                headers: {
                    Authorization: `Bearer ${store.state.token || localStorage.getItem("token")}`,
                }
            }
        );

        formData.value.newsDetails[idx].attachmentId = res.data.id;
        formData.value.newsDetails[idx].fileList = [{
            name: file.name,
            url: URL.createObjectURL(file)
        }];

        onSuccess(res.data, file);

    } catch (err) {
        onError(err, file);
    } finally {
        loadingUploadFile.value = false
    }
};

const save = async () => {
    loadingUploadFile.value = true
    await formRef.value.validate((valid) => {
        if (valid) {
            if (formData.value.id) {
                axios.put(`https://api.adabiygid.uz/api/news/${formData.value.id}`, {
                    title: formData.value.title,
                    newsDetails: formData.value.newsDetails.map(({fileList, ...rest}) => rest)
                }, {
                    headers: {
                        Authorization: `Bearer ${store.state.token || localStorage.getItem("token")}`
                    }
                }).then(() => {
                    ElMessage.success('Muvaffaqiyatli o\'zgartirildi')
                    emit('saved')
                }).catch(() => ElMessage.error('Xatolik yuz berdi!')).finally(() => {
                    loadingUploadFile.value = false
                    close()
                })
            } else {
                axios.post('https://api.adabiygid.uz/api/news', {
                    title: formData.value.title,
                    newsDetails: formData.value.newsDetails.map(({fileList, ...rest}) => rest)
                }, {
                    headers: {
                        Authorization: `Bearer ${store.state.token || localStorage.getItem("token")}`
                    }
                }).then(() => {
                    ElMessage.success('Muvaffaqiyatli qo\'shildi')
                    emit('saved')
                }).catch(() => ElMessage.error('Xatolik yuz berdi!')).finally(() => {
                    loadingUploadFile.value = false
                    close()
                })
            }
        } else {
            return false
        }
    })
}

const close = () => {
    formData.value = {
        title: '',
        newsDetails: [
            {
                localDateTime: null,
                orderDetail: 1,
                attachmentId: null,
                description: '',
                fileList: []
            }
        ]
    }
    visible.value = false
}

const onOrderDetailChange = (idx) => {
    if (formData.value.newsDetails[idx].orderDetail < 1)
        formData.value.newsDetails[idx].orderDetail = 1
}

defineExpose({
    open
})
</script>

<style>
.el-dialog {
    padding: 0 !important;
    overflow: hidden;
}

.el-dialog__header {
    background-color: #00345b;
    padding: 10px;
}

.el-dialog__header .el-dialog__title {
    color: white;
}

.el-dialog__body {
    padding: 20px;
}
</style>
