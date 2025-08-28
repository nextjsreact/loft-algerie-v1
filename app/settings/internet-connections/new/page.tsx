"use client";

import { InternetConnectionTypeForm } from "@/components/forms/internet-connection-type-form";
import { Heading } from "@/components/ui/heading";
import { useTranslation } from "react-i18next";

export default function NewInternetConnectionTypePage() {
  const { t } = useTranslation('internetConnections');
  
  return (
    <div className="p-4">
      <Heading
        title={t('createConnectionType')}
        description={t('createConnectionTypeDescription')}
      />
      <div className="mt-6">
        <InternetConnectionTypeForm />
      </div>
    </div>
  );
}