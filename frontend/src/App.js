import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Footer from './components/Footer'
import Header from './components/Header'
import CartScreen from './screen/CartScreen'
import HomeScreen from './screen/HomeScreen'
import LoginScreen from './screen/LoginScreen'
import OrderListScreen from './screen/OrderListScreen'
import OrderScreen from './screen/OrderScreen'
import PaymentScreen from './screen/PaymentScreen'
import PlaceOrderScreen from './screen/PlaceOrderScreen'
import ProductCreateScreen from './screen/ProductCreateScreen'
import ProductEditScreen from './screen/ProductEditScreen'
import ProductListScreen from './screen/ProductListScreen'
import ProductScreen from './screen/ProductScreen'
import ProfileScreen from './screen/ProfileScreen'
import RegisterScreen from './screen/RegisterScreen'
import ShippingScreen from './screen/ShippingScreen'
import UserEditScreen from './screen/UserEditScreen'
import UserListScreen from './screen/UserListScreen'
import ForgotPasswordScreen from './screen/ForgotPasswordScreen'
import ResetPasswordScreen from './screen/ResetPasswordScreen'

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route path='/order/:id' component={OrderScreen} />
          <Route path='/shipping' component={ShippingScreen} />
          <Route path='/payment' component={PaymentScreen} />
          <Route path='/placeorder' component={PlaceOrderScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/forgotpassword' component={ForgotPasswordScreen} />
          <Route
            path='/passwordreset:/resetToken'
            component={ResetPasswordScreen}
          />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/product/:id' component={ProductScreen} />
          <Route path='/cart/:id?' component={CartScreen} />
          <Route path='/admin/userlist' component={UserListScreen} />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} />
          <Route
            path='/admin/productlist'
            component={ProductListScreen}
            exact
          />
          <Route path='/admin/products' component={ProductCreateScreen} exact />
          <Route
            path='/admin/productlist/:pageNumber'
            component={ProductListScreen}
            exact
          />
          <Route path='/admin/product/:id/edit' component={ProductEditScreen} />
          <Route path='/admin/orderlist' component={OrderListScreen} />
          <Route path='/search/:keyword' component={HomeScreen} exact />
          <Route path='/page/:pageNumber' component={HomeScreen} exact />
          <Route
            path='/search/:keyword/page/:pageNumber'
            component={HomeScreen}
            exact
          />
          <Route path='/' component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
