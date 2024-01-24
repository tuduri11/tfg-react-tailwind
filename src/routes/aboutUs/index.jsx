import React from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
export default function AboutUs() {
  return (
    <>
      <div><Navbar></Navbar></div>
      <div className="bg-white dark:bg-gray-900 dark:text-gray-100">
        <div className="container mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <div className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">
              Te contamos
            </div>
            <h2 className="text-4xl font-black text-black dark:text-white">
              SOBRE NOSOTROS
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            En [Nombre de la Página Web], creemos firmemente que las matemáticas son más que solo números y fórmulas; son la clave para entender el mundo que nos rodea. Nuestro objetivo es simplificar el aprendizaje de las matemáticas para estudiantes universitarios de todo el mundo, proporcionando una plataforma interactiva y automatizada que hace que resolver ejercicios y entender conceptos complejos sea más fácil y accesible que nunca.
            </p>
          </div>
          {/* END Heading */}

          {/* Cada explicación */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h4 className="mb-2  text-lg font-semibold">
                Nuestra Misión
              </h4>
              <p className="leading-relaxed  text-lg text-gray-600 dark:text-gray-400">
                En [Nombre de la Página Web], creemos firmemente que las matemáticas son más que solo números y fórmulas; son la clave para entender el mundo que nos rodea. Nuestro objetivo es simplificar el aprendizaje de las matemáticas para estudiantes universitarios de todo el mundo, proporcionando una plataforma interactiva y automatizada que hace que resolver ejercicios y entender conceptos complejos sea más fácil y accesible que nunca.
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-lg font-semibold">
                Como funciona?
              </h4>
              <p className="leading-relaxed text-lg text-gray-600 dark:text-gray-400">
                [Nombre de la Página Web] utiliza algoritmos sofisticados para generar ejercicios de matemáticas adaptados a diversos niveles y áreas de estudio. Desde álgebra hasta cálculo avanzado, nuestra plataforma cubre una amplia gama de temas, asegurando que los estudiantes puedan practicar y mejorar en las áreas específicas que necesitan. Además, con explicaciones paso a paso y retroalimentación instantánea, los estudiantes pueden aprender de sus errores y fortalecer sus habilidades matemáticas de manera efectiva.
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-lg font-semibold">
                Nuestro equipo
              </h4>
              <p className="leading-relaxed text-lg text-gray-600 dark:text-gray-400">
                Detrás de [Nombre de la Página Web] hay un equipo dedicado de educadores, matemáticos, e ingenieros de software, todos apasionados por hacer que el aprendizaje de las matemáticas sea más accesible y agradable. Trabajamos incansablemente para asegurar que nuestra plataforma sea a la vez innovadora y fácil de usar.
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-lg font-semibold">
                Comprometidos con la Excelencia Educativa
              </h4>
              <p className="leading-relaxed text-lg text-gray-600 dark:text-gray-400">
                En [Nombre de la Página Web], estamos comprometidos con la excelencia educativa y continuamente actualizamos y expandimos nuestras herramientas y recursos para asegurar que los estudiantes tengan lo mejor para su aprendizaje. Ya sea para prepararse para un examen, mejorar en un curso específico, o simplemente para explorar el fascinante mundo de las matemáticas, nuestra plataforma está aquí para apoyarte en cada paso del camino.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}