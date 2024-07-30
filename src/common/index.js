
const backendDomin = "http://localhost:8080"

const SummaryApi = {
    signUP : {
        url : `${backendDomin}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomin}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomin}/api/all-user`,
        method : 'get'
    },
    changePassword : {
        url : `${backendDomin}/api/change-password`,
        method : "post"
    },
    uploadAddress: {
        url : `${backendDomin}/api/upload-address-delivery`,
        method : 'post'
    },
    allAddress: {
        url: `${backendDomin}/api/get-address-delivery`,
        method : 'get'
    },
    deleteAddress: {
        url : `${backendDomin}/api/delete-address-delivery`,
        method : 'post'
    },

    updateUser : {
        url : `${backendDomin}/api/update-user`,
        method : "post"
    },
    uploadProduct : {
        url : `${backendDomin}/api/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomin}/api/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/update-product`,
        method  : 'post'
    },
    deleteProduct : {
        url: `${backendDomin}/api/delete-product`,
        method : 'post'
    },
    categoryProduct : {
        url : `${backendDomin}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomin}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomin}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/view-card-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/delete-cart-product`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomin}/api/filter-product`,
        method : 'post'
    },
    allSupplier : {
        url : `${backendDomin}/api/get-supplier`,
        method : 'get'
    },
    uploadSupplier : {
        url : `${backendDomin}/api/upload-supplier`,
        method : 'post'
    },
    ProductInSupplier : {
        url : `${backendDomin}/api/get-product-supplier`,
        method : 'post'
    },
    updateSupplier : {
        url : `${backendDomin}/api/update-supplier`,
        method : 'post'
    },
    deleteSupplier : {
        url : `${backendDomin}/api/delete-supplier`,
        method : 'post'
    },

    allImportOrders : {
        url : `${backendDomin}/api/get-importOrder`,
        method : 'get'
    },
    uploadImportOrder: {
        url: `${backendDomin}/api/upload-importOrder`,
        method: 'post'
    },
    getProductsBySupplier: {
        url: `${backendDomin}/api/get-products-by-supplier`,
        method: 'post'
    },

    getProductById: {
        url: `${backendDomin}/api/get-product-by-id/`, 
        method: 'post' 
    },
    getImportOrderById:{
        url: `${backendDomin}/api/get-importOrder-by-id`,
        method: 'post'
    },
    getSupplierById: {
        url: `${backendDomin}/api/get-supplier-by-id`,
        method: 'post'
    },
    getAddressById: {
        url: `${backendDomin}/api/get-address-by-id`,
        method: 'post'
    },
    updateAddress: {
        url: `${backendDomin}/api/update-address-delivery`,
        method: 'post'
    },


    deleteImportOrder: {
        url: `${backendDomin}/api/delete-importOrder`,
        method: 'post'
    },
    checkPasswordImportOrder: {
        url: `${backendDomin}/api/check-password-import-order`,
        method: 'post'
    },
    updateImportOrder:{
        url: `${backendDomin}/api/update-importOrder`,
        method: 'post'
    },
    allWarehouse: {
        url: `${backendDomin}/api/get-warehouse`,
        method: 'get'
    },
    uploaWarehouse: {
        url: `${backendDomin}/api/upload-warehouse`,
        method: 'post'
    },
    updateWarehouse : {
        url: `${backendDomin}/api/update-warehouse`,
        method: 'post'
    },

    createOrder : {
        url : `${backendDomin}/api/create-order`,
        method : 'post'
    },
    paymentOnline : {
        url : `${backendDomin}/api/payment-online`,
        method : 'post'
    }

}
    


export default SummaryApi