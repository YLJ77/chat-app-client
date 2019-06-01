<template>
    <div class="centered-form">
        <div class="centered-form__box">
            <h1>加入</h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入用户名" required></el-input>
                </el-form-item>
                <el-form-item prop="room">
                    <!--<el-input v-model="ruleForm.room" placeholder="房间" required @keyup.enter.native="join"></el-input>-->
                    <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="ruleForm.room"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入房间"
                            @keyup.enter.native="join"
                            @select="handleSelect">
                        <template slot-scope="{ item }">
                            <div class="name">{{ item.name }}</div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-button type="primary" @click="join">Join</el-button>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss">
    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .addr {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>

<script>
    import socket from '../socket'
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    room: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'change' },
                        {
                            validator: (rule, value, callback) => {
                                let user = this.users.find(user => user.name === value.trim().toLowerCase());
                                if (user) {
                                    callback(new Error('用户名已存在'))
                                }
                                callback();
                            },
                            trigger: 'change'
                        }
                    ],
                    room: [
                        { required: true, message: '请输入房间', trigger: 'change' }
                    ],
                },
                users: [],
                rooms: []
            }
        },
        methods: {
            querySearch(queryString, cb) {
                let rooms = this.rooms;
                let results = queryString ? rooms.filter(this.createFilter(queryString)) : rooms;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (room) => {
                    return (room.name.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(room) {
                this.ruleForm.room = room.name;
            },
            join() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let { ruleForm } = this;
                        let user = this.users.find(user => user.room === ruleForm.room.trim().toLowerCase())
                        if (user) {
                            this.$message.success(`已加入${user.room}房间`)
                        } else {
                            this.$message.success(`已创建${ruleForm.room}房间`)
                        }
                        this.$router.push(`/chat/${ruleForm.name}/${ruleForm.room}`)
                    }
                });
            },
            getUsers() {
                fetch('http://127.0.0.1:3000/getUsers').then(res => {
                    return res.json();
                }).then(users => {
                    this.users = users;
                })
            },
            getRooms(users) {
                let rooms = [];
                users.forEach(user => {
                    rooms.push(user.room)
                });
                return [...new Set(rooms)].map(room => {
                    return { name: room }
                });
            }
        },
        created() {
            socket.on('roomMayChange', (users) => {
                this.users = users;
                this.rooms = this.getRooms(users);
            });
        }
    }
</script>