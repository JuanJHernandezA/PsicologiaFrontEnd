import '../index.css'
function Login() {
    return (
        <div className="flex items-center justify-center h-screen bg-red-600">
  <div className="bg-white p-10 rounded shadow-md w-full max-w-xl mx-4">
    <h1 className="text-xl font-bold mb-4 text-center">Inicia Sesión</h1>
    <hr className="mb-4" />
    <form>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="email">Correo</label>
        <input className="w-full p-2 border border-gray-300 rounded" type="text" id="email" name="email" />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
        <input className="w-full p-2 border border-gray-300 rounded" type="password" id="password" name="password" />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <a href="/registro" className="text-sm text-blue-600 hover:underline mb-4 inline-block">¿No tienes una cuenta?</a>
        <a href="/recuperarContrasena" className="text-sm text-red-600 hover:underline mb-4 inline-block">¿Olvidaste tu contraseña?</a>
      </div>
      
      
      <button className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700" type="submit">Iniciar Sesión</button>
    </form>
  </div>
</div>

    );
}
export default Login;
