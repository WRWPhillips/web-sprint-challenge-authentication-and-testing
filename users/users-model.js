const db = require('../data/dbConfig');

async function findBy(filter) {
    user = await db("users")
      .select("id", "username", "password")
      .where(filter)
    return user;
  }
  
async function add(user) {
    const [id] = await db("users").insert(user)
    return findById(id)
}
  
async function findById(id) {
    const user = await db("users")
        .select("id", "username", "password")
        .where("id", id)
        .first()
    return user;
}

module.exports = {
    add,
    findBy,
    findById,
  }