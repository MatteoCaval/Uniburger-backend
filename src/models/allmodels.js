
const category = {
    id,
    name,
    image,
    products: [
        {
            id,
            name,
            description,
            image,
            price,
            ingredients: []
        }
    ]
}

const user = {
    id,
    role,
    name,
    cognome,
    email,
    hashedPassword,
    cart: [
        {
            productId,
            quantity
        }
    ],
    tokens: [
        token
    ]
}

const order = {
    id,
    totalPrice,
    indirizzo,
    creationDate,
    ora,
    data,
    idCliente,
    numeroTelefono,
    stato,
    paymentType,
    products: [
        {
            name,
            price,
            quantity
        }
    ]
}

const orario = [
    {
        nomeGiorno,
        oraInizioPranzo,
        oraFinePranzo,
        oraInizioCena,
        oraFineCena,
    }
]