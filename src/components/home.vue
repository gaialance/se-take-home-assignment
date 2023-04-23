<script lang="ts">
import type { Queue, Bot } from "../types/index"

export default {
  name:"home-page",
  components: {},
  data() {
    return {
        name:'Link',
        normalQueue:[] as Queue[],
        vipQueue:[] as Queue[],
        completedQueue :[] as Queue[],
        currentQueueNo:0,
        bot : [] as Bot[]
    }
  },
  methods:{
    addVipQueue(){
      // increment the currentQueueNo
      this.currentQueueNo = this.currentQueueNo + 1 

      // create a new Queue object
      const newQueue:Queue = {
        queueNo:this.currentQueueNo,
        status:"pending",
        userType:"vip"
      }

      // push the object into the queue
      this.vipQueue.push(
        newQueue
      )
    },
    addNormalQueue(){
      // increment the currentQueueNo
      this.currentQueueNo = this.currentQueueNo + 1
      
      // create a new normal queue object
      const newQueue:Queue = {
        queueNo:this.currentQueueNo,
        status:"pending",
        userType:"normal"
      }

      // push the object into the queue
      this.normalQueue.push(
        newQueue
      )
    },
    handleClearQueue(){
      this.normalQueue = [];
      this.vipQueue = [];
      this.completedQueue = [];
    },
    addBot(){
      // create a new bot object
      const newBot:Bot = {
        handlingQueue:0,
        timeOutId:0,
      }

      // push the object to the bot array
      this.bot.push(newBot)
    },
    async removeBot(){
      // check for the timeoutid is defined before clearing it
      if( this.bot.length > 0 && this.bot[this.bot.length-1].timeOutId !== 0){
        clearTimeout( this.bot[this.bot.length-1].timeOutId )
      }
      this.bot.pop()
    },
    handleQueue(){
      const interval:number = 10 * 1000;

      // if have bot then assign task
      if(this.bot.length > 0){
        // deconstruct the status out
        this.bot.forEach((bot)=>{
          if(bot.handlingQueue === 0){
            if(this.vipQueue.length > 0){
              // deconstruct the vip to do a shallow copy
              const {status , ...tempArray} = this.vipQueue[0]

              bot.handlingQueue = tempArray.queueNo

              const timeOut = setTimeout(() => {
                this.vipQueue.shift()
                const indexInCompleteArray = this.completedQueue.findIndex((queue)=>queue.queueNo === tempArray.queueNo)

                if(indexInCompleteArray === -1){
                  this.completedQueue.push({
                    status:"completed",
                    ...tempArray
                  })
                }

                bot.handlingQueue = 0
                bot.timeOutId = 0
                this.handleQueue()
              }, interval);

              bot.timeOutId = timeOut
              
              return bot
            }

            if(this.normalQueue.length > 0){
              // deconstruct the vip to do a shallow copy
              const {status , ...tempArray} = this.normalQueue[0]

              bot.handlingQueue = tempArray.queueNo

              // timeout to remove it
              const timeOutId = setTimeout(() => {
                this.normalQueue.shift()
                const indexInCompleteArray = this.completedQueue.findIndex((queue)=>queue.queueNo === tempArray.queueNo)
                if(indexInCompleteArray === -1){
                  this.completedQueue.push({
                    status:"completed",
                    ...tempArray
                  })
                }
                bot.handlingQueue = 0
                bot.timeOutId = 0
                this.handleQueue()
              }, interval);

              bot.timeOutId = timeOutId
            }
          }
        })
      }
    }
  },
  watch:{
    bot:{
      handler: function (){
        this.handleQueue()
      },
      deep:true
    },
    vipQueue:{
      handler: function (){
        this.handleQueue()
      },
      deep:true
    },
    normalQueue:{
      handler: function (){
        this.handleQueue()
      },
      deep:true
    }
    
  }

}

</script>

<template>
  <div class="container">
    <h1>Order Queue</h1>
    <div class="grid">
      <button id="addvip" @click="addVipQueue">New Vip Queue</button>
      <button id="addnormal" @click="addNormalQueue">New Normal Queue</button>
      <button id="addbot" @click="addBot">+ Bot</button>
      <button id="removebot" @click="removeBot">- Bot</button>
    </div>
    <h3>Bot Count : {{ bot.length }} </h3>
    <button @click="handleClearQueue">Clear Queue</button>
    <div class="grid" style="width: 600px; margin-top: 20px;">
      <div class="card">
        Pending
        <div class="queue" v-if="vipQueue.length > 0 || normalQueue.length > 0">
          <div v-for="queue in vipQueue" :key="queue.queueNo" class="gold">
            {{ queue.queueNo }} ( {{ queue.userType }} )
          </div>
          <div v-for="queue in normalQueue" :key="queue.queueNo" class="white">
            {{ queue.queueNo }} ( {{ queue.userType }} )
          </div>
        </div>
      </div>
      <div class="card">
        Completed
        <div class="queue" v-if="completedQueue.length > 0">
          <div id="completedqueue" v-for="queue in completedQueue" :key="queue.queueNo" :class="queue.userType == 'vip'? 'gold':'white'">
            {{ queue.queueNo }} ( {{ queue.userType }} )
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .grid{
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, minmax(50%, auto));
    justify-items: center;
    gap: 20px;
  }

  .card{
    display: flex;
    flex-direction: column;
    padding: 1rem 1.2rem;
    border-radius: 20px;
    background-color: #404041;
    color: white;
    border: 1px solid rgba(var(--card-border-rgb), 0);
    transition: background 200ms, border 200ms;
    width: 100%;
    height: 600px;
    align-items: center;
  }

  .gold{
    color: gold;
  }

  .white{
    color: white;
  }

  .container button{
    width: 200px;
    height: 40px;
    margin: 0px 20px;
    background-color: rgb(59, 59, 59);
    color: white;
    border: none;
  }

  .container button:active{
    animation-name: clicked;
    animation-duration: 0.5s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
  }

  @keyframes clicked {
    0% {
      transform: translateY(0px);
    }

    100% {
      transform: translateY(30px);
    }
  }


  h3{
    margin: 20px;
  }

  .queue{
    border: solid 1px black;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
