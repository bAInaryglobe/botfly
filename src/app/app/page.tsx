import AuthGuard from "@/components/AuthGuard";

export default function AppPage() {
  return (
    <AuthGuard>
      <main style={{ padding: 32 }}>
        <h1>Welcome to the App!</h1>
        <p>You are now logged in.</p>
      </main>
    </AuthGuard>
  );
}
