# Sudoku Game

Un juego de Sudoku interactivo desarrollado con **React**, **TypeScript**, y **Vite**. Este proyecto genera puzzles con solución única y permite resolverlos automáticamente con visualización paso a paso.

---

## 🎯 Descripción

El objetivo del proyecto es implementar un tablero de Sudoku funcional que permita:
- **Generar puzzles válidos y resolvibles** con una única solución.
- **Resolver automáticamente** los puzzles mediante un algoritmo de backtracking visual.
- Ofrecer una interfaz intuitiva y estética que simule el aspecto clásico del Sudoku.

---

## ✨ Características

- **Generación de puzzles**:
  - Crea puzzles con un mínimo de pistas, garantizando una solución única.
  - Basado en un algoritmo avanzado con heurísticas para optimizar el proceso.
- **Resolución automática**:
  - Utiliza un algoritmo optimizado que prioriza las celdas con menos valores posibles (MRV).
  - Visualización en tiempo real durante el proceso de resolución.
- **Interfaz interactiva**:
  - Diseño simple y atractivo que simula un Sudoku clásico.

---

## 🚀 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone git@github.com:sierrapablo/sudoku-react-ts.git
   cd sudoku-react-ts
   ```
2. **Instalar las dependencias**:
   ```bash
   npm install
   ```
3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
4. **Abrir el navegador**: Ve a ``http://localhost:5173`` para visualizar la aplicación.

---

## 📚 Uso

- **Generar Sudoku**: Presiona el botón "Generar Sudoku" para crear un nuevo puzzle.
- **Resolver Sudoku**: Presiona "Resolver Sudoku" para iniciar la resolución automática.
- **Recargar página**: Un nuevo puzzle se genera automáticamente al recargar.

---

## 📌 Próximos pasos

- 💡 Añadir soporte para entrada manual de números.
- 💡 Implementar validación para puzzles personalizados.
- 💡 Añadir niveles de dificultad al generador de puzzles.

---

## 🎥 Vista previa

![Sudoku](src/assets/sudoku.gif)

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas o mejoras, sigue estos pasos:

  1. Crea un **fork** del repositorio.
  2. Realiza los cambios en tu repositorio.
  3. Envía un **pull request** describiendo tus cambios.

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---