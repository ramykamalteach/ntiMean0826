const { mongoose, Schema, mongoConnection } = require('./mongooseConnection');

const productSchema = new Schema({
    productName: String,
    weight: Number,
    photo: String,
});

const Product = mongoose.model("product", productSchema);

mongoose.connect(mongoConnection)
    .then(() => {
        // seccess connecting
    })
    .catch((err) => {
        // failed connecting
    });

async function index() {
    const products = await Product.find();
    return products;
}

async function show(id) {
    let products = await Product.findById(id);
    products = [products];
    return products;
}


async function store(createFormData) {
    Product.create(createFormData)
        .then(() => {
            return;
        })
        .catch(
        // error
    );
}


async function updateForm(id) {
    let products = await Product.findById(id);
    products = [products];
    return products;
}

async function update(updateFormData) {
    const photo = updateFormData.photo;

    if (photo != "") {
        //
    }
    else {
        let oldDoc = await Product.findById(updateFormData.id);
        updateFormData.photo = oldDoc.photo;
    }

    Product.updateOne(
        { _id: updateFormData.id },
        updateFormData
    )
        .then(() => {
            return;
        })
        .catch((err) => {
            //
        });
}


async function destroy(id) {
    Product.deleteOne({ _id: id })
        .then(() => {
            return;
        })
        .catch(
        // error
    );
}


module.exports = {
    index,
    show,
    store,
    updateForm,
    update,
    destroy
}