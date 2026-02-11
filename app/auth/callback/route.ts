return NextResponse.redirect(
  new URL(`/auth/login?error=${encodeURIComponent(message)}`, origin)
);
