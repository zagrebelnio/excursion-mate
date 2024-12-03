'use client';
import Link from 'next/link';

function RegistrationForm() {
  return (
    <form>
      <h2>Створити акаунт</h2>
      <label>Email</label>
      <input type="email" placeholder="Email" />
      <label>Password</label>
      <input type="password" placeholder="Password" />
      <button type="submit">Зареєструватися</button>
      <p>або</p>
      <button>Зареєструватися з Google</button>
      <button>Зареєструватися з Facebook</button>
      <p>Вже маєте акаунт?</p>
      <Link href="/auth?mode=login">Увійти</Link>
    </form>
  );
}

export default RegistrationForm;