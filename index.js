import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

import express from 'express'
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
})

app.get('/productos/', (req, res) =>{
    try {
        let allProducts = datos.productos

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.get('/productos/:id', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

        res.status(200).json(productoEncontrado)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.post('/productos', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.productos.push(req.body)
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

app.patch('/productos/:id', (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    let productoAActualizar = datos.productos.find((producto) => producto.id === idProductoAEditar)

    if (!productoAActualizar) {
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        
        if(data.nombre){
            productoAActualizar.nombre = data.nombre
        }
        
        if (data.tipo){
            productoAActualizar.tipo = data.tipo
        }

        if (data.precio){
            productoAActualizar.precio = data.precio
        }

        res.status(200).send('Producto actualizado')
    })
})

app.delete('/productos/:id', (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    let productoABorrar = datos.productos.find((producto) => producto.id === idProductoABorrar)

    if (!productoABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let indiceProductoABorrar = datos.productos.indexOf(productoABorrar)
    try {
         datos.productos.splice(indiceProductoABorrar, 1)
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

app.get('/usuarios/', (req, res) => {
    try {
        let allUsers = datos.usuarios;
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(204).json({"error": "Error interno"});
    }
})

app.get('/usuarios/:id', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id);
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (usuarioEncontrado) {
            res.status(200).json(usuarioEncontrado);
        } else {
            res.status(404).json({"error": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.post('/usuarios', (req, res) => {
    try {
        let bodyTemp = '';

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString();
        });

        req.on('end', () => {
            const data = JSON.parse(bodyTemp);
            req.body = data;

            const nuevoId = datos.usuarios.length + 1;
            const nuevoUsuario = {
                id: nuevoId,
                nombre: req.body.nombre,
                edad: req.body.edad,
                email: req.body.email,
                telefono: req.body.telefono
            };

            datos.usuarios.push(nuevoUsuario);

            res.status(201).json({"message": "Usuario creado exitosamente", "id": nuevoId});
        });
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.patch('/usuarios/:id', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuarioAModificar = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (!usuarioAModificar) {
            res.status(404).json({"error": "Usuario no encontrado"});
        } else {
            let bodyTemp = '';

            req.on('data', (chunk) => {
                bodyTemp += chunk.toString();
            });

            req.on('end', () => {
                const data = JSON.parse(bodyTemp);
                req.body = data;

                if (req.body.nombre) {
                    usuarioAModificar.nombre = req.body.nombre;
                }

                if (req.body.edad) {
                    usuarioAModificar.edad = req.body.edad;
                }

                if (req.body.email) {
                    usuarioAModificar.email = req.body.email;
                }

                if (req.body.telefono) {
                    usuarioAModificar.telefono = req.body.telefono;
                }

                res.status(200).json({"message": "Usuario modificado exitosamente", "usuario": usuarioAModificar});
            });
        }
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.delete('/usuarios/:id', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const indiceUsuarioABorrar = datos.usuarios.findIndex((usuario) => usuario.id === usuarioId);

        if (indiceUsuarioABorrar === -1) {
            res.status(404).json({"error": "Usuario no encontrado"});
        } else {
            datos.usuarios.splice(indiceUsuarioABorrar, 1);
            res.status(200).json({"message": "Usuario eliminado exitosamente"});
        }
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.get('/productos/:id/precio', (req, res) => {
    try {
        const productoId = parseInt(req.params.id);
        const productoEncontrado = datos.productos.find((producto) => producto.id === productoId);

        if (productoEncontrado) {
            res.status(200).json({"precio": productoEncontrado.precio});
        } else {
            res.status(404).json({"error": "Producto no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.get('/productos/:id/nombre', (req, res) => {
    try {
        const productoId = parseInt(req.params.id);
        const productoEncontrado = datos.productos.find((producto) => producto.id === productoId);

        if (productoEncontrado) {
            res.status(200).json({"nombre": productoEncontrado.nombre});
        } else {
            res.status(404).json({"error": "Producto no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.get('/usuarios/:id/telefono', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (usuarioEncontrado) {
            res.status(200).json({"telefono": usuarioEncontrado.telefono});
        } else {
            res.status(404).json({"error": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.get('/usuarios/:id/nombre', (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);
        const usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId);

        if (usuarioEncontrado) {
            res.status(200).json({"nombre": usuarioEncontrado.nombre});
        } else {
            res.status(404).json({"error": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.get('/productos/total', (req, res) => {
    try {
        const productos = datos.productos;
        const totalStock = productos.reduce((total, producto) => total + producto.precio, 0);
        res.status(200).json({"total_stock": totalStock});
    } catch (error) {
        res.status(500).json({"error": "Error interno"});
    }
})

app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})
