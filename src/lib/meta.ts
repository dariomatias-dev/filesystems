/** Edite aqui os dados da capa / encerramento. */
export const META = {
  titulo: "Filesystems Reais",
  subtitulo: "Sistemas de Arquivos Reais",
  disciplina: "Sistemas Operacionais",
  curso: "Análise e Desenvolvimento de Sistemas",
  instituicao: "IFPB",
  ano: "2026",
  /** Ex.: ["Fulano de Tal", "Ciclana Souza"] — aparece na capa e no encerramento */
  cursoCurto: "ADS",
  autores: ["Dário Matias Sales", "Gustavo Davi", "Pedro Emanue"] as string[],
  professor: "Artur Luiz Torres de Oliveira" as string,
  /** Link do Google Forms (o normal, de "Enviar → link"). Vazio = mostra instruções no slide. */
  formUrl: "" as string,
  /** Opcional: link curto (ex.: forms.gle/xxxx) exibido abaixo do QR code. */
  formShortUrl: "" as string,
};

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const EASE = [0.22, 1, 0.36, 1] as const;
/** Atraso base para que os elementos entrem depois da cortina de transição. */
export const BASE_DELAY = 0.5;
