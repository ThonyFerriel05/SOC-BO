export type Autor = {
  nombre: string;
  rol: string;
};

export type AboutContent = {
  descripcion: string;
  autores: Autor[];
  contacto: {
    email: string;
  };
};

export const ABOUT: AboutContent = {
  descripcion:
    "SOC-BO nace de una investigación personal sobre criticalidad autoorganizada aplicada a ecosistemas del oriente boliviano, con el objetivo de ofrecer una herramienta de divulgación científica y datos abiertos accesibles para investigadores, instituciones y público general.",
  autores: [
    { nombre: "Thony Ferriel", rol: "Idea, investigación y desarrollo" },
    { nombre: "José David", rol: "Colaboración técnica e investigación" },
  ],
  contacto: {
    email: "ferrielthony@gmail.com",
  },
};
