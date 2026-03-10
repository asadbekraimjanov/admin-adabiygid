<template>
    <div class="w-full h-[100vh] overflow-hidden flex items-center justify-center">
        <img src="@/assets/images/2.jpg" class="w-full h-full absolute -z-10 blur-sm" alt="">
        <div class="w-[560px] bg-white shadow-2xl rounded-sm p-6">
            <p class="text-3xl font-bold text-gray-800 text-center mb-6">Hush kelibsiz🎉</p>
            <el-form>
                <el-form-item label="Login" label-position="top">
                    <el-input v-model="formData.email" placeholder="Foydalanuvchi nomini kiriting" size="large" />
                </el-form-item>

                <el-form-item label="Parol" label-position="top">
                    <el-input v-model="formData.password" placeholder="Parol kiriting" type="password" size="large" show-password />
                </el-form-item>

            </el-form>
            <el-button type="primary" @click="login" :loading="loading"
                       class="w-full mt-4 hover:!bg-white hover:!text-cyan-500 hover:!border-cyan-500 !font-semibold !bg-cyan-500
                            !border-cyan-500 active:!text-white active:!bg-cyan-500"
            >Kirish</el-button>
            <el-divider>Ro'yxatdan o'tmaganmisiz?</el-divider>
            <el-button class="w-full mt-2">Ro'yxatdan o'tish</el-button>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";
import axios from "axios";
import store from "@/store/store.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";

const formData = ref({
    email: '',
    password: '',
})
const loading = ref(false);

const login = async () => {
    loading.value = true;
    axios.post('https://api.adabiygid.uz/auth/login', {
        email: formData.value.email,
        password: formData.value.password
    }).then((res) => {
        const token = res.data.access_token;
        localStorage.setItem('token', token);
        store.commit('setToken', token);

        router.push('/dashboard');
    }).catch(() => {
        ElMessage.warning('Noto\'g\'ri login yoki parol kiritilgan')
    }).finally(() => {
        loading.value = false
    })


}

</script>

<style scoped>

</style>
