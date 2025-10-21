import { useState } from 'react';
import '../index.css'

function Registro() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        birthDate: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [birthDateError, setBirthDateError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateAgeGreaterThan16 = (dateString: string) => {
        if (!dateString) return false;
        const today = new Date();
        const birth = new Date(dateString);
        if (isNaN(birth.getTime())) return false;

        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        // "mayor que 16 años" -> age must be strictly greater than 16
        return age > 16;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let hasError = false;

        if (!validateAgeGreaterThan16(formData.birthDate)) {
            setBirthDateError('Debe ser mayor de 16 años');
            hasError = true;
        } else {
            setBirthDateError('');
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            hasError = true;
        } else {
            setPasswordError('');
        }

        if (hasError) return;

        // Continuar con el registro
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-red-600">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-4 m-6">
                <h1 className="text-lg font-bold mb-4 text-center">Registrate</h1>
                <hr className="mb-4" />
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="name">Nombre</label>
                        <input className="w-full p-2 border border-gray-300 rounded" type="text" id="name" name="name" placeholder="Digite su nombre" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="surname">Apellido</label>
                        <input className="w-full p-2 border border-gray-300 rounded" type="text" id="surname" name="surname" placeholder="Digite su apellido" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="birth-date">Fecha de nacimiento</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            type="date"
                            id="birth-date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            required 
                        />
                        {birthDateError && <p className="text-red-500 text-sm mt-1">{birthDateError}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="genre"> Género</label>
                        <select className="w-full p-2 border border-gray-300 rounded" id="genre" name="genre" defaultValue="" required  >
                            <option value="" disabled>Seleccione su género</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="phone">Teléfono</label>
                        <input className="w-full p-2 border border-gray-300 rounded" type="text" id="phone" name="phone" placeholder="Digite su teléfono" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="code-est">Código estudiantil</label>
                        <input 
                            className="w-full p-2 border border-gray-300 rounded" 
                            type="text" 
                            id="code-est" 
                            name="code-est" 
                            placeholder="Digite su código estudiantil" 
                            maxLength={9}
                            minLength={9} 
                            pattern="\d{9}" 
                            required 
                        />
                       
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="id">Documento de identidad</label>
                        <input className="w-full p-2 border border-gray-300 rounded" type="text" id="id" name="id" placeholder="Digite su documento de identidad" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Correo</label>
                        <input className="w-full p-2 border border-gray-300 rounded" type="text" id="email" name="email" placeholder="Digite su correo" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder='Digite su contraseña'
                            required 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder='Confirme su contraseña'
                            required 
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <a href="/login" className="text-sm text-blue-600 hover:underline mb-4 inline-block">¿Ya tienes una cuenta?</a>
                    </div>
                    <button className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700" type="submit">Registrarte</button>
                </form>
            </div>
        </div>

    );
}
export default Registro;
