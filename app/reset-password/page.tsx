import { redirect } from 'next/navigation';

export default function ResetPasswordRedirect({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : '';
  if (token) {
    redirect(`/auth/reset-password?token=${encodeURIComponent(token)}`);
  }
  redirect('/auth/reset-password');
}
