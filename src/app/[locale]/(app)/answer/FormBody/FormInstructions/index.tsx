import { useTranslations } from "next-intl";

export default function FormInstructions() {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold">{t("Bem-vindo ao ESGrow")}!</span>
      <p>{t("Para iniciar a avaliação, você tem duas opções")}:</p>
      <p>
        <b>&quot;{t("Iniciar em Branco")}&quot;</b>:{" "}
        {t("Comece a avaliação sem nenhuma resposta preenchida")}.
      </p>
      <p>
        <b>&quot;{t("Iniciar com Última Resposta")}&quot;</b>:{" "}
        {t(
          "Comece a avaliação com suas últimas respostas preenchidas, se você já realizou a avaliação anteriormente"
        )}
        .
      </p>
      <p>
        {t(
          "instruction-1"
        )}{" "}
        <b>
          {t("pergunta opcional não se aplicar ao contexto da sua organização")}
        </b>
        , {t("você pode")} <b>{t("descartá-la")}</b>{" "}
        {t("clicando no ícone de lixeira ao lado da pergunta")}.{" "}
      </p>
      <p>
        {t("Todas as suas respostas serão")}{" "}
        <b>{t("salvas automaticamente")}</b>,{" "}
        {t(
          "permitindo que você interrompa a avaliação a qualquer momento e retome-a posteriormente sem perder o progresso"
        )}
        .
      </p>
      <p>
        {t(
          "Obrigado por escolher o ESGrow! Esperamos que essa avaliação ajude sua empresa a entender e melhorar suas práticas em relação aos critérios ESG"
        )}
        .{" "}
      </p>{" "}
      <b>{t("Entenda o que é ESG")}.</b>
      <p>
        {" "}
        {t(
          "instruction-esg-general"
        )}
        .{" "}
      </p>
      <p>
        {t(
          "instruction-esg-e"
        )}
        .{" "}
      </p>
      <p>
        {t(
          "instruction-esg-s"
        )}
        .
      </p>
      <p>
        {t(
          "instruction-esg-g"
        )}
        .
      </p>
    </div>
  );
}
