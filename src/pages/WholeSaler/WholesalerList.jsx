import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerWholesaler, getMyWholesalerProfile} from "../../services/wholesaler"
import { toast } from "react-toastify"

const RegisterWholesaler = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shopName: "",
    contactNumber: "",
    address: "",
    gstNumber: "",
  })

  const [loading, setLoading] = useState(true)

  // 🔹 Check if already registered
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await getMyWholesalerProfile()

        if (
          res?.status === "success" &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          navigate("/wholesaler")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkProfile()
  }, [navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submit = async (e) => {
    e.preventDefault()

    if (
      !form.shopName ||
      !form.contactNumber ||
      !form.address ||
      !form.gstNumber
    ) {
      toast.error("All fields are required")
      return
    }

    try {
      const result = await registerWholesaler(form)

      if (result?.status === "success") {
        toast.success("Registration successful")
        navigate("/wholesaler")
      } else {
        toast.error(result?.error || "Registration failed")
      }
    } catch (err) {
      console.error(err)
      toast.error("Server error")
    }
  }

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>
  }

  return (
    <div className="container w-50 mt-4">
      <h3 className="mb-3">Wholesaler Registration</h3>

      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          name="shopName"
          placeholder="Shop Name"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="contactNumber"
          placeholder="Contact Number"
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-2"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="gstNumber"
          placeholder="GST Number"
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  )
}

export default RegisterWholesaler
