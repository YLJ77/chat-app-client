<template>
    <div class="home">
        <ul>
            <li v-for="msg in messages">
                <span v-if="!msg.isLoc">{{ `${msg.time}: ${ msg.msg } ` }}</span>
                <a target="_blank" :href="msg.msg" v-else>我现在的位置</a>
            </li>
        </ul>
        <el-form>
            <el-form-item>
                <el-input v-model="message" @keyup.enter.native="send">
                    <el-button slot="append" @click="send" :loading="isSending">send</el-button>
                </el-input>
            </el-form-item>
            <el-button @click="sendLoc" :loading="isSending">发送位置</el-button>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
    ul {
        li {
            list-style: none;
        }
    }
</style>

<script>

import moment from 'moment'
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

export default {
    data() {
        return {
            message: '',
            isSending: false,
            messages: []
        }
    },
    methods: {
        sendLoc() {
            navigator.geolocation.getCurrentPosition(pos => {
                console.log(pos);
                this.isSending = true;
                let { coords: { latitude, longitude } } = pos
                socket.emit('sendLocation', { latitude, longitude }, msg => {
                    this.isSending = false;
                    console.log(msg);
                })
            })
        },
        send() {
            let { message } = this;
            this.isSending = true;
            socket.emit('sendMessage', message, (msg) => {
                this.isSending = false;
                console.log(msg);
            });
        },
        increment() {
            socket.emit('increment');
        },
        init() {
            socket.on('message', (msg) => {
                msg.time = moment(msg.time).format('hh:mm:ss a');
                this.messages.push(msg);
            });
        }
    },
    mounted() {
        this.init();
    }
}
</script>
