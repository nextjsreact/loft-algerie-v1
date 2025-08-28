"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InternetConnectionType } from "@/lib/types";
import {
  createInternetConnectionType,
  updateInternetConnectionType,
} from "@/app/actions/internet-connections";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { FormWrapper, FormSection } from "@/components/ui/form-wrapper";
import toast from "react-hot-toast";

const formSchema = z.object({
  type: z.string().min(1, "Type is required"),
  speed: z.string().nullable().optional(),
  provider: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  cost: z.coerce.number().nullable().optional(),
  created_at: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InternetConnectionTypeFormProps {
  initialData?: InternetConnectionType;
  onCreated?: (newType: InternetConnectionType) => void;
}

export function InternetConnectionTypeForm({
  initialData,
  onCreated,
}: InternetConnectionTypeFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || "",
      speed: initialData?.speed || "",
      provider: initialData?.provider || "",
      status: initialData?.status || "",
      cost: initialData?.cost || 0,
      created_at: initialData?.created_at || new Date().toISOString(),
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (initialData) {
        await updateInternetConnectionType(initialData.id, values);
        toast.success("Internet connection type updated successfully.");
      } else {
        const result = await createInternetConnectionType(
          values.type,
          values.speed,
          values.provider,
          values.status,
          values.cost
        );
        if (result.data && onCreated) {
          onCreated(result.data);
        }
        toast.success("Internet connection type created successfully.");
        form.reset();
      }
      router.push("/settings/internet-connections");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <FormWrapper 
      maxWidth="lg"
      title={initialData ? t('internetConnections.editConnectionType') : t('internetConnections.addNewConnectionType')}
      description={initialData ? t('internetConnections.updateConnectionInfo') : t('internetConnections.createNewConnectionType')}
      icon="🌐"
    >
      <FormSection 
        title={t('internetConnections.connectionDetails')}
        description={t('internetConnections.enterConnectionInfo')}
        icon="📡"
        colorScheme="purple"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('internetConnections.type')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('internetConnections.typePlaceholder')} {...field} value={field.value ?? ""} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('internetConnections.speed')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('internetConnections.speedPlaceholder')} {...field} value={field.value ?? ""} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('internetConnections.provider')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('internetConnections.providerPlaceholder')} {...field} value={field.value ?? ""} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('internetConnections.status')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('internetConnections.statusPlaceholder')} {...field} value={field.value ?? ""} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('internetConnections.cost')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder={t('internetConnections.costPlaceholder')} 
                        {...field} 
                        value={field.value?.toString() ?? ''} 
                        className="bg-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              {initialData ? t('internetConnections.saveChanges') : t('internetConnections.create')}
            </Button>
          </form>
        </Form>
      </FormSection>
    </FormWrapper>
  );
}
