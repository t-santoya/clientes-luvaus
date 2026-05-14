import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./Formulario.css";
import logo from "./assets/logo.png";

function Formulario() {
    const [datos, setDatos] = useState({
        nombre: "",
        telefono: "",
        informacion: "",
        compra: "no",
        cedula: "",
    });

    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value,
        });
    };

    // Buscar cliente solo si hay cédula
    const buscarCliente = async (cedula) => {
        if (!cedula || cedula.trim() === "") return;

        const q = query(
            collection(db, "clientes"),
            where("cedula", "==", cedula)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            let ultimo = null;

            querySnapshot.forEach(doc => {
                const data = doc.data();
                const fecha = data.fecha?.toDate
                    ? data.fecha.toDate()
                    : new Date(data.fecha);

                if (!ultimo || fecha > ultimo.fecha) {
                    ultimo = { ...data, fecha };
                }
            });

            if (ultimo) {
                setDatos((prev) => ({
                    ...prev,
                    nombre: ultimo.nombre || "",
                    telefono: ultimo.telefono || "",
                    informacion: "",   // Siempre se limpia la info nueva
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔥 Validación condicional: si compró, la cédula es obligatoria
        if (datos.compra === "si" && (!datos.cedula || datos.cedula.trim() === "")) {
            alert("⚠️ Si el cliente realizó una compra, la cédula es obligatoria.");
            return;
        }

        try {
            await addDoc(collection(db, "clientes"), {
                nombre: datos.nombre,
                telefono: datos.telefono,
                informacion: datos.informacion || "",
                compra: datos.compra,
                cedula: datos.cedula || "",    // Si no hay cédula, guarda string vacío
                fecha: new Date(),
            });

            alert("Cliente guardado correctamente ✅");

            setDatos({
                nombre: "",
                telefono: "",
                informacion: "",
                compra: "no",
                cedula: "",
            });
        } catch (error) {
            console.error(error);
            alert("Error al guardar ❌");
        }
    };

    return (
        <div className="contenedor">
            <div className="tarjeta">
                <img src={logo} alt="Logo" className="logo" />
                <h2 className="titulo">Registro de Clientes</h2>

                <form className="formulario" onSubmit={handleSubmit}>
                    <input
                        className="input"
                        name="nombre"
                        placeholder="Nombre"
                        value={datos.nombre}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input"
                        name="telefono"
                        placeholder="Teléfono"
                        value={datos.telefono}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        className="input"
                        name="informacion"
                        placeholder="Información "
                        value={datos.informacion}
                        onChange={handleChange}
                        rows="3"
                    />

                    {/* COMPRA */}
                    <div className="radio-group">
                        <p>¿Realizó compra?</p>
                        <label>
                            <input
                                type="radio"
                                name="compra"
                                value="si"
                                checked={datos.compra === "si"}
                                onChange={handleChange}
                            />
                            Sí
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="compra"
                                value="no"
                                checked={datos.compra === "no"}
                                onChange={handleChange}
                            />
                            No
                        </label>
                    </div>

                    {/* CÉDULA - Ya no es required */}
                    <input
                        className="input"
                        name="cedula"
                        placeholder="Cédula "
                        value={datos.cedula}
                        onChange={handleChange}
                        onBlur={(e) => buscarCliente(e.target.value)}
                    />

                    <button className="boton" type="submit">
                        Guardar cliente
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Formulario;