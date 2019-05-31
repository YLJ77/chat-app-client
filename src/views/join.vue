<template>
    <div class="centered-form">
        <div class="centered-form__box">
            <h1>加入</h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item prop="name">
                    <el-input v-model="ruleForm.name" placeholder="用户名" required></el-input>
                </el-form-item>
                <el-form-item prop="room">
                    <el-input v-model="ruleForm.room" placeholder="房间" required></el-input>
                </el-form-item>
                <el-button type="primary" @click="join">Join</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    room: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'change' }
                    ],
                    room: [
                        { required: true, message: '请输入房间', trigger: 'change' }
                    ],
                }
            }
        },
        methods: {
            join() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let { ruleForm } = this;
                        this.$router.push(`/chat/${ruleForm.name}/${ruleForm.room}`)
                    }
                });
            },
        }
    }
</script>