// https://docs.cypress.io/api/introduction/api.html

describe('test home Page loading', () => {
  it('Test initial load', () => {
    cy.visit('http://localhost:4173/')
    cy.contains("h1","Order Queue")
    cy.contains("button","New Vip Queue")
    cy.contains("button","New Normal Queue")
    cy.contains("button","+ Bot")
    cy.contains("button","- Bot")
    cy.contains("h3","Bot Count : 0")
    cy.contains("button","Clear Queue")
    cy.contains("div","Pending")
    cy.contains("div","Completed")
    cy.get("button")
  })
})

describe("Test normal flow",()=>{
  // this is testing normal flow when adding stuff to queue then add bot to it
  it("Test Start",() => {
    cy.clock()
    cy.visit('http://localhost:4173/')
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","1 ( vip )")
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","2 ( vip )")
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","3 ( vip )")
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","4 ( vip )")

    cy.get("button[id='addnormal']").click()
    cy.contains("div[id='normalqueue']","5 ( normal )")

    cy.get("button[id='addbot']").click()
    cy.contains("h3[id='botcount']","Bot Count : 1")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","1 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","2 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","3 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","4 ( vip )")

    cy.tick(10 * 1000)
    
    cy.contains("div[id='completedqueue']","5 ( normal )")
  })
})

describe("Test irregular flow",()=>{
  // this is testing include adding the bot then only add the queue
  it("Test Start",() => {
    cy.clock()
    cy.visit('http://localhost:4173/')

    cy.get("button[id='addbot']").click()
    cy.contains("h3[id='botcount']","Bot Count : 1")

    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","2 ( vip )")
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","3 ( vip )")
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","4 ( vip )")

    cy.get("button[id='addnormal']").click()
    cy.contains("div[id='normalqueue']","5 ( normal )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","1 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","2 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","3 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","4 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","5 ( normal )")
  })
})

describe("Testing when adding new queue in between",()=>{
  it("Test Start",() => {
    cy.clock()
    cy.visit('http://localhost:4173/')

    cy.get("button[id='addbot']").click()

    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()

    cy.get("button[id='addnormal']").click()

    cy.get("button[id='addvip']").click()

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","1 ( vip )")

    cy.tick(10 * 1000) 

    cy.contains("div[id='completedqueue']","2 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","3 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","4 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","6 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","5 ( normal )")
  })
})

describe("Testing with 2 bots",()=>{
  // total time taken around 40 min average 40/8 = 5 sec per request
  it("start testing with two bot",()=>{
    cy.clock()
    cy.visit('http://localhost:4173/')
  
    cy.get("button[id='addbot']").click()
    cy.get("button[id='addbot']").click()
  
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
  
    cy.get("button[id='addnormal']").click()
    cy.get("button[id='addnormal']").click()
  
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
  
    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","1 ( vip )")
    cy.contains("div[id='completedqueue']","2 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","3 ( vip )")
    cy.contains("div[id='completedqueue']","4 ( vip )")

    cy.tick(10 * 1000)
    
    cy.contains("div[id='completedqueue']","7 ( vip )")
    cy.contains("div[id='completedqueue']","8 ( vip )")

    cy.tick(10 * 1000)
  
    cy.contains("div[id='completedqueue']","5 ( normal )")
    cy.contains("div[id='completedqueue']","6 ( normal )")
  })
})

describe("Testing with 3 bots",()=>{
  // total time taken around 30 min average 30/8 3.75 sec per request
  it("start testing with 3 bot",()=>{
    cy.clock()
    cy.visit('http://localhost:4173/')
  
    cy.get("button[id='addbot']").click()
    cy.get("button[id='addbot']").click()
    cy.get("button[id='addbot']").click()
  
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
  
    cy.get("button[id='addnormal']").click()
    cy.get("button[id='addnormal']").click()
  
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
  
    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","1 ( vip )")
    cy.contains("div[id='completedqueue']","2 ( vip )")
    cy.contains("div[id='completedqueue']","3 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","4 ( vip )")
    cy.contains("div[id='completedqueue']","7 ( vip )")
    cy.contains("div[id='completedqueue']","8 ( vip )")

    cy.tick(10 * 1000)
  
    cy.contains("div[id='completedqueue']","5 ( normal )")
    cy.contains("div[id='completedqueue']","6 ( normal )")
  
  })
})


describe("Testing with removal of 1 bot while processing with 3 bot",()=>{
  it("adding 3 bot",()=>{
    cy.clock()
    cy.visit('http://localhost:4173/')
  
    cy.get("button[id='addbot']").click()
    cy.get("button[id='addbot']").click()
    cy.get("button[id='addbot']").click()

    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
  
    cy.get("button[id='addnormal']").click()
    cy.get("button[id='addnormal']").click()
  
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","1 ( vip )")
    
    // cy.get("button[id=removebot]").click()
    
    cy.tick(10 * 1000)
    cy.get("button[id=removebot]").click()

    cy.contains("div[id='completedqueue']","2 ( vip )")
    cy.contains("div[id='completedqueue']","3 ( vip )")
    
    cy.tick(10 * 1000)
    
    cy.contains("div[id='completedqueue']","4 ( vip )")
    cy.contains("div[id='completedqueue']","7 ( vip )")
    cy.contains("div[id='completedqueue']","8 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","5 ( normal )")
    
    cy.tick(10 * 1000)
    
    cy.contains("div[id='completedqueue']","6 ( normal )")
  })
})

describe("Interesting Bug",() =>{
  it("adding 3 bot remove one bot after first setTimeOut",()=>{
    cy.clock()
    cy.visit('http://localhost:4173/')
  
    cy.get("button[id='addbot']").click()
    cy.get("button[id='addbot']").click()
    cy.get("button[id='addbot']").click()

    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","4 ( vip )")
  
    cy.get("button[id='addnormal']").click()
    cy.contains("div[id='normalqueue']","5 ( normal )")
    cy.get("button[id='addnormal']").click()
    cy.contains("div[id='normalqueue']","6 ( normal )")
  
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","7 ( vip )")
    cy.get("button[id='addvip']").click()
    cy.contains("div[id='vipqueue']","8 ( vip )")

    cy.tick(10 * 1000)

    cy.contains("div[id='completedqueue']","1 ( vip )")
    cy.contains("div[id='completedqueue']","2 ( vip )")
    cy.contains("div[id='completedqueue']","3 ( vip )")
    

    cy.get("button[id=removebot]").click()
    
    cy.tick(10 * 1000)
    cy.contains("div[id='completedqueue']","4 ( vip )")
    cy.contains("div[id='completedqueue']","7 ( vip )")
    
    cy.tick(10 * 1000)
    cy.contains("div[id='completedqueue']","8 ( vip )")
    cy.contains("div[id='completedqueue']","5 ( normal )")

    cy.tick(10 * 1000)
    cy.contains("div[id='completedqueue']","6 ( normal )")  
  })
})