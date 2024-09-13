/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";

import { AuthenticationProvider } from "./context/AuthenticationContext";
import routes from "./routes/routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AuthenticationProvider>
			<RouterProvider router={routes} />
		</AuthenticationProvider>
	</React.StrictMode>,
);
