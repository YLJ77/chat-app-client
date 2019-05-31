<template>
    <div class="home">
        <el-form>
            <el-form-item>
                <el-input v-model="message">
                    <el-button slot="append" @click="send">send</el-button>
                </el-input>
            </el-form-item>
            <el-button @click="getLoc">获取位置</el-button>
        </el-form>
    </div>
</template>

<script>

import io from 'socket.io-client';
const socket = io('http://localhost:3000');

export default {
    data() {
        return {
            message: ''
        }
    },
    methods: {
        getLoc() {
            navigator.geolocation.getCurrentPosition(pos => {
                console.log(pos);
                let { coords: { latitude, longitude } } = pos
                socket.emit('sendLocation', { latitude, longitude })
            })
        },
        send() {
            let { message } = this;
            socket.emit('sendMessage', message);
        },
        increment() {
            socket.emit('increment');
        },
        test() {
            socket.on('message', (msg) => {
                console.log(msg);
            });
        }
    },
    mounted() {
        this.test();
    }
}
</script>
