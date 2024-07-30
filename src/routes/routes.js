import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassowrd from '../pages/ForgotPassowrd'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct'
import UserInfo from '../pages/UserInfo'
import AllSupplier from '../pages/AllSupplier'
import AllImportOrder from '../pages/AllImportOrder'
import AllWarehouse from '../pages/AllWarehouse'
import Payment from '../pages/Payment'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassowrd/>
            },
            {
                path : "sign-up",
                element : <SignUp/>
            },
            {
                path : "product-category",
                element : <CategoryProduct/>
            },
            {
                path : "product/:id",
                element : <ProductDetails/>
            },
            {
                path : 'cart',
                element : <Cart/>,
                children : [
                    {
                        path : "payment",
                        element : <Payment/>
                    }
                ]
            },
            {
                path : "search",
                element : <SearchProduct/>
            },
            {
                path : "admin-panel",
                element : <AdminPanel/>,
                children : [
                    {
                        path : "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path : "all-products",
                        element : <AllProducts/>
                    },
                    {
                        path : "all-supplier",
                        element: <AllSupplier/>
                    },
                    {
                        path : "all-importOrder",
                        element: <AllImportOrder/>
                    },
                    {
                        path : "all-warehouse",
                        element: <AllWarehouse />
                    }
                ]
            },
            {
                path : "user-info",
                element: <UserInfo />
            },
            // {
            //     path: "payment",
            //     element: <Payment />
            // }
        ]
    }
])


export default router