<script lang="ts">
import type { Queue, Bot } from "../types/index"

let interval = 10 * 1000 // 10 second

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
        bots : [] as Bot[],
        intervalId:0 as number
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
        assignedQueue:[],
        timeOutId:0,
        processTask: function(delay:number,completedObj:Queue[]){
          if(this.assignedQueue.length > 0){
            const timeoutId = setTimeout(()=>{
              // check if current completed queue have the value or not
              const completedIndex = completedObj.findIndex(queue=>queue.queueNo === this.assignedQueue[0].queueNo)
              if(completedIndex === -1){
                completedObj.push(this.assignedQueue[0])
              }
              // remove the order from the queue
              this.assignedQueue.shift()
              this.processTask(delay,completedObj); // Call the function again after the delay
            },delay)
            
            this.timeOutId = timeoutId
          }
        },
      }
      // push the object to the bot array
      this.bots.push(newBot)
    },
    removeBot(){
      // check for the timeoutid is defined before clearing it
      if( this.bots.length > 0 && this.bots[this.bots.length-1].timeOutId !== 0){

        const bot = this.bots[this.bots.length-1]
        
        if(bot.assignedQueue.length > 0){
          if(this.completedQueue.findIndex(queue=>queue.queueNo === bot.assignedQueue[0].queueNo) === -1){
            if(bot.assignedQueue[0].userType === 'vip'){
                this.vipQueue.unshift(bot.assignedQueue[0])
              }
            if(bot.assignedQueue[0].userType === 'normal'){
              this.normalQueue.unshift(bot.assignedQueue[0])
            }
          }
        }
        clearTimeout( this.bots[this.bots.length-1].timeOutId )
      }
      this.bots.pop()
    },  
    handleOrder(){
      // check if there is available bot
      const availableBots = this.bots.filter(bot=>bot.assignedQueue.length === 0)
      if(availableBots.length === 0){
        return
      }
      
      // Assign the order to an avaiableBot
      // assign vip first
      if(this.vipQueue.length > 0){
        // create temp value to push in case another function make adjustment\
        const tempVipQueueObj = this.vipQueue[0]
        availableBots[0].assignedQueue.push(tempVipQueueObj)
        this.vipQueue.shift()
        availableBots[0].processTask(3000,this.completedQueue)
        return
      }

      if(this.normalQueue.length > 0){
        // create temp value to push in case another function make adjustment\
        const tempNormalQueueObj = this.normalQueue[0]
        availableBots[0].assignedQueue.push(tempNormalQueueObj)
        this.normalQueue.shift()
        availableBots[0].processTask(interval,this.completedQueue)
        return
      }
    }
  },
  watch:{
    bots:{
      handler: function (){
        this.handleOrder()
      },
      deep:true
    },
    vipQueue:{
      handler: function (){
        this.handleOrder()
      },
      deep:true
    },
    normalQueue:{
      handler: function (){
        this.handleOrder()
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
    <h3>Bot Count : {{ bots.length }} </h3>
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
