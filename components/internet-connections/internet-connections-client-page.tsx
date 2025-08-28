"use client";

import { getInternetConnectionTypes, deleteInternetConnectionType } from '@/app/actions/internet-connections';
import { Heading } from '@/components/ui/heading';
import { InternetConnectionTypeForm } from '@/components/forms/internet-connection-type-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { InternetConnectionType } from '@/lib/types';
import { useTranslation } from 'react-i18next';

export default function InternetConnectionsClientPage({
  initialInternetConnectionTypes,
}: {
  initialInternetConnectionTypes: InternetConnectionType[];
}) {
  const { t } = useTranslation();
  const [internetConnectionTypes, setInternetConnectionTypes] = useState<InternetConnectionType[]>(initialInternetConnectionTypes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInternetConnectionTypes(initialInternetConnectionTypes);
  }, [initialInternetConnectionTypes]);

  const handleDelete = async (id: string) => {
    try {
      await deleteInternetConnectionType(id);
      toast.success("Internet connection type deleted successfully.");
      setInternetConnectionTypes(internetConnectionTypes.filter(ict => ict.id !== id));
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const onCreated = (newType: InternetConnectionType) => {
    setInternetConnectionTypes([newType, ...internetConnectionTypes]);
  };

  return (
    <div className="bg-blue-50 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
      <Heading title={t('internetConnections.title')} description={t('internetConnections.subtitle')} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('internetConnections.addNewConnectionType')}</h2>
        <InternetConnectionTypeForm onCreated={onCreated} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('internetConnections.existingConnectionTypes')}</h2>
        {internetConnectionTypes && internetConnectionTypes.length > 0 ? (
          <ul className="space-y-4">
            {internetConnectionTypes.map((ict) => (
              <li key={ict.id} className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-center">
                <div>
                  <p className="font-medium">{ict.type} ({ict.speed} from {ict.provider})</p>
                  <p className="text-sm text-gray-600">{t('internetConnections.status')}: {ict.status}, {t('internetConnections.cost')}: {ict.cost}</p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/settings/internet-connections/${ict.id}`}>
                    <Button variant="outline" size="sm">{t('common.edit')}</Button>
                  </Link>
                  <form action={() => handleDelete(ict.id)}>
                    <Button type="submit" variant="destructive" size="sm">{t('common.delete')}</Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t('internetConnections.noConnectionTypesFound')}</p>
        )}
        </div>
      </div>
    </div>
  );
}
