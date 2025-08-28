"use client"

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { deleteZoneArea, ZoneArea } from "@/app/actions/zone-areas";
import { toast } from "@/components/ui/use-toast";
import { ResponsiveDataDisplay } from "@/components/ui/responsive-table";

interface ZoneAreaListProps {
  zoneAreas: ZoneArea[];
  onEdit: (zoneArea: ZoneArea) => void;
  onRefresh: () => void; // Add onRefresh prop
}

export function ZoneAreaList({ zoneAreas, onEdit, onRefresh }: ZoneAreaListProps) {
  const { t } = useTranslation('zoneAreas');
  
  const handleDelete = async (id: string) => {
    if (confirm(t('zoneAreas.deleteConfirm'))) {
      try {
        await deleteZoneArea(id);
        toast({
          title: t('common.success'),
          description: t('zoneAreas.deleteSuccess'),
        });
        onRefresh(); // Call onRefresh after successful delete
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('zoneAreas.deleteError'),
          variant: "destructive",
        });
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: t('zoneAreas.name'),
      render: (zoneArea: ZoneArea) => (
        <span className="font-medium">{zoneArea.name}</span>
      )
    }
  ];

  const renderActions = (zoneArea: ZoneArea) => (
    <div className="flex gap-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(zoneArea)}
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(zoneArea.id)}
        className="h-8 w-8 text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('zoneAreas.existingZoneAreas')}</h2>
      <ResponsiveDataDisplay
        data={zoneAreas}
        columns={columns}
        actions={renderActions}
        emptyMessage={t('zoneAreas.noZoneAreasYet')}
      />
    </div>
  );
}
