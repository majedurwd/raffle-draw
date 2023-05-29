const Ticket = require("./Ticket")
const { readFile, writeFile } = require("./utils")

const tickets = Symbol("tickets")

class TicketCollection {
    constructor() {
        (async function () {
            this[tickets] = await readFile()
        }.call(this))
    }

    /**
     * create and save new ticket
     * @param {string} username 
     * @param {number} price 
     * @returns {Ticket}
     */
    create(username, price) {
        const ticket = new Ticket(username, price)
        this[tickets].push(ticket)
        writeFile(this[tickets])
        return ticket
    }

    /**
     * create bulk and save new tickets
     * @param {string} username 
     * @param {number} price 
     * @param {number} quantity
     * @returns {Ticket}
     */
    createBulk(username, price, quantity) {
        let result = []
        console.log(result);
        for (let i = 0; i < quantity; i++){
            result.push(this.create(username, price))
        }
        writeFile(this[tickets])
        return result
    }

    /**
     * return all tickets from db
     */
    find() {
        return this[tickets]
    }

    /**
     * find ticket by id
     * @param {string} id 
     * @returns {Ticket}
     */
    findById(id) {
        const ticket = this[tickets].find(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.id === id
        )
        return ticket
    }

    /**
     * find tickets by username
     * @param {string} username 
     * @returns {Ticket[]}
     */
    findByUsername(username) {
        const userTickets = this[tickets].filter(
            (ticket) => ticket.username === username
        )
        
        return userTickets
    }

    /**
     * update ticket by id
     * @param {string} ticketId 
     * @param {{username: string, price: number}} ticketBody 
     * @returns {Ticket}
     */
    updateById(ticketId, ticketBody) {
        let ticket = this.findById(ticketId)
        if (ticket) {
            ticket.username = ticketBody.username ?? ticket.username
            ticket.price = ticketBody.price ?? ticket.price
        }
        writeFile(this[tickets])
        return ticket
    }

    /**
     * update ticket bulk
     * @param {string} username 
     * @param {{username: string, price: number}} ticketBody 
     * @returns {Ticket[]}
     */
    updateBulk(username, ticketBody) {
        const tickets = this.findByUsername(username)
        const updatedTickets = tickets.map(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => this.updateById(ticket.id, ticketBody)
        )
        writeFile(this[tickets])
        return updatedTickets
    }

    /**
     * delete ticket by id
     * @param {string} ticketId 
     */
    deleteById(ticketId) {
        const index = this[tickets].findIndex(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.id === ticketId
        )

        if (index === -1) {
            return false
        } else {
            console.log(index);
            this[tickets].splice(index, 1)
            writeFile(this[tickets])
            return true
        }
    }

    /**
     * delete ticket bulk
     * @param {string} username
     * @returns {boolean[]}
     */
    deleteBulk(username) {
        const userTickets = this.findByUsername(username)
        console.log(userTickets);
        const deletedResult = userTickets.map(
            (ticket) => this.deleteById(ticket.id)
        )
        writeFile(this[tickets])
        return deletedResult
    }

    /**
     * find winners
     * @param {number} winnerCounter
     * @returns {Ticket[]}
     */
    draw(winnerCounter) {
        const winnerIndexes = new Array(winnerCounter);
        let winnerIndex = 0;
        while (winnerIndex < winnerCounter) {
            let ticketIndex = Math.floor(Math.random * this[tickets].length)
            if (!winnerIndexes.includes(ticketIndex)) {
                winnerIndexes[winnerIndex++] = ticketIndex
                continue
            }
        }

        const winners = winnerIndexes.map(
            (index) => this[tickets][index]
        )
        return winners
    }
}

module.exports = new TicketCollection()
