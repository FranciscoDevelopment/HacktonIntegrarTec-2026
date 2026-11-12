# Antojo Gourmet

> Seis amigos, cuarenta minutos y nadie sabe qué pedir. Antojo Gourmet lo resuelve mediante algunos clicks.Sazonando a tono con los platillos más típicos de Argentina.


**Pabellón:** Molestias Cotidianas
**Ingrediente improbable:** Puntaje o ranking, con el clima como jurado extra

## El problema

Un grupo de 5 o 6 personas quiere pedir comida y nadie se decide. Uno dice "me da igual", otro no quiere pizza otra vez, otro quiere algo liviano, y pasan 40 minutos sin que nadie pida nada.

## La solución

Cada integrante marca cuántas ganas tiene de cada tipo de comida. Antojo Gourmet suma los votos, consulta la temperatura actual y arma un ranking de platos típicos argentinos. El que queda primero es el que se pide.

La votación tiene un reloj de 40 minutos, justo el tiempo que un grupo tarda en no decidir nada. Cuando llega a cero, Antojo Gourmet decide con los votos que haya.

Lo que lo vuelve distinto es que **el clima también vota**. Cuanto más frío hace, más puntos suman los platos contundentes. Cuanto más calor, más suman los fitness.

## Cómo decide

**1. Ganas por categoría.** Cada persona marca pocas, medias o muchas ganas para seis categorías: salado, dulce, vegetariano, vegano, carnívoro y de harinas. Los puntos de todos se suman por categoría.

| Ganas  | Puntos |
| ------ | ------ |
| Pocas  | 1      |
| Medias | 2      |
| Muchas | 3      |

**2. Fitness o contundente.** Cada persona elige si quiere algo fitness (liviano) o contundente (abundante, de esos que te dejan tirado en el sillón). Cada elección suma 1 punto a ese estilo.

**3. El reloj.** La votación dura como máximo 40 minutos y el tiempo restante se ve en pantalla. Mientras corre, cada comensal puede cargar y cambiar sus votos en todas las instancias: las seis categorías y la elección entre fitness o contundente. Si todos ya votaron, se puede tocar **Decidir** antes de que termine. Si el reloj llega a cero, la votación se cierra sola y se decide con lo que haya. Las categorías que nadie tocó cuentan como "medias", y quien no eligió estilo no suma a ninguno.

**4. El voto del clima (automático por razones climáticas).** Se consulta la temperatura actual con la API de [Open-Meteo](https://open-meteo.com/). Por cada grado por debajo de 20 °C, Contundente suma 0,1 punto. Por cada grado por encima de 20 °C, Fitness suma 0,1 punto. El tope es 1 punto: el clima pesa, como mucho, lo mismo que un comensal más.

| Temperatura | Bonus del clima        |
| ----------- | ---------------------- |
| 8 °C        | Contundente +1 (tope)  |
| 16 °C       | Contundente +0,4       |
| 20 °C       | Nadie                  |
| 26 °C       | Fitness +0,6           |

**5. El ranking.** Cada plato de la carta tiene sus categorías y su estilo. Por ejemplo, la milanesa napolitana con fritas es salada, carnívora y contundente. Su puntaje es el promedio de los puntos de sus categorías más los puntos de su estilo. Los platos se ordenan de mayor a menor y el primero gana.

La carta incluye platos típicos argentinos como milanesa napolitana, empanadas, locro, ñoquis con tuco, tarta de verdura, choripán y flan con dulce de leche.

## Cómo probarlo

1. Abrí Antojo Gourmet en el navegador, cargá entre 5 y 6 nombres y tocá **Empezar la votación**. Arranca el reloj de 40 minutos.
2. Si el navegador pide tu ubicación, aceptá para que el clima sea el de tu zona. Si no, se usa el de Buenos Aires.
3. Para cada comensal, marcá cuántas ganas tiene de cada categoría y elegí Fitness o Contundente. Todo arranca en "medias", así que solo cambiás lo que importa.
4. Tocá **Decidir ahora**, o esperá a que el reloj llegue a cero.
5. Vas a ver la temperatura actual, cuántos puntos aportó el clima y el ranking de platos con el ganador arriba de todo.

## Cómo ejecutarlo

Necesitás Node.js 20 o más nuevo y [pnpm](https://pnpm.io/). Se levantan dos servidores, cada uno en su terminal.

**Back (NestJS), en el puerto 3001:**

```bash
cd backend
pnpm install
cp .env.example .env
pnpm start:dev
```

**Front (Next.js), en el puerto 3000:**

```bash
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
```

Después abrí <http://localhost:3000>. Para correr los tests del puntaje: `cd backend && pnpm test`.

## Cómo está armado

| Parte | Tecnología | Qué hace |
| ----- | ---------- | -------- |
| `backend/` | NestJS 11 | Carta de platos, cálculo del puntaje y consultas a las APIs públicas |
| `frontend/` | Next.js 16, React 19, Tailwind 4 | Pantallas de comensales, votación y resultado |
| Estado del front | zustand + localStorage | Guarda comensales, votos y reloj hasta 60 minutos, aunque recargues la página |

Endpoints del back:

| Método | Ruta | Qué devuelve |
| ------ | ---- | ------------ |
| `GET` | `/dishes` | La carta completa, con foto y descripción de cada plato |
| `GET` | `/weather?latitude=&longitude=` | La temperatura actual y el voto del clima |
| `POST` | `/decision` | Recibe los votos y devuelve el ganador, el ranking y el detalle del puntaje |

APIs públicas que consulta (ninguna pide clave):

- **[Open-Meteo](https://open-meteo.com/):** la temperatura actual. Si el navegador no comparte la ubicación, usa la de Buenos Aires.
- **[Wikipedia](https://es.wikipedia.org/):** la foto y la descripción de cada plato. Si no responde, los platos se muestran con su emoji y el resultado sale igual.

## Herramientas de IA utilizadas

**Claude Code (Claude Opus 5.5):** para redactar este README, proponer la fórmula del clima y generar la mayor parte del código del back y del front.
