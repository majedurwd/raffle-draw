const ticketCollection = require("./tickets")
/**
 * Create and sell single ticket
 * @method POST
 */
exports.sellSingleTicket = (req, res, _next) => {
    try {
        const { username, price } = req.body
        const ticket = ticketCollection.create(username, price)
        res.status(201).json({
            msg: "Ticket created successfully",
            ticket,
        })
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

/**
 * Create and sell bulk ticket
 * @method POST
 */
exports.sellBulkTicket = (req, res, _next) => {
    try {
        const { username, price, quantity } = req.body
        const bulkTicket = ticketCollection.createBulk(username, price, quantity)
        res.status(201).json({
            msg: "Bulk ticket created successfully",
            bulkTicket,
        })
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}