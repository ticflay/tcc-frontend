import { useTranslations } from "next-intl";

export default function FormInstructions() {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold">Bem-vindo ao ESGrow!</span>
      <p>Para iniciar a avaliação, você tem duas opções:</p>
      <p>
        <b>&quot;Iniciar em Branco&quot;</b>: Comece a avaliação sem nenhuma resposta
        preenchida.
      </p>
      <p>
        <b>&quot;Iniciar com Última Resposta&quot;</b>: Comece a avaliação com suas
        últimas respostas preenchidas, se você já realizou a avaliação
        anteriormente.
      </p>
      <p>
        A avaliação consiste em responder perguntas dentro de cada tópico ESG. Leia
        cuidadosamente cada pergunta e clique naquelas que se aplicam à sua
        organização para destacá-las como ativas. Se alguma <b>pergunta opcional
        não se aplicar ao contexto da sua organização</b>, você pode <b>descartá-la</b> clicando no ícone de lixeira ao lado da pergunta.
      </p>
      <p>
        Todas as suas respostas serão <b>salvas automaticamente</b>, permitindo que
        você interrompa a avaliação a qualquer momento e retome-a posteriormente
        sem perder o progresso.
      </p>
      <p>
        {" "}
        Obrigado por escolher o ESGrow! Esperamos que essa avaliação ajude sua
        empresa a entender e melhorar suas práticas em relação aos critérios
        ESG.{" "}
      </p>{" "}
        <b>Entenda o que é ESG.</b>
        <p> O termo ESG foi utilizado de forma oficial pela primeira vez em 2004 no relatório “Who Care Wins” da Iniciativa Global Compact das Nações Unidas. Trata-se de um conjunto de critérios, que incluem questões ambientais, sociais e de governança corporativa, que podem ser usadas por partes interessadas para entender como uma organização está gerenciando riscos e oportunidades relacionadas aos critérios ESG. </p>
        <p>O critério Ambiental refere-se à forma como a empresa se relaciona com o meio ambiente, podendo incluir práticas de gestão de resíduos, proteção da biodiversidade e mitigação de mudanças climáticas. </p>
        <p>O critério Social foca na forma como uma empresa se relaciona com funcionários, fornecedores, clientes e comunidades. Isso pode incluir práticas de trabalho justo, saúde e segurança e direitos humanos.</p>
        <p>O critério Governança diz respeito à forma como uma empresa é governada. Isso pode incluir sua estrutura do conselho e políticas de remuneração.</p>
    </div>
  );
}
