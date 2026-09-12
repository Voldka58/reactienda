
import { useState } from 'react'
import './App.css'

const productos = [
  {
    id: 1,
    nombre: 'Curso de Importación',
    precio: 10,
    imagen: 'https://placehold.co/600x600?text=Curso+Importacion',
  },
  {
    id: 2,
    nombre: 'Curso de Marketing Digital',
    precio: 30000,
    imagen: 'https://placehold.co/600x600?text=Marketing+Digital',
  },
  {
    id: 3,
    nombre: 'Curso de Programación Web',
    precio: 35000,
    imagen: 'https://placehold.co/600x600?text=Programacion+Web',
  },
  {
    id: 4,
    nombre: 'Curso de Inteligencia Artificial',
    precio: 40000,
    imagen: 'https://placehold.co/600x600?text=Inteligencia+Artificial',
  },
]

function App() {
  const [carrito, setCarrito] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(
      (item) => item.id === producto.id
    )

    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        )
      )
    } else {
      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad: 1,
        },
      ])
    }

    setCarritoAbierto(true)
  }

  const aumentarCantidad = (id) => {
    setCarrito(
      carrito.map((item) =>
        item.id === id
          ? {
              ...item,
              cantidad: item.cantidad + 1,
            }
          : item
      )
    )
  }

  const disminuirCantidad = (id) => {
    setCarrito(
      carrito
        .map((item) =>
          item.id === id
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item
        )
        .filter((item) => item.cantidad > 0)
    )
  }

  const eliminarProducto = (id) => {
    setCarrito(
      carrito.filter((item) => item.id !== id)
    )
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  const total = carrito.reduce(
    (acumulado, producto) =>
      acumulado +
      producto.precio * producto.cantidad,
    0
  )

  const cantidadProductos = carrito.reduce(
    (acumulado, producto) =>
      acumulado + producto.cantidad,
    0
  )

  // ================================
  // MERCADO PAGO
  // ================================

  const continuarPago = async () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío.')
      return
    }

    try {
      const respuesta = await fetch(
        'http://localhost:3000/crear-preferencia',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productos: carrito,
          }),
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            'Error al crear el pago'
        )
      }

      // Llevar al usuario al checkout de Mercado Pago
      window.location.href = datos.init_point

    } catch (error) {
      console.error(
        'Error Mercado Pago:',
        error
      )

      alert(
        'No se pudo iniciar el pago con Mercado Pago.'
      )
    }
  }

  return (
    <div className="tienda">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="logo">
          MiTienda
        </div>

        <nav>
          <a href="#inicio">
            Inicio
          </a>

          <a href="#productos">
            Productos
          </a>

          <a href="#nosotros">
            Nosotros
          </a>
        </nav>

        <button
          className="boton-carrito"
          onClick={() =>
            setCarritoAbierto(true)
          }
        >
          🛒 Carrito

          {cantidadProductos > 0 && (
            <span>
              {cantidadProductos}
            </span>
          )}
        </button>

      </header>

      {/* ================= HERO ================= */}

      <main>

        <section
          className="hero"
          id="inicio"
        >

          <div className="hero-contenido">

            <span className="etiqueta">
              OFERTAS ESPECIALES
            </span>

            <h1>
              Aprendé nuevas habilidades y
              llevá tu futuro al siguiente nivel
            </h1>

            <p>
              Cursos digitales y productos
              educativos para aprender, crecer
              y crear nuevas oportunidades.
            </p>

            <a
              href="#productos"
              className="boton-principal"
            >
              Ver productos
            </a>

          </div>

        </section>

        {/* ================= PRODUCTOS ================= */}

        <section
          className="productos-section"
          id="productos"
        >

          <div className="titulo-section">

            <span>
              CATÁLOGO
            </span>

            <h2>
              Productos destacados
            </h2>

            <p>
              Elegí el producto que querés comprar.
            </p>

          </div>

          <div className="productos-grid">

            {productos.map((producto) => (

              <article
                className="producto"
                key={producto.id}
              >

                <div className="producto-imagen">

                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                  />

                </div>

                <div className="producto-info">

                  <h3>
                    {producto.nombre}
                  </h3>

                  <p className="producto-descripcion">
                    Acceso digital y contenido completo.
                  </p>

                  <div className="producto-abajo">

                    <strong>
                      $
                      {producto.precio.toLocaleString(
                        'es-AR'
                      )}
                    </strong>

                    <button
                      onClick={() =>
                        agregarAlCarrito(producto)
                      }
                    >
                      Agregar
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>

        {/* ================= NOSOTROS ================= */}

        <section
          className="nosotros"
          id="nosotros"
        >

          <div className="nosotros-contenido">

            <span>
              COMPRA SEGURA
            </span>

            <h2>
              Comprá de forma simple y segura
            </h2>

            <p>
              Elegí tu producto, agregalo al
              carrito y completá tu compra de
              manera rápida y segura.
            </p>

          </div>

        </section>

      </main>

      {/* ================= CARRITO ================= */}

      <aside
        className={`carrito ${
          carritoAbierto
            ? 'carrito-abierto'
            : ''
        }`}
      >

        {/* HEADER */}

        <div className="carrito-header">

          <div>

            <h2>
              Tu carrito
            </h2>

            <p>
              {cantidadProductos}{' '}
              {cantidadProductos === 1
                ? 'producto'
                : 'productos'}
            </p>

          </div>

          <button
            className="cerrar-carrito"
            onClick={() =>
              setCarritoAbierto(false)
            }
          >
            ✕
          </button>

        </div>

        {/* PRODUCTOS DEL CARRITO */}

        <div className="carrito-productos">

          {carrito.length === 0 ? (

            <div className="carrito-vacio">

              <div className="carrito-vacio-icono">
                🛒
              </div>

              <h3>
                Tu carrito está vacío
              </h3>

              <p>
                Agregá productos para comenzar
                tu compra.
              </p>

              <button
                onClick={() =>
                  setCarritoAbierto(false)
                }
              >
                Ver productos
              </button>

            </div>

          ) : (

            carrito.map((producto) => (

              <div
                className="carrito-item"
                key={producto.id}
              >

                {/* FOTO */}

                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                />

                {/* INFORMACIÓN */}

                <div className="carrito-info">

                  <h3>
                    {producto.nombre}
                  </h3>

                  <strong>
                    $
                    {producto.precio.toLocaleString(
                      'es-AR'
                    )}
                  </strong>

                  {/* CANTIDAD */}

                  <div className="cantidad">

                    <button
                      onClick={() =>
                        disminuirCantidad(
                          producto.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {producto.cantidad}
                    </span>

                    <button
                      onClick={() =>
                        aumentarCantidad(
                          producto.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* ELIMINAR */}

                  <button
                    className="eliminar"
                    onClick={() =>
                      eliminarProducto(
                        producto.id
                      )
                    }
                  >
                    Eliminar
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

        {/* FOOTER */}

        {carrito.length > 0 && (

          <div className="carrito-footer">

            <div className="resumen">

              <div>

                <span>
                  Subtotal
                </span>

                <strong>
                  $
                  {total.toLocaleString(
                    'es-AR'
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Envío
                </span>

                <span className="gratis">
                  Gratis
                </span>

              </div>

            </div>

            <div className="total">

              <span>
                Total
              </span>

              <strong>
                $
                {total.toLocaleString(
                  'es-AR'
                )}
              </strong>

            </div>

            {/* ================================
                BOTÓN MERCADO PAGO
                ================================= */}

            <button
              className="checkout"
              onClick={continuarPago}
            >
              Continuar al pago
            </button>

            <button
              className="vaciar"
              onClick={vaciarCarrito}
            >
              Vaciar carrito
            </button>

          </div>

        )}

      </aside>

    </div>
  )
}

export default App
