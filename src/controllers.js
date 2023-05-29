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
        console.log(username, price, quantity);
        const bulkTicket = ticketCollection.createBulk(username, price, quantity)
        res.status(201).json({
            msg: "Bulk ticket created successfully",
            bulkTicket,
        })
    } catch (err) {
        res.status(500).json({msg: err.message, stack: err.stack})
    }
}

// find tickets controller
exports.findAll = (req, res) => {
    try {
        const tickets = ticketCollection.find()
        res.status(200).json({
            items: tickets,
            total: tickets.length
        })
        
    } catch (err) {
        res.status(500).json({msg: err.message, stack: err.stack})
    }
}

exports.findById = (req, res) => {
    try {
        const ticket = ticketCollection.findById(req.params.id)
        if (!ticket) {
            res.status(404).json({
                message: "404 not found"
            })
        }
        res.status(200).json({ticket})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

exports.findByUsername = (req, res) => {
    try {
        const tickets = ticketCollection.findByUsername(req.params.username)

        res.status(200).json({
            items: tickets,
            total: tickets.length
        })
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

// update tickets controller

exports.updateById = (req, res) => {
    const id = req.params.id
    try {
        const ticket = ticketCollection.updateById(id, req.body)
        if (!ticket) {
            res.status(404).json({
                message: "404 not found"
            })
        }
        res.status(200).json({ticket})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

exports.updateByUsername = (req, res) => {
    try {
        const username = req.params.username
        const tickets = ticketCollection.updateBulk(username, req.body)
        res.status(200).json({
            items: tickets,
            total: tickets.length
        })
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

// delete controller

exports.deleteById = (req, res) => {
    try {
        const id = req.params.id
        const isDeleted = ticketCollection.deleteById(id)
        if (isDeleted) {
            return res.status(204).send()
        }
        res.status(400).json({msg: "Delete operation failed"})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

exports.deleteByUsername = (req, res) => {
    try {
        const username = req.params.username
        ticketCollection.deleteBulk(username)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

// Draw Controller
exports.drawWinners = (req, res) => {
    try {
        const wc = req.query.WC ?? 3
        const winners = ticketCollection.draw(wc)
        res.status(200).json({winners})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}