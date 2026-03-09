<template>
    <el-dialog v-model="visible" title="Yangilik qo'shish" width="50%">
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
                    <el-button circle :icon="Delete" type="danger"></el-button>
                </div>
                <div class="w-full p-2 flex items-center justify-between">
                    <div class="w-1/2">
                        <el-form-item prop="orderDetail" label="Tartibi" label-position="left">
                            <el-input v-model="formData.newsDetails[idx].orderDetail" @change="onOrderDetailChange(idx)" type="number" placeholder="Tartibi" />
                        </el-form-item>
                        <el-form-item prop="description" label="Tavsif" label-position="left">
                            <el-input v-model="formData.newsDetails[idx].description" @change="onOrderDetailChange(idx)" placeholder="Batafsil..." clearable />
                        </el-form-item>
                    </div>
                    <div class="w-1/2 flex items-center justify-end">
                        <el-form-item>
                            <el-upload list-type="picture-card"
                                       :http-request="(options) => uploadFile(options, idx)" :file-list="item.fileList" :limit="1">
                                <el-icon><Plus /></el-icon>

                            </el-upload>
                        </el-form-item>
                    </div>
                </div>
            </fieldset>
        </el-form>
    </el-dialog>
</template>

<script setup>
import {computed, ref} from "vue"
import {Delete, Plus} from "@element-plus/icons-vue";
import store from "@/store/store.js";
import axios from "axios";

const visible = ref(false)
const formRef = ref(null)
const fileList = ref([])
const formData = ref({
    title: '',
    newsDetails: [
        {
            localDateTime: new Date().toISOString(),
            orderDetail: 1,
            attachmentId: null,
            description: '',
            fileList: []
        }
    ]
})

const rules = {
    title: [
        {required: true, message: 'Yangilik nomi kiritilishi shart', trigger: 'blur'}
    ],
    orderDetail: [
        {required: true, message: 'Tartib raqami kiritilishi shart', trigger: 'change'}
    ],
    description: [
        {required: true, message: 'Tavsif kiritilishi shart', trigger: 'change'}
    ],
}

const open = () => {
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

const uploadFile = async ({ file, onSuccess, onError }, idx) => {
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

        formData.value.newsDetails[idx].attachmentId = res.data;

        // 👇 preview ko‘rinishi uchun
        // fileList.value = [{
        //     name: file.name,
        //     url: URL.createObjectURL(file)
        // }];
        formData.value.newsDetails[idx].fileList = [{
            name: file.name,
            url: URL.createObjectURL(file)
        }];

        onSuccess(res.data, file);

    } catch (err) {
        onError(err, file);
    }
};

const save = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            console.log('Form submitted:', formData.value)
        } else {
            console.log('Form validation failed')
            return false
        }
    })
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
