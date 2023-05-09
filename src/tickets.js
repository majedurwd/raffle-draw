const Ticket = require("./Ticket")

const tickets = Symbol("tickets")

class TicketCollection {
    constructor() {
        this[tickets] = []
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
        for (let i = 0; i < quantity; i++){
            result.push(this.create(username, price))
        }
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
        const tickets = this[tickets].filter(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => ticket.username === username
        )
        return tickets
    }

    /**
     * update ticket by id
     * @param {string} ticketId 
     * @param {{username: string, price: number}} ticketBody 
     * @returns {Ticket}
     */
    updateById(ticketId, ticketBody) {
        let ticket = this.findById(ticketId)
        ticket.username = ticketBody.username ?? ticket.username
        ticket.price = ticketBody.price ?? ticket.price
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
            this[tickets].slice(index, 1)
            return true
        }
    }

    /**
     * delete ticket bulk
     * @param {string} username
     * @returns {boolean[]}
     */
    deleteBulk(username) {
        const tickets = this.findByUsername(username)
        const deletedResult = tickets.map(
            (ticket) => this.deleteById(ticket.id)
        )
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
