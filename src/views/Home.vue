<template>
  <div class="home">
    <el-button @click="increment">increment</el-button>
    <h1>chat app</h1>
  </div>
</template>

<script>

    import io from 'socket.io-client';
    const socket = io('http://localhost:3000');

    export default {
        methods: {
            increment() {
                socket.emit('increment');
            },
            test() {
                socket.on('countUpdated', (count) => {
                    console.log('count 已更新', count);
                });
            }
        },
        mounted() {
            this.test();
        }
    }
</script>
