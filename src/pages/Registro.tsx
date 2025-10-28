import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'
import { registerUser } from '../api'
import { useApiWithAuth } from '../hooks/useApiWithAuth'

function Registro() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        birthDate: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [birthDateError, setBirthDateError] = useState('');
    const { handleApiCall } = useApiWithAuth();
    const navigate = useNavigate();

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

        return age > 16;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

        // Build payload matching backend DTO
        const payload = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            lastName: (document.getElementById('surname') as HTMLInputElement).value,
            birthDate: formData.birthDate,
            gender: (document.getElementById('genre') as HTMLSelectElement).value === 'male' ? 'M' : (document.getElementById('genre') as HTMLSelectElement).value === 'female' ? 'F' : 'Otro',
            phone: (document.getElementById('phone') as HTMLInputElement).value,
            studentCode: (document.getElementById('code-est') as HTMLInputElement).value || null,
            identityDocument: (document.getElementById('id') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            role: 'Estudiante',
            password: formData.password,
        }

        const success = await handleApiCall(
            async () => {
                await registerUser(payload as any);
                return true;
            },
            'Registro exitoso. Por favor inicia sesión.'
        );

        if (success) {
            navigate('/login');
        }
    };

    return (
        <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-red-600 to-red-800 overflow-hidden py-8 px-4 sm:py-12 sm:px-6 lg:py-20">
            <div className="absolute inset-0 z-0 opacity-20">
                <img 
                    src="/src/assets/images/hero-bg.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="container mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl lg:max-w-5xl z-10">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Registrate</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="name">Nombre</label>
                            <input className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" type="text" id="name" name="name" placeholder="Tu nombre" required />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="surname">Apellido</label>
                            <input className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" type="text" id="surname" name="surname" placeholder="Tu apellido" required />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="birth-date">Fecha de nacimiento</label>
                            <input
                                className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                type="date"
                                id="birth-date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                required 
                            />
                            {birthDateError && <p className="text-red-500 text-xs mt-1">{birthDateError}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="genre">Género</label>
                            <select className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" id="genre" name="genre" defaultValue="" required>
                                <option value="" disabled>Seleccione</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="phone">Teléfono</label>
                            <input className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" type="text" id="phone" name="phone" placeholder="Tu teléfono" required />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="id">Documento de identidad</label>
                            <input className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" type="text" id="id" name="id" placeholder="Tu documento" required />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="code-est">Código estudiantil</label>
                            <input 
                                className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" 
                                type="text" 
                                id="code-est" 
                                name="code-est" 
                                placeholder="EJ: 202012345" 
                                maxLength={9}
                                minLength={9} 
                                pattern="\d{9}" 
                                required 
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="email">Correo electrónico</label>
                            <input className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" type="email" id="email" name="email" placeholder="tucorreo@correounivalle.edu.co" required />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="password">Contraseña</label>
                            <input
                                className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder='Tu contraseña'
                                required 
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5" htmlFor="confirmPassword">Confirmar contraseña</label>
                            <input
                                className="w-full p-2 sm:p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder='Confirma tu contraseña'
                                required 
                            />
                            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-center sm:justify-between pt-2">
                            <a href="/login" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline transition">¿Ya tienes una cuenta?</a>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <button className="w-full bg-red-600 text-white p-2.5 sm:p-3 text-sm sm:text-base rounded-md hover:bg-red-700 transition font-medium shadow-md hover:shadow-lg" type="submit">Registrarte</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Registro;