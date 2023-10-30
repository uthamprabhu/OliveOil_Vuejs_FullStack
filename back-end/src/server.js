import express from 'express'
import { MongoClient } from 'mongodb'
import path from 'path'

async function start() {
    const url = `mongodb+srv://utham1:utham1@cluster0.5wqjnub.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(url)
    console.log('Database connected successfully :)')

    await client.connect()
    const db = client.db('fsv-db')

    const app = express()
    app.use(express.json())

    app.use('/images', express.static(path.join(__dirname, '../assets')))

    app.get('/api/products', async (req, res) => {
        const products = await db.collection('products').find({}).toArray()
        res.send(products)
    })

    //function to find cart items
    async function populateCartIds(ids) {
        return Promise.all(ids.map(id =>
            db.collection('products').findOne({ id })
        ))
    }
    app.get('/api/users/:userId/cart', async (req, res) => {
        const userId = req.params.userId
        const user = await db.collection('users').findOne({ id: userId })
        const populatedCartItem = await populateCartIds(user?.cartItems || [])
        res.json(populatedCartItem)
    })

    app.get('/api/products/:productId', async (req, res) => {
        const productId = req.params.productId
        const product = await db.collection('products').findOne({ id: productId })
        res.json(product)
    })

    app.post('/api/users/:userId/cart', async (req, res) => {
        const userId = req.params.userId
        const productId = req.body.id

        const existingUser = await db.collection('users').findOne({ id: userId })

        if (!existingUser) {
            await db.collection('users').insertOne({ id: userId, cartItems: []})
        }

        await db.collection('users').updateOne({ id: userId }, {
            $addToSet: { cartItems: productId}
        })

        const user = await db.collection('users').findOne({ id: userId })
        const populatedCartItem = await populateCartIds(user?.cartItems || [])
        res.json(populatedCartItem)
    })

    app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
        const userId = req.params.userId
        const productId = req.params.productId

        await db.collection('users').updateOne({ id: userId }, {
            $pull: { cartItems: productId }
        })

        const user = await db.collection('users').findOne({ id: userId })
        const populatedCartItem = await populateCartIds(user?.cartItems || [])
        res.json(populatedCartItem)
    })

    app.listen(8000, () => {
        console.log(`Server is listening on http://localhost:8000`)
    })
}

start()

