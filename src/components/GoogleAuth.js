import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import { useGoogleLogin } from 'react-use-googlelogin'

const GoogleAuthContext = React.createContext()

function GoogleAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      const res = await axios.get('/api/auth/user')
      // TODO: some err handling

      if(res.data) {
        setUser(res.data)
      }
      setLoading(false)
    }

    if(loading) {
      fetchUser()
    }
  }, [user, loading])

  const logIn = async (googleData) => {
    const res = await axios.post("/api/auth/google", {
      token: googleData.tokenId
    })

    setUser(res.data)
    // if(data.error) throw new Error(data.error)
  }

  const logOut = async () => {
    const res = await axios.delete("/api/auth/logout")

    setUser(null)
    // if(data.error) throw new Error(data.error)
  }

  return (
    <GoogleAuthContext.Provider value={{user, loading, logIn, logOut}}>
      {children}
    </GoogleAuthContext.Provider>
  )
}

const UseGoogleAuthContext = () => React.useContext(GoogleAuthContext)

export {GoogleAuthProvider, UseGoogleAuthContext}
