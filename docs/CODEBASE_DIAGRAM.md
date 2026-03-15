# Laravel App — Codebase Diagram

High-level and layered views of the codebase (Laravel 12 API + Vue 3 SPA).

---

## 1. High-level architecture

```mermaid
flowchart TB
    subgraph Browser
        Vue["Vue 3 SPA\n(Vite)"]
    end

    subgraph Laravel["Laravel 12"]
        Web["Web routes\n(SPA fallback)"]
        API["API routes\n(/api/*)"]
        Sanctum["Laravel Sanctum\n(auth + CSRF)"]
    end

    subgraph Data
        DB[(Database\nSQLite/MySQL)]
    end

    Vue -->|"GET /*"| Web
    Vue -->|"API + Cookie"| API
    API --> Sanctum
    API --> DB
```

- **Web**: `routes/web.php` serves the SPA for all paths (`/{any}` → `app` view).
- **API**: `routes/api.php` defines REST endpoints; protected routes use `auth:sanctum`.
- **Sanctum**: stateful API auth (session/cookies) and CSRF for the SPA.

---

## 2. Backend (Laravel) structure

```mermaid
flowchart LR
    subgraph Routes["routes/"]
        WebR["web.php\nSPA catch-all"]
        ApiR["api.php\nAuth + CRUD"]
    end

    subgraph Controllers["app/Http/Controllers/Api/"]
        AuthC["AuthController\nlogin, logout, user"]
        UserC["UserController\nindex, store, show, update, destroy"]
        CompanyC["CompanyController\nindex, store, show, update, destroy"]
    end

    subgraph Models["app/Models/"]
        User["User"]
        Company["Company"]
    end

    subgraph Http["app/Http/"]
        Req["Form Requests\nStore/Update User & Company"]
        Res["API Resources\nUserResource, CompanyResource"]
    end

    ApiR --> AuthC
    ApiR --> UserC
    ApiR --> CompanyC
    UserC --> User
    CompanyC --> Company
    UserC --> Req
    CompanyC --> Req
    UserC --> Res
    CompanyC --> Res
```

- **Controllers**: `AuthController` (login, logout, user), `UserController` and `CompanyController` (apiResource).
- **Models**: `User` (auth), `Company` (CRUD); no relation between them in the current code.
- **Http**: Form Requests for validation; Resources for JSON shaping.

---

## 3. API route map

```mermaid
flowchart TB
    subgraph Public["Public"]
        POST_login["POST /api/login"]
        POST_logout["POST /api/logout\n(auth:sanctum)"]
    end

    subgraph Protected["Protected (auth:sanctum)"]
        GET_user["GET /api/user"]
        users["/api/users\nindex, store, show, update, destroy"]
        companies["/api/companies\nindex, store, show, update, destroy"]
    end

    POST_login --> AuthController
    POST_logout --> AuthController
    GET_user --> AuthController
    users --> UserController
    companies --> CompanyController
```

---

## 4. Frontend (Vue) structure

```mermaid
flowchart TB
    subgraph Entry["Entry"]
        app_js["app.js"]
        App_vue["App.vue"]
    end

    subgraph Router["router/index.js"]
        Routes["/ login, /, /users,\n/companies, /leagues,\n/settings"]
        Guard["beforeEach\nauth + fetchUser"]
    end

    subgraph Store["stores/"]
        AuthStore["useAuthStore\nuser, login, logout, fetchUser"]
    end

    subgraph Pages["pages/"]
        Login["LoginPage"]
        Dashboard["DashboardPage"]
        Users["UsersPage"]
        Companies["CompaniesPage"]
        Leagues["LeaguesPage"]
        Settings["SettingsPage"]
    end

    subgraph Layout["components/"]
        MainLayout["MainLayout"]
        Sidebar["Sidebar"]
        CrudHeader["CrudPageHeader"]
        Table["IndexTable, IndexTableRow, IndexTableCell"]
        Modals["BaseModal, ConfirmModal\nUserFormModal, CompanyFormModal"]
        Forms["UserForm, CompanyForm\nFormInput, AppButton"]
    end

    subgraph Composables["composables/"]
        useUsers["useUsers"]
        useCompanies["useCompanies"]
        useNavItems["useNavItems"]
    end

    app_js --> App_vue
    App_vue --> Router
    App_vue --> MainLayout
    Router --> AuthStore
    Router --> Pages
    MainLayout --> Sidebar
    MainLayout --> router_view["<router-view>"]
    Users --> useUsers
    Companies --> useCompanies
    Sidebar --> useNavItems
```

- **App.vue**: Shows loading until router is ready; then either `MainLayout` (authenticated) or `<router-view>` (e.g. login).
- **Router**: All app routes plus `beforeEach` that runs `fetchUser` once and enforces `requiresAuth` / `requiresGuest`.
- **Auth**: Pinia `useAuthStore` talks to `/api/login`, `/api/logout`, `/api/user` and drives auth state.
- **Pages**: One page per main section; Users and Companies use composables for API + UI state.
- **Components**: Shared layout, sidebar, CRUD header, table primitives, modals, and form pieces.

---

## 5. Request flow (authenticated CRUD)

```mermaid
sequenceDiagram
    participant Page as UsersPage / CompaniesPage
    participant Composable as useUsers / useCompanies
    participant API as Laravel API
    participant Controller as *Controller
    participant Model as User / Company

    Page->>Composable: load list / create / update / delete
    Composable->>API: axios get/post/put/delete /api/users|companies
    API->>API: auth:sanctum
    API->>Controller: method
    Controller->>Model: query / create / update / delete
    Model-->>Controller: result
    Controller->>Composable: JSON (Resource)
    Composable-->>Page: data + refs
```

---

## 6. Directory tree (relevant parts)

```
laravel-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/   → AuthController, UserController, CompanyController
│   │   ├── Requests/          → Store/Update User & Company
│   │   └── Resources/         → UserResource, CompanyResource
│   ├── Models/                → User, Company
│   └── Providers/
├── bootstrap/app.php          → Web + API routes, statefulApi()
├── config/
├── database/
│   ├── migrations/            → users, companies, personal_access_tokens, cache, jobs
│   ├── factories/
│   └── seeders/
├── public/
├── resources/
│   ├── js/
│   │   ├── App.vue
│   │   ├── app.js
│   │   ├── router/index.js
│   │   ├── stores/useAuthStore.js
│   │   ├── composables/       → useUsers, useCompanies, useNavItems
│   │   ├── pages/             → Login, Dashboard, Users, Companies, Leagues, Settings
│   │   └── components/        → layout, table, modals, forms
│   ├── views/app.blade.php    → SPA root view
│   └── css/
├── routes/
│   ├── web.php                → SPA catch-all
│   └── api.php                → auth + users + companies
└── tests/
```

---

You can render the Mermaid blocks in GitHub, VS Code (with a Mermaid extension), or [mermaid.live](https://mermaid.live).
