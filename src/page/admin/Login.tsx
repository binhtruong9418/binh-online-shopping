import DysonApi from "../../axios/DysonApi.ts"
import { useState } from "react"
import { toast } from "react-toastify"
import { useConnection } from "../../redux/connection"
import { useNavigate } from "react-router-dom"
const Login = () => {
    const [email, setEmail] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const navigate = useNavigate()
    const { onSetJwtToken } = useConnection()
    const handleLogin = async () => {
        if(!email || !code) return toast.error("Please enter email and code")
        try {
            const data = await DysonApi.login(email, code)
            if (data.message === "Login successfully" && (data.user.role.includes("admin") || data.role.includes("super-admin"))) {
                toast.success("Login successfully")
                onSetJwtToken(data.jwt)
                localStorage.setItem("userInfo", JSON.stringify(data.user))
                navigate("/admin")
            }
        } catch (error: any) {
            toast.error(error.error || "Error login")
        }
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-8 col-lg-8 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Admin Login</h1>
                                            </div>
                                            <form className="user">
                                                <div className="form-group">
                                                    <input type="email"
                                                        className="form-control form-control-user"
                                                        id="exampleInputEmail"
                                                        aria-describedby="emailHelp"
                                                        placeholder="Email" value={email} onChange={
                                                            (e) => setEmail(e.target.value)
                                                        } />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="password"
                                                        className="form-control 
                                                        form-control-user"
                                                        id="exampleInputPassword"
                                                        placeholder="Password"
                                                        value={code}
                                                        onChange={
                                                            (e) => setCode(e.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div className="btn btn-primary btn-user btn-block" onClick={handleLogin}>
                                                    Login
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login