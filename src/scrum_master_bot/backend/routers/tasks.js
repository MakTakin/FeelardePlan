const Router = require('express')
const router = Router()
const Task = require('../models/task')

router.get('/', async (req, res) => {
    try{
        const tasks = await Task.findAll()
        res.status(200).json(tasks)
    }catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Server error"
        })
    }

})

module.exports = router