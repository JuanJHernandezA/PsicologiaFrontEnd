# Sistema de Gestión de Citas Psicológicas — Universidad del Valle

Este repositorio contiene el **frontend** del sistema de gestión de citas psicológicas desarrollado para la Universidad del Valle. El sistema permite a estudiantes y profesionales agendar, visualizar y administrar citas de atención psicológica de forma eficiente y segura.

## Tecnologías utilizadas

- React + TypeScript
- Tailwind CSS
- Vite
- JWT para autenticación

---

##  Arquitectura del sistema

Este proyecto forma parte de una arquitectura basada en microservicios. A continuación se listan los repositorios que componen el sistema completo:

| Repositorio | Descripción | Tecnologías |
|------------|-------------|-------------|
|  [Frontend](https://github.com/univalle/citas-psicologia-frontend) | Interfaz de usuario para estudiantes y profesionales. Este repositorio. | React + TypeScript
- Tailwind CSS |
|  [Microservicio de Usuario](https://github.com/univalle/citas-psicologia-usuarios) | Gestión de usuarios, roles, autenticación y perfiles. | Java + SpringBoot |
|  [Microservicio de Citas](https://github.com/univalle/citas-psicologia-citas) | Lógica de agendamiento, disponibilidad, y manejo de citas. | Java + SpringBoot |
|  [Servidor Eureka](https://github.com/univalle/citas-psicologia-eureka) | Registro y descubrimiento de servicios (Service Registry). | Java + SpringBoot |
|  [API Gateway](https://github.com/univalle/citas-psicologia-gateway) | Puerta de entrada para todas las peticiones, con enrutamiento y seguridad. | Java + SpringBoot |

---

## Vista previa del sistema

### Pantalla de inicio

![Pantalla de inicio](https://raw.githubusercontent.com/univalle/citas-psicologia-frontend/main/docs/home.png)

###  Panel de citas

![Panel de citas](https://raw.githubusercontent.com/univalle/citas-psicologia-frontend/main/docs/citas.png)

### Perfil del usuario

![Perfil del usuario](https://raw.githubusercontent.com/univalle/citas-psicologia-frontend/main/docs/perfil.png)

---

##  Instalación

Clonar todos los repositorios, ejemplo:
```bash
git clone https://github.com/univalle/citas-psicologia-frontend.git
cd citas-psicologia-frontend
npm install
npm run dev

```
Crear .env para el FrontEnd con la credencial:
```bash
VITE_API_URL=
```

Crear .env para los microservicios de usuarios y citas con las credenciales:
```bash
DATASOURCE_URL=
DATASOURCE_USERNAME =
DATASOURCE_PASSWORD=
```

En caso de los demás repositorios, digitar el comando:
```bash
./mvnw spring-boot:run
```



