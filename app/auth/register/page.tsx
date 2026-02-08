import RegisterForm from "./register-form";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const nextPath = searchParams?.next || "/dashboard";
  const err = searchParams?.error ? decodeURIComponent(searchParams.error) : "";

  return <RegisterForm nextPath={nextPath} err={err} />;
}
