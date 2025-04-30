# DrugWarehouseManagement_FE

## Project Description

DrugWarehouseManagement_FE is a React-based web application designed to streamline and manage drug warehouse operations. Key features include:

-   **Inventory Management:** Track drug quantities, expiration dates, and storage locations.
-   **Order Processing:** Create, manage, and fulfill drug orders.
-   **Reporting:** Generate reports on inventory levels, order history, and other relevant metrics.
-   **User Authentication:** Secure access with user roles and permissions.
-   **Search and Filtering:** Quickly locate drugs and orders based on various criteria.

## Getting Started

Follow these instructions to set up your development environment and run the application:

### Prerequisites

-   [Node.js](https://nodejs.org/) (version >= 18)
-   [npm](https://www.npmjs.com/) (Node Package Manager, installed with Node.js) or [Yarn](https://yarnpkg.com/)

### Installation

1.  Clone the repository:
    bash
    npm init
    The following scripts are available in the `package.json` file:

-   `npm start` or `yarn start`: Runs the application in development mode.  It uses Vite to serve the application with hot reloading.
-   `npm run build` or `yarn build`: Builds the application for production.  It generates optimized static assets in the `dist` directory.
-   `npm run serve` or `yarn serve`:  Serves the built application from the `dist` directory.  Useful for testing the production build locally.
-   `npm run lint` or `yarn lint`:  Runs ESLint to analyze the code for potential errors and style issues.

## Configuration

The application relies on the following environment variables.  Create a `.env` file in the root directory of the project and define the variables there.
```
VITE_API_BASE_URL= "YOUR-BACKEND"
```
## Contributing

We welcome contributions from the community! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Follow the code style and testing guidelines.
4.  Submit a pull request.


## Key Folder Descriptions

*   **`public/`**: Contains static files that are copied directly to the build output folder without processing by Vite. Useful for `index.html`, favicons, and `manifest.json`.
*   **`src/`**: The heart of the application, containing all the source code written for the project.
    *   **`api/`**: Centralizes API logic, defining endpoints and configuring the API client (like Axios).
    *   **`assets/`**: Stores images, fonts, SVGs, etc., that are imported and used within React components.
    *   **`components/`**: Holds reusable UI pieces (buttons, modals, selectors, layout) used throughout the application.
    *   **`hooks/`**: Contains custom React Hooks to encapsulate stateful logic, side effects, and API data fetching/mutation logic.
    *   **`lib/`**: Setup and configuration for libraries like React Query.
    *   **`pages/`**: Each subfolder typically represents a major feature or route in the application, containing the main component for that view.
    *   **`routes/`**: Defines how URLs map to page components and handles route protection.
    *   **`types/`**: Contains all TypeScript type definitions and interfaces for data structures used in the app.
    *   **`utils/`**: A collection of helper functions for common tasks like date formatting, string manipulation, status translation, etc.

### Code Style

-   Follow the ESLint rules defined in the `.eslintrc.js` file.
-   Use consistent formatting (e.g., Prettier).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

-   This project uses [Ant Design](https://ant.design/) for UI components.
-   [React Query](https://tanstack.com/query/latest) for data fetching and caching.
-   Create React App for project scaffolding.

## Contact

For questions or support, please contact:

> [Nguyễn Quý Đức Minh] - [minhnqdse2003@gmail.com]
