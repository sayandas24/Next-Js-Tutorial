'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function page() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-blue-600 rounded-xl py-3 px-5" onClick={() => signIn()}>Sign in</button>
    </>
  )
}