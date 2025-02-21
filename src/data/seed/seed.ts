import { envs } from '../../config';
import { CategoryModel } from '../mongo/models/category.model';
import { ProductModel } from '../mongo/models/product.model';
import { UserModel } from '../mongo/models/user.model';
import { MongoDatabase } from '../mongo/mongo-database';
import { seedData } from './data';

(async()=> {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL,
    })

    await main();

    await MongoDatabase.disconnect();
})();

const randomBetween0AndX = ( x: number ) => {
    return Math.floor( Math.random() * x );
}

async function main() {
    //0 Borrar Todo
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ])

    //1 Crear usuario
    const users = await UserModel.insertMany(seedData.users);

    //2 Crear Categoria
    const categories = await CategoryModel.insertMany(
        seedData.categories.map(category => {

            return {
                ...category,
                user: users[0]._id
            }
        })
    );

    //3 Crear Producto
    const products = await ProductModel.insertMany(
        seedData.products.map(product => {

            return{
                ...product,
                user: users[randomBetween0AndX(seedData.users.length - 1)]._id,
                category: categories[randomBetween0AndX(seedData.categories.length - 1)]._id,
            }
        })
    )
}