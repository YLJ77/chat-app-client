<template>
    <div class="home">
        <div class="chat">
            <div class="chat__sidebar">
                <h2 class="room-title">{{room}}</h2>
                <h3 class="list-title">Users</h3>
                <ul class="users">
                    <li v-for="user in users">{{user.name}}</li>
                </ul>

            </div>
            <div class="chat__main">
                <div id="messages" class="chat__messages" ref="messages">
                    <div class="message">
                        <template v-for="msg in messages">
                            <p>
                                <span class="message__name">{{ msg.name }}</span>
                                <span class="message__meta">{{ msg.time }}</span>
                            </p>
                            <p v-if="!msg.isLoc">{{ msg.msg }}</p>
                            <p v-else><a :href="msg.msg" target="_blank">我的位置</a></p>
                        </template>
                    </div>
                </div>

                <div class="compose">
                    <div id="message-form" style="width: 100%;">
                        <el-input
                                autofocus="true"
                                placeholder="Message"
                                v-model="message"
                                @keyup.enter.native="send">
                            <el-button type="primary" slot="append" @click="send" :loading="isSending">send</el-button>
                        </el-input>
                    </div>
                    <!--需科学上网才能发送位置-->
<!--                    <el-button @click="sendLoc" :loading="isLocSending">发送位置</el-button>-->
                </div>
            </div>
        </div>

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
import socket from '../socket'

export default {
    data() {
        return {
            message: '',
            isSending: false,
            isLocSending: false,
            messages: [],
            room: '',
            users: []
        }
    },
    methods: {
        autoScroll() {
            const $messages = this.$refs.messages;
            // New message element
            const $newMessage = $messages.lastElementChild

            // Height of the new message
            const newMessageStyles = getComputedStyle($newMessage)
            const newMessageMargin = parseInt(newMessageStyles.marginBottom)
            const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

            // Visible height
            const visibleHeight = $messages.offsetHeight

            // Height of messages container
            const containerHeight = $messages.scrollHeight

            // How far have I scrolled?
            const scrollOffset = $messages.scrollTop + visibleHeight

            if (containerHeight - newMessageHeight <= scrollOffset) {
                $messages.scrollTop = $messages.scrollHeight
            }

        },
        sendLoc() {
            navigator.geolocation.getCurrentPosition(pos => {
                console.log(pos);
                this.isLocSending = true;
                let { coords: { latitude, longitude } } = pos
                socket.emit('sendLocation', { latitude, longitude }, msg => {
                    this.isLocSending = false;
                    console.log(msg);
                })
            })
        },
        send(event) {
            let { message } = this;
            event.preventDefault();
            if (!message) return;
            this.isSending = true;
            socket.emit('sendMessage', message, (msg) => {
                this.isSending = false;
                this.message = '';
                console.log(msg);
            });
        },
        init() {
            socket.emit('join', this.$route.params, err => {
                if (err) {
                    this.$message.error(err)
                    this.$router.replace('/')
                }
            });
            socket.on('message', (msg) => {
                msg.time = moment(msg.time).format('hh:mm:ss a');
                this.messages.push(msg);
                this.autoScroll();
            });
            socket.on('roomData', ({ users, room }) => {
                this.users = users;
                this.room = room;
            });
        }
    },
    mounted() {
        this.init();
    }
}
</script>
