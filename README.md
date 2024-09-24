## Vehicle tracker using [Leaflet](https://react-leaflet.js.org/)

Checkout the website [here](https://leaflet-vehicle-tracker.vercel.app)

-   client request data by providing limit in query parameter, for example `?limit=15`.
-   server sends coordinates (dummy data) with limit, example:
    `[{"latitude":25.4467666,"longitude":81.8512934,"timestamp":"2024-07-20T10:00:00Z"}]`
-   the vehicle moves the given coods, while it's routes is tracked
-   Made uisng react-leaflet library
-   Server [repositry](https://github.com/TahaHameed23/lvt-backend)
