const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

const Connection =async()=>{
    const username = "mthilesh09"
    const password ="BSClPdxpYdEhKUxq"
    const clusterName= "AmazonData"
    const dbName = "productData"    
    const URL = `mongodb+srv://${username}:${password}@${clusterName}.pj1mgca.mongodb.net/${dbName}`;

    try {
        await mongoose.connect(URL);
        console.log(`DataBase Connected Successfully : ${dbName}`)
    } catch (error) {
        console.log("Error while connecting Databse : ", error)
    }

}

module.exports = Connection
