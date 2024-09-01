import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import { Home } from './pages/Home'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Posts } from './pages/Posts'
import { UserPage } from './pages/UserPage'
import { Loading } from './pages/Loading'

import PrivateRoute from './PrivateRoute'
import AuthRoute from './AuthRoute'
import { PostPage } from './pages/PostPage'


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />

                    <Route path='/login' element={<AuthRoute />} >
                        <Route path='/login' element={<SignIn />} />
                    </Route>

                    <Route path='/signup' element={<AuthRoute />} >
                        <Route path='/signup' element={<SignUp />} />
                    </Route>

                    <Route path='/posts' element={<PrivateRoute />} >
                        <Route path='/posts' element={<Posts />} />
                    </Route>

                    <Route path='/post/:id' element={<PrivateRoute />} >
                        <Route path='/post/:id' element={<PostPage />} />
                    </Route>

                    <Route path='/user/:id' element={<UserPage />} />

                    <Route path='/loading' element={<Loading />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App